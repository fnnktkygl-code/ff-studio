import 'dotenv/config';
import fetch from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';

async function run() {
    const inlineJson = (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '').trim();
    let authOptions = { scopes: ['https://www.googleapis.com/auth/cloud-platform'] };
    if (inlineJson) {
        authOptions.credentials = JSON.parse(inlineJson);
    } else {
        console.log("No CREDENTIALS_JSON found in env");
        return;
    }
    const auth = new GoogleAuth(authOptions);
    const client = await auth.getClient();
    const tokenObj = await client.getAccessToken();
    const token = tokenObj.token;
    const project = authOptions.credentials.project_id;

    const veoLocation = 'us-central1';
    let url = `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${veoLocation}/publishers/google/models/veo-2.0-generate-001:predictLongRunning`;
    let res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: 'Testing veo api polling' }], parameters: { aspectRatio: '9:16', durationSeconds: 5 } })
    });
    let data = await res.json();
    console.log("predictLongRunning response:", JSON.stringify(data, null, 2));

    let opName = data.name;
    if (!opName) return;

    const opMatch = opName.match(/(projects\/[^/]+\/locations\/[^/]+)\/.*(operations\/[^/]+)/);
    const strippedOpName = opMatch ? `${opMatch[1]}/${opMatch[2]}` : null;

    const testPoll = async (label, url) => {
        let pres = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        let pdata = await pres.json();
        console.log(`\n--- ${label} ---`);
        console.log(`URL: ${url}`);
        console.log(`Status: ${pres.status}`);
        console.log(`Response: ${JSON.stringify(pdata)}`);
    };

    await testPoll("Format 1 (raw v1beta1)", `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/${opName}`);
    await testPoll("Format 2 (raw v1)", `https://${veoLocation}-aiplatform.googleapis.com/v1/${opName}`);
    if (strippedOpName) {
        await testPoll("Format 3 (stripped v1beta1)", `https://${veoLocation}-aiplatform.googleapis.com/v1beta1/${strippedOpName}`);
        await testPoll("Format 4 (stripped v1)", `https://${veoLocation}-aiplatform.googleapis.com/v1/${strippedOpName}`);
    }
}

run().catch(console.error);
