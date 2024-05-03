**WARNING: THIS REPO INCLUDES EXAMPLES ONLY AND NO SUPPORT IS PROVIDED!**

## About Me

I'm a seasoned technical leader with over 25 years of experience building scalable systems and driving strategic innovation at industry-leading companies like Amazon, Northwoods Consulting, and Townsend Analytics. With 10+ years of people management experience, including successfully leading teams of managers, I excel at empowering high-performing, cross-functional teams and promoting a culture of continuous learning and improvement.

My technical expertise focuses on cloud services, backend infrastructure, serverless development, APIs, microservices, AI/ML, database design, and event-driven architecture. I leverage data-driven insights, Agile methodologies, and innovative solutions to deliver successful projects that address complex business challenges. Certified in AWS, Microsoft, and Scrum, I also develop comprehensive training programs to ensure my teams remain at the forefront of evolving technologies.

With a strong customer-centric mindset, I align technology solutions with real-world needs, making me a valuable asset for organizations seeking a dynamic technology leader to drive transformative results.

Social Media: [LinkedIn](https://www.linkedin.com/in/gregtx/) | [Twitter](https://twitter.com/ServerlessGuy)  
Certifications: [Microsoft](https://learn.microsoft.com/en-us/users/gregtx/transcript/7olk8u8e5qz9n9l) | [Credly](https://www.credly.com/users/gregtx/) | [BadgeCert](https://bcert.me/bc/html/show-badge.html?b=pkgebblx)

## In This Repo

AWS code samples, architecture diagrams, CloudFormation and SAM templates, Serverless applications, and more.

1. [Amazon CloudFront with on-the-fly Image Resizing](./cloudfront-resize-image/) - Serve images through Amazon CloudFront with support for on-the-fly image resizing.
1. [S3 Cross-Account Replication with KMS](./s3-cross-account-replication-with-kms) - Replicate objects between two S3 buckets in different accounts within the same region using server-side encryption with customer-managed KMS keys.

## Public Gists

1. [Amazon Athena Query](https://gist.github.com/gadavis2/3bb03e724a4dd27c73af731ff9e68e21) - An example Node.js Lambda function that queries Amazon Athena. The example includes using NextToken in a loop to retrieve all of the query results, and the logic to extract the column names and rows from the response.
1. [UUID to Shard Id](https://gist.github.com/gadavis2/faf3d888a3110409b97bc18a59d7c807) - This function will convert a UUID into an integer which can be used for data sharding.
1. [Consistent Hashing Function](https://gist.github.com/gadavis2/d75fcbc40e841ccde5b35cde0ca8858a) - This solution uses a hash function to determine the hash ring position for UUID, IPv4, and IPv6. It is an example of distributed storage/caching using consistent hashing.

## External Links

1. [API Gateway HTTP API to Lambda](https://serverlessland.com/patterns/apigw-lambda) - This pattern creates an Amazon API Gateway HTTP API with a default route and basic CORS configuration that integrates with an AWS Lambda function.
1. [API Gateway REST API to DynamoDB](https://serverlessland.com/patterns/apigw-dynamodb) - This pattern creates an Amazon API Gateway REST API, with an API key, that integrates directly with an Amazon DynamoDB table. Referenced in two AWS Compute Blogs: [Exploring serverless patterns for Amazon DynamoDB](https://aws.amazon.com/blogs/compute/exploring-serverless-patterns-for-amazon-dynamodb/) | [Using Amazon API Gateway as a proxy for DynamoDB](https://aws.amazon.com/blogs/compute/using-amazon-api-gateway-as-a-proxy-for-dynamodb/)
1. [Lambda to SSM Parameter Store](https://serverlessland.com/patterns/lambda-ssm) - This pattern creates an AWS Lambda function that uses the AWS Systems Manager Parameter Store to GET and PUT parameters.
1. [Lambda to S3 via a Custom Resource](https://serverlessland.com/patterns/lambda-s3-cfn) - This pattern creates an Amazon S3 object (text or html) by using an AWS CloudFormation custom resource and an AWS Lambda function. Referenced in an AWS Management and Governance Blog: [Managing resources using AWS CloudFormation Resource Types](https://aws.amazon.com/blogs/mt/managing-resources-using-aws-cloudformation-resource-types/)
1. [Lambda to Aurora Serverless](https://serverlessland.com/patterns/lambda-aurora) - This pattern creates an AWS Lambda function that performs CRUD operations in an Amazon Aurora Serverless DB cluster with Data API and a Secrets Manager secret.
1. [Amazon S3 to S3 Object Lambda](https://serverlessland.com/patterns/s3-object-lambda) - This pattern creates an S3 Object Lambda Access Point that returns a thumbnail version of an image in S3. Referenced in an AWS News Blog: [Introducing Amazon S3 Object Lambda – Use Your Code to Process Data as It Is Being Retrieved from S3](https://aws.amazon.com/blogs/aws/introducing-amazon-s3-object-lambda-use-your-code-to-process-data-as-it-is-being-retrieved-from-s3/)
1. [AWS Lambda Layer and SSM Paramter Store](https://serverlessland.com/patterns/lambda-layer-ssm-parameters) - This AWS SAM application is an example of using a Lambda Layer and the SSM Parameter Store to centrally manage configuration values that can be used by multiple Lambda functions within the same account and region.
