import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface ExtendedStackProps extends cdk.StackProps {
  deployRegion: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    // S3 bucket props
    const commonBucketProps = {
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    };

    // Frontend S3 Bucket for the ZeroPoint GeoConsulting web application
    const frontendBucket = new s3.Bucket(this, 'ZeroPointGeoConsultingBucket', {
      bucketName: 'zeropoint-geoconsulting-webapp',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      ...commonBucketProps,
    });


    // CloudFront Distribution for ZeroPoint GeoConsulting WebApp 
    new cloudfront.Distribution(this, 'ZeroPointGeoConsultingWebAppDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Contact Form Lambda
    const contactFormFn = new NodejsFunction(this, 'ContactFormFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: 'src/lambdas/contact-form.ts',
      handler: 'lambdaHandler',
      bundling: {
        externalModules: ['@aws-sdk/*'],
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        TENANT_ID: process.env.MS_TENANT_ID || '',
        CLIENT_ID: process.env.MS_CLIENT_ID || '',
        CLIENT_SECRET: process.env.MS_CLIENT_SECRET || '',
      },
    });

    // -=== API Gateway ===-
    const api = new apigatewayv2.HttpApi(this, 'ZeroPointContactAPI', {
      apiName: 'ZeroPointContactAPI',
      description: 'ZeroPoint Contact API',
      createDefaultStage: true,
    });

    api.addRoutes({
      path: '/api/contact-form',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration('ContactFormIntegration', contactFormFn),
    });
  }
}
