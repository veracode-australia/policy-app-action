import * as core from '@actions/core';
import { parseInputs } from './inputs';
import * as triggerScanService from './services/trigger-scan-service';

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  const inputs = parseInputs(core.getInput);

  switch (inputs.action) {
    case 'triggerPolicyScan':
      await triggerScanService.triggerScanService(inputs);
      break;
    default:
      core.setFailed(`Invalid action: ${inputs.action}. Allowed actions are: triggerPolicyScan`);
  }
}
