import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as cfOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';

export class FrontendAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'AssetsBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const cfDistribution = new cf.Distribution(this, 'AppDistribution', {
      defaultBehavior: {
        origin: new cfOrigins.S3Origin(bucket),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new s3Deployment.BucketDeployment(this, 'AppDeployment', {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset('./dist')],
      distribution: cfDistribution,
    });

    new CfnOutput(this, 'FrontendAppDNS', {
      value: cfDistribution.distributionDomainName
    })
  }
}
