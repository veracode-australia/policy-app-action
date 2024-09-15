import * as core from '@actions/core';
import { parseInputs } from './inputs';
import * as triggerScanService from './services/trigger-scan-service';
// import * as pipelineResultsService from './services/pipeline-results-service';
// import * as policyResultsService from './services/policy-results-services';
// import * as applicationService from './services/application-service';

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  const inputs = parseInputs(core.getInput);
  console.log(`Running action with inputs: ${JSON.stringify(inputs)}`);

  switch (inputs.action) {
    case 'triggerPolicyScan':
      await triggerScanService.triggerScanService(inputs);
      break;
    default:
      core.setFailed(`Invalid action: ${inputs.action}. Allowed actions are: triggerPolicyScan`);
  }
}
