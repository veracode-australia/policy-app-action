import * as core from '@actions/core';
import { parseInputs } from './inputs';
// import * as policyService from './services/policy-service';
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
      break;
    default:
      core.setFailed(`Invalid action: ${inputs.action}. Allowed actions are: triggerPolicyScan`);
  }
}
