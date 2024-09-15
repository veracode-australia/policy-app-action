// import * as core from '@actions/core';
// import * as InputService from '../inputs';
// import * as ApplicationService from '../services/application-service';
//
// export async function getPolicyNameByProfileName(inputs: InputService.Inputs): Promise<void> {
//   const appname = inputs.appname;
//   const vid = inputs.vid;
//   const vkey = inputs.vkey;
//
//   try {
//     const application = await ApplicationService.getApplicationByName(appname, vid, vkey);
//     core.setOutput('policy_name', application.profile.policies[0].name);
//   } catch (error) {
//     core.info(`No application found with name ${appname}`);
//     core.setOutput('policy_name', '');
//   }
// }
