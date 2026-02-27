import fetch from 'node-fetch';

async function run() {
    const url = 'https://us-central1-aiplatform.googleapis.com/$discovery/rest?version=v1';
    let res = await fetch(url);
    let data = await res.json();

    // Find all methods named 'get' under any resource structure that might handle operations
    const findGetOps = Object.keys(data.resources || {}).forEach(resName => {
        findOps(data.resources[resName], resName);
    });

    function findOps(resource, path) {
        if (resource.methods && resource.methods.get && path.includes('operation')) {
            console.log(`Found GET operation: ${path} -> flatPath: ${resource.methods.get.flatPath}`);
        }
        if (resource.resources) {
            Object.keys(resource.resources).forEach(childName => {
                findOps(resource.resources[childName], `${path}.${childName}`);
            });
        }
    }
}
run().catch(console.error);
