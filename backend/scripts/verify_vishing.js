const http = require('http');
const fs = require('fs');

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error('Error parsing JSON:', data);
                    resolve({ success: false, raw: data });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const verifyVishing = async () => {
    try {
        // 1. Login/Register
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}...`);

        let authResponse = await request('POST', '/api/auth/register', {
            name: 'VishingVerifier',
            email,
            password
        });

        if (!authResponse.success) {
            // Try login if register fails (duplicate)
            authResponse = await request('POST', '/api/auth/login', { email, password });
        }

        const token = authResponse.token;
        if (!token) throw new Error('No token received');
        console.log('Token received.');

        // 2. Fetch all labs (limit 1000)
        console.log('Fetching labs...');
        const labsResponse = await request('GET', '/api/labs?limit=1000', null, token);

        if (!labsResponse.success) {
            throw new Error(`Failed to fetch labs: ${JSON.stringify(labsResponse)}`);
        }

        const labs = labsResponse.data;
        console.log(`Fetched ${labs.length} labs.`);

        const vishingLabs = labs.filter(l => l.topic === 'vishing');
        console.log(`Found ${vishingLabs.length} Vishing labs.`);

        // 3. Find specific Vishing Lab (Beginner)
        const targetTitle1 = "Vishing - Tech Support Scam";
        const lab1 = vishingLabs.find(l => l.title === targetTitle1);

        if (lab1) {
            console.log(`\n[VERIFIED] Found: ${targetTitle1}`);
            console.log(`Scenario: ${lab1.scenario.substring(0, 50)}...`);
            console.log(`Caller: ${lab1.content.call_log ? lab1.content.call_log.caller : 'MISSING'}`);
            console.log(`Transcript: ${lab1.content.call_log ? lab1.content.call_log.transcript.substring(0, 50) : 'MISSING'}...`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle1}`);
            console.log('Sample Vishing Titles:', vishingLabs.slice(0, 5).map(l => l.title));
        }

        // 4. Find specific Vishing Lab (Intermediate)
        const targetTitle2 = "Vishing - Caller ID Spoofing Analysis";
        const lab2 = vishingLabs.find(l => l.title === targetTitle2);

        if (lab2) {
            console.log(`\n[VERIFIED] Found: ${targetTitle2}`);
            console.log(`Caller ID: ${lab2.content.caller_id}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle2}`);
        }

        // 5. Find specific Vishing Lab (Advanced - Deepfake)
        const targetTitle3 = "Vishing - Deepfake Voice Cloning (CEO Fraud)";
        const lab3 = vishingLabs.find(l => l.title === targetTitle3);

        if (lab3) {
            console.log(`\n[VERIFIED] Found: ${targetTitle3}`);
            console.log(`Audio Analysis: ${lab3.content.audio_analysis}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle3}`);
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

verifyVishing();
