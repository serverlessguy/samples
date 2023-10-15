**WARNING: THIS REPO INCLUDES EXAMPLES ONLY AND NO SUPPORT IS PROVIDED!**

## About Me

I am a seasoned servant leader with a proven track record in diverse technical domains, specializing in people, product, and project management. With 25+ years of professional, technical, and leadership experience, I have successfully navigated roles such as Senior Engineering Manager at AWS, Director of Training and Development, Solutions Architect Manager, Software Development Engineer, Database Engineer, and Business Development Manager. Throughout my career, I have honed my skills in leading, coaching, and mentoring highly technical teams and building software for scalable, distributed systems. I have 8+ years of people management experience, including managing managers.

My work philosophy revolves around embracing high-velocity decision making, differentiating between reversible and irreversible choices, and using the 80/20 rule to prioritize essential tasks while maintaining high standards. I encourage a fearless approach to mistakes, seeing them as valuable lessons. I work backwards from customer problems to create effective solutions. I use mechanisms to tackle recurring challenges and capitalize on new opportunities.

My technical expertise extends across a wide spectrum of technologies, cloud services, and programming languages, with a particular focus on backend infrastructure, serverless development, microservices, event-driven architecture, purpose-built databases, data engineering, and data analysis. I excel in leveraging APIs, JavaScript, TypeScript, SQL, AI/ML, Infrastructure as Code, and automated deployment pipelines to drive projects to success.

I hold several prestigious technical certifications, including AWS Solutions Architect Professional, AWS DevOps Engineer Professional, Microsoft Certified Solutions Associate SQL Server, and Certified Scrum Master. My diverse skill set and extensive experience make me a valuable asset for any organization seeking a dynamic leader with a proven history of delivering results in the field of software engineering, solutions architecture, and technology management.

Thank you for taking the time to get acquainted with my professional journey!

## In This Repo

AWS code samples, architecture diagrams, CloudFormation and SAM templates, Serverless applications, and more.

1. [Amazon CloudFront with on-the-fly Image Resizing](./cloudfront-resize-image/) - Serve images through Amazon CloudFront with support for on-the-fly image resizing.
1. [S3 Cross-Account Replication with KMS](./s3-cross-account-replication-with-kms) - Replicate objects between two S3 buckets in different accounts within the same region using server-side encryption with customer-managed KMS keys.

## Public Gists

1. [Amazon Athena Query](https://gist.github.com/gadavis2/3bb03e724a4dd27c73af731ff9e68e21) - An example Node.js Lambda function that queries Amazon Athena. The example includes using NextToken in a loop to retrieve all of the query results, and the logic to extract the column names and rows from the response.
1. [UUID to Shard Id](https://gist.github.com/gadavis2/faf3d888a3110409b97bc18a59d7c807) - This function will convert a UUID into an integer which can be used for data sharding.

## External Links

1. [API Gateway HTTP API to Lambda](https://serverlessland.com/patterns/apigw-lambda) - This pattern creates an Amazon API Gateway HTTP API with a default route and basic CORS configuration that integrates with an AWS Lambda function.
1. [API Gateway REST API to DynamoDB](https://serverlessland.com/patterns/apigw-dynamodb) - This pattern creates an Amazon API Gateway REST API, with an API key, that integrates directly with an Amazon DynamoDB table. Referenced in two AWS Compute Blogs: [Exploring serverless patterns for Amazon DynamoDB](https://aws.amazon.com/blogs/compute/exploring-serverless-patterns-for-amazon-dynamodb/) | [Using Amazon API Gateway as a proxy for DynamoDB](https://aws.amazon.com/blogs/compute/using-amazon-api-gateway-as-a-proxy-for-dynamodb/)
1. [Lambda to SSM Parameter Store](https://serverlessland.com/patterns/lambda-ssm) - This pattern creates an AWS Lambda function that uses the AWS Systems Manager Parameter Store to GET and PUT parameters.
1. [Lambda to S3 via a Custom Resource](https://serverlessland.com/patterns/lambda-s3-cfn) - This pattern creates an Amazon S3 object (text or html) by using an AWS CloudFormation custom resource and an AWS Lambda function. Referenced in an AWS Management and Governance Blog: [Managing resources using AWS CloudFormation Resource Types](https://aws.amazon.com/blogs/mt/managing-resources-using-aws-cloudformation-resource-types/)
1. [Lambda to Aurora Serverless](https://serverlessland.com/patterns/lambda-aurora) - This pattern creates an AWS Lambda function that performs CRUD operations in an Amazon Aurora Serverless DB cluster with Data API and a Secrets Manager secret.
1. [Amazon S3 to S3 Object Lambda](https://serverlessland.com/patterns/s3-object-lambda) - This pattern creates an S3 Object Lambda Access Point that returns a thumbnail version of an image in S3. Referenced in an AWS News Blog: [Introducing Amazon S3 Object Lambda – Use Your Code to Process Data as It Is Being Retrieved from S3](https://aws.amazon.com/blogs/aws/introducing-amazon-s3-object-lambda-use-your-code-to-process-data-as-it-is-being-retrieved-from-s3/)
1. [AWS Lambda Layer and SSM Paramter Store](https://serverlessland.com/patterns/lambda-layer-ssm-parameters) - This AWS SAM application is an example of using a Lambda Layer and the SSM Parameter Store to centrally manage configuration values that can be used by multiple Lambda functions within the same account and region.
