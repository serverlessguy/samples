## Prerequisites

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) installed and configured with access to an AWS Account.
1. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
<!--- 
1. [Python3](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/latest/installation/). The most recent version of Python includes pip.
1. [Greengrass Development Kit (GDK) CLI](https://github.com/aws-greengrass/aws-greengrass-gdk-cli)
  - To install the latest version of the GDK CLI: `pip3 install git+https://github.com/aws-greengrass/aws-greengrass-gdk-cli.git@v1.6.1`
  - Run `gdk --help` or `gdk --version` to check if the GDK CLI is successfully installed.
--->

## Installation

### Create GreengrassV2TokenExchangeRole

1. Change to the "iot-greengrass" directory: `cd iot-greengrass`
2. Deploy the "iam.yaml" to create the GreengrassV2TokenExchangeRole. Note that the "iam.yaml" file does not create the IAM Policy named "GreengrassV2TokenExchangeRoleAccess". That policy is generated automatically, and attached to the IAM Role named "GreengrassV2TokenExchangeRole", after the first Greengrass core device is created.
```
aws cloudformation deploy --template-file iam.yaml --stack-name greengrass-v2-token-exchange-role-stack --capabilities CAPABILITY_NAMED_IAM
```

### Create Lambda Function

1. Change to the "iot-greengrass/lambda-function" directory: `cd lambda-function`
2. Build the Lambda function with all dependencies by using AWS SAM:
```
sam build
```
3. Deploy the Lambda function to AWS:
```
sam deploy --guided
```

```
Example SAM Deploy:
Stack Name [sam-app]: *demo-greengrass-function*
AWS Region [us-east-1]:          
Parameter AppName [demo-greengrass]: 
Parameter IoTResponseTopic [demo-greengrass/response]: 
#Shows you resources changes to be deployed and require a 'Y' to initiate deploy
Confirm changes before deploy [y/N]: N
#SAM needs permission to be able to create roles to connect to the resources in your template
Allow SAM CLI IAM role creation [Y/n]: Y
#Preserves the state of previously provisioned resources when an operation fails
Disable rollback [y/N]: N
Save arguments to configuration file [Y/n]: Y
SAM configuration file [samconfig.toml]: 
SAM configuration environment [default]:
```

### Create Greengrass Lambda Component

1. Documentation: [Import a Lambda function as a component](https://docs.aws.amazon.com/greengrass/v2/developerguide/import-lambda-function-cli.html)
2. Change to the "iot-greengrass/lambda-function-component" directory: `cd ../lambda-function-component`
3. Update the "lambda-config.json" configuration file
  - Update "lambdaArn" to match the LambdaVersionArn from the SAM deploy CloudFormation output. You must specify an ARN that includes the version of the function. You can't use version aliases like $LATEST.
  - Update the "AWS_REGION" environment variable to match the region where this demo is being deployed (eg: us-east-1).
4. Create the Greengrass Lambda function component:
```
aws greengrassv2 create-component-version --cli-input-json file://lambda-config.json
```
5. Go to the [Greengrass Components console](https://us-east-1.console.aws.amazon.com/iot/home?region=us-east-1#/greengrass/v2/components) to verify the new Lambda function component is in the DEPLOYABLE status.

### Setup Greengrass Device

1. Change to the "iot-greengrass" directory: `cd ..`
2. Deploy the "template.yaml":
```
aws cloudformation deploy --template-file template.yaml --stack-name demo-greengrass-stack --tags AppName=demo-greengrass --parameter-overrides MyIp=0.0.0.0/32 --capabilities CAPABILITY_IAM
```
Here is an overview of what this CloudFormation stack provisions:

  - IAM Policy that allows Greengrass devices to provision themselves.
  - IoT Thing Group. When Greengrass is installed on a device, it associates the device with this Thing Group.
  - EC2 Instance (Debian Linux, arm64, t4g.nano) that acts as an IoT Greengrass device.
    - Instance role and profile
    - Key pair (rsa, ppk)
    - Security Group with SSH access
    - UserData script:
      - Update/upgrade installed packages
      - Install unzip and JDK (for Greengrass)
      - Download and install NodeJs 20 runtime (for Lambda Function component)
      - Download and install Greengrass
      - Modify GRUB configuration to support cgroups v1 for Greengrass containerized Lambda functions
      - Reboot instance
  - IoT Greengrass Deployment to configure the aws.greengrass.Nucleus JVM options to optimize for a low memory device and aws.greengrass.LogManager to configure CloudWatch logging.
3. Query the output from the CloudFormation stack:
```
aws cloudformation describe-stacks --stack-name demo-greengrass-stack --query 'Stacks[0].Outputs'
```
4. Copy the output value ThingGroupARN for later use when deploying the Greengrass Lambda function component.
5. (Optional) Connect to instance with an SSH client(eg: PuTTy) to confirm Greengrass installation.
  - Retrieve the EC2 keypair from the SSM Parameter Store (eg: /ec2/keypair/key-{KeyId}) and create a "keypair.ppk" file with the private key material.
  - PuTTy configuration:
    - Connection > SSH > Auth: Browse to the "keypair.ppk" file.
    - Connection > Data > Auto-login username: admin
    - Session > Host Name: Public DNS of EC2 instance (eg: ec2-0.0.0.0.compute-1.amazonaws.com)
  - Watch the deployment occur on the EC2 instance by monitoring the log: `sudo tail -n 50 -F /greengrass/v2/logs/greengrass.log`
  - Verify the aws.greengrass.Nucleus component configuration update with the following command: `sudo cat /greengrass/v2/config/effectiveConfig.yaml | grep jvmOptions`
6. Go to [Greengrass Core Devices](https://us-east-1.console.aws.amazon.com/iot/home?region=us-east-1#/greengrass/v2/cores) in the AWS Management Console to verify that the EC2 instance is registered as a Greengrass device before proceeding with the installation process. It may take a few minutes after the EC2 instance is launched to see it registered as a Greengrass device.

### Create Deployment for the Greengrass Lambda Component

1. List Greengrass components: `aws greengrassv2 list-components`
  - Copy the componentVersion of the com.example.LambdaFunctionComponent (eg: 1.0.0).
2. Update the "deployment.json" configuration file:
  - Update the targetArn to match the ThingGroupARN from the original CloudFormation output. You should only need to update the Region and AccountId.
  - Update the componentVersion of the com.example.LambdaFunctionComponent if needed. Refer to the Greengrass components list from a previous step.
3. Create a new Greengrass Deployment:
```
aws greengrassv2 create-deployment --cli-input-json file://deployment.json
```
4. Monitor the deployment from the IoT [Greengrass Deployment console](https://us-east-1.console.aws.amazon.com/iot/home?region=us-east-1#/greengrass/v2/deployments) to verity it completes successfully.
5. View com.example.LambdaFunctionComponent logs on the EC2 instance: `sudo tail -n 50 -f /greengrass/v2/logs/com.example.LambdaFunctionComponent.log`

### MQTT Test

1. From the [MQTT test client](https://us-east-1.console.aws.amazon.com/iot/home?region=us-east-1#/test) in the AWS IoT Management Console, subscribe to all topics using #.
2. Publish any message to the topic "demo-greengrass/request".
3. If everything worked, you should see a message in the "demo-greengrass/response" topic.

## Required for Dynamic Thing Groups

Configure IoT Fleet Indexing through the AWS CLI or Management Console.
- AWS CLI: `aws iot update-indexing-configuration --thing-indexing-configuration thingIndexingMode=REGISTRY_AND_SHADOW,thingConnectivityIndexingMode=STATUS`
- AWS Management Console: AWS Iot > Settings > [Fleet indexing](https://us-east-1.console.aws.amazon.com/iot/home?region=us-east-1#/settings/indexing)