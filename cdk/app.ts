#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FrontendAppStack } from './lib/frontend-app-stack';

const app = new cdk.App();
new FrontendAppStack(app, 'FrontendAppStack');
