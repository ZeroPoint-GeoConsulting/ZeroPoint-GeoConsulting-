import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

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

  }
}
