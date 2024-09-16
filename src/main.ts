import * as core from '@actions/core';
import { parseInputs } from './inputs';
import { triggerService } from './services/trigger-service';

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  const inputs = parseInputs(core.getInput);

  await triggerService(inputs);

  // switch (inputs.action) {
  //   case 'triggerPolicyScan':
  //     await triggerService(inputs);
  //     break;
  //   case 'triggerGenerateTree':
  //       await triggerService(inputs);
  //       break;
  //   default:
  //     core.setFailed(`Invalid action: ${inputs.action}. Allowed actions are: triggerPolicyScan`);
  // }
}
