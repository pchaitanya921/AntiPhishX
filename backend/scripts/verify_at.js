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

const verifyAT = async () => {
    try {
        // 1. Login/Register
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}...`);

        let authResponse = await request('POST', '/api/auth/register', {
            name: 'ATVerifier',
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

        const atLabs = labs.filter(l => l.topic === 'advanced_threats');
        console.log(`Found ${atLabs.length} Advanced Threat labs.`);

        // 3. Find specific Lab (Beginner)
        const targetTitle1 = "Advanced Threats - Supply Chain Attack Concept";
        const lab1 = atLabs.find(l => l.title === targetTitle1);

        if (lab1) {
            console.log(`\n[VERIFIED] Found: ${targetTitle1}`);
            console.log(`Scenario: ${lab1.scenario.substring(0, 50)}...`);
            console.log(`Example: ${lab1.content.example}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle1}`);
            console.log('Sample AT Titles:', atLabs.slice(0, 5).map(l => l.title));
        }

        // 4. Find specific Lab (Intermediate)
        const targetTitle2 = "Advanced Threats - Docker Container Escape";
        const lab2 = atLabs.find(l => l.title === targetTitle2);

        if (lab2) {
            console.log(`\n[VERIFIED] Found: ${targetTitle2}`);
            console.log(`Flag: ${lab2.content.flag}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle2}`);
        }

        // 5. Find specific Lab (Expert)
        const targetTitle3 = "Advanced Threats - Satellite Hacking (Signal Spoofing)";
        const lab3 = atLabs.find(l => l.title === targetTitle3);

        if (lab3) {
            console.log(`\n[VERIFIED] Found: ${targetTitle3}`);
            console.log(`Vuln: ${lab3.content.vuln}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle3}`);
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

verifyAT();
