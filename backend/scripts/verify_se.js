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

const verifySE = async () => {
    try {
        // 1. Login/Register
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}...`);

        let authResponse = await request('POST', '/api/auth/register', {
            name: 'SEVerifier',
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

        const seLabs = labs.filter(l => l.topic === 'social_engineering');
        console.log(`Found ${seLabs.length} Social Engineering labs.`);

        // 3. Find specific Lab (Beginner)
        const targetTitle1 = "Social Engineering - Tailgating (Piggybacking) Awareness";
        const lab1 = seLabs.find(l => l.title === targetTitle1);

        if (lab1) {
            console.log(`\n[VERIFIED] Found: ${targetTitle1}`);
            console.log(`Scenario: ${lab1.scenario.substring(0, 50)}...`);
            console.log(`Context: ${lab1.content.context}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle1}`);
            console.log('Sample SE Titles:', seLabs.slice(0, 5).map(l => l.title));
        }

        // 4. Find specific Lab (Intermediate)
        const targetTitle2 = "Social Engineering - Deepfake Video Conference";
        const lab2 = seLabs.find(l => l.title === targetTitle2);

        if (lab2) {
            console.log(`\n[VERIFIED] Found: ${targetTitle2}`);
            console.log(`Observation: ${lab2.content.observation}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle2}`);
        }

        // 5. Find specific Lab (Expert)
        const targetTitle3 = "Social Engineering - NLP-Based Spear Phishing Generation";
        const lab3 = seLabs.find(l => l.title === targetTitle3);

        if (lab3) {
            console.log(`\n[VERIFIED] Found: ${targetTitle3}`);
            console.log(`Source: ${lab3.content.source}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle3}`);
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

verifySE();
