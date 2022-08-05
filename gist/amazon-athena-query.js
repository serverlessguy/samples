// WARNING: THIS SOLUTION IS AN EXAMPLE ONLY AND NO SUPPORT IS PROVIDED!
// An example Node.js Lambda function that queries Amazon Athena.
// The example includes using NextToken in a loop to retrieve all of the query results, and the logic to extract the column names and rows from the response.
// This script will not work unless you use values and configuration in the paramsQuery object that match your environment.

const AWS = require("aws-sdk");
const athena = new AWS.Athena();

// Function to build an array of rows from the Athena query results
function processRows(queryResults, rows, cols) {
  queryResults.ResultSet.Rows.map((result) => {
    let row = {};
    result.Data.map((r, i) => {
      row[cols[i]] = r.VarCharValue;
    });
    rows.push(row);
  });
  return rows;
}

exports.handler = async (event) => {
  // Start Athena query
  const paramsQuery = {
    WorkGroup: "workgroup-name",
    QueryExecutionContext: { Database: "database-name" },
    QueryString: `SELECT * FROM table LIMIT 100;`,
    ResultConfiguration: {
      OutputLocation: "athena-bucket-name",
      EncryptionConfiguration: { EncryptionOption: "SSE_S3" },
    },
  };
  const queryExecution = await athena.startQueryExecution(paramsQuery).promise();
  console.log("QueryExecutionId: ", queryExecution.QueryExecutionId);

  // Check if Athena query status is complete
  // Use retry and timeout with exponential backoff to check Athena query status
  let queryStatus = "";
  const paramsStatus = { QueryExecutionId: queryExecution.QueryExecutionId };
  const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
  for (let i = 1; i < 12; i++) {
    await timeout(Math.min(30000, i * 3000));
    queryStatus = await athena.getQueryExecution(paramsStatus).promise();
    console.log("QueryExecutionStatus: ", queryStatus.QueryExecution.Status.State);
    if (queryStatus.QueryExecution.Status.State === "SUCCEEDED") {
      break;
    }
  }

  // If Athena query completes successfully then proceed
  if (queryStatus.QueryExecution.Status.State === "SUCCEEDED") {
    // Get Athena query results
    let paramsResults = {
      QueryExecutionId: queryExecution.QueryExecutionId,
      MaxResults: 1000,
    };
    let queryResults = await athena.getQueryResults(paramsResults).promise();

    // Build an array of columns from the Athena query results
    let cols = [];
    queryResults.ResultSet.ResultSetMetadata.ColumnInfo.map((c) => {
      cols.push(c.Name);
    });

    // Get first batch of rows
    let rows = processRows(queryResults, [], cols);

    // Get additional Athena query results if more than MaxResults
    while (queryResults.NextToken) {
      paramsResults = {
        QueryExecutionId: queryExecution.QueryExecutionId,
        MaxResults: 1000,
        NextToken: queryResults.NextToken,
      };
      queryResults = await athena.getQueryResults(paramsResults).promise();
      // Get additional batch of rows
      rows = processRows(queryResults, rows, cols);
    }

    // Remove the first row, since it contains the column names only
    rows.shift();

    // Loop through all rows and log each row
    for (const row of rows) {
      console.log(row);
    }

    return rows.length;
  } else {
    console.log("ERROR: Query execution did not complete within an acceptable time limit");
    return;
  }
};
