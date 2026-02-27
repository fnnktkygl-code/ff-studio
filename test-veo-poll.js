import { GoogleAuth } from 'google-auth-library';

async function run() {
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenObj = await client.getAccessToken();
    const token = tokenObj.token;
    const project = await auth.getProjectId();

    const veoLocation = 'us-central1';
    const url = `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${veoLocation}/publishers/google/models/veo-2.0-generate-001:predictLongRunning`;

    console.log('Sending predictLongRunning request...');
    const submitRes = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: [{ prompt: 'A cinematic shot of a testing script' }],
            parameters: { aspectRatio: '9:16', personGeneration: 'allow_adult', durationSeconds: 5 }
        }),
    });

    const submitResult = await submitRes.json();
    console.log('Submit result:', JSON.stringify(submitResult, null, 2));

    if (!submitResult.name) return;

    const rawOperationName = submitResult.name;

    // Format 1: raw name with v1beta1
    let poll1 = `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/${rawOperationName}`;
    let res1 = await fetch(poll1, { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('Poll Format 1 (v1beta1 raw):', res1.status, await res1.text());

    // Format 2: raw name with v1
    let poll2 = `https://${veoLocation}-aiplatform.googleapis.com/v1/${rawOperationName}`;
    let res2 = await fetch(poll2, { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('Poll Format 2 (v1 raw):', res2.status, await res2.text());

    // stripped name: 
    const opMatch = rawOperationName.match(/(projects\/[^/]+\/locations\/[^/]+)\/.*(operations\/[^/]+)/);
    const strippedOpName = `${opMatch[1]}/${opMatch[2]}`;

    // Format 3: stripped name with v1beta1
    let poll3 = `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/${strippedOpName}`;
    let res3 = await fetch(poll3, { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('Poll Format 3 (v1beta1 stripped):', res3.status, await res3.text());

    // Format 4: stripped name with v1
    let poll4 = `https://${veoLocation}-aiplatform.googleapis.com/v1/${strippedOpName}`;
    let res4 = await fetch(poll4, { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('Poll Format 4 (v1 stripped):', res4.status, await res4.text());

}

run().catch(console.error);
