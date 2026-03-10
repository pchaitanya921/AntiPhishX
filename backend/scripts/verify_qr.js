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

const verifyQR = async () => {
    try {
        // 1. Login/Register
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}...`);

        let authResponse = await request('POST', '/api/auth/register', {
            name: 'QRVerifier',
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

        const qrLabs = labs.filter(l => l.topic === 'qr_code');
        console.log(`Found ${qrLabs.length} QR labs.`);

        // 3. Find specific QR Lab (Beginner)
        const targetTitle1 = "QR Attacks - Parking Meter Quishing";
        const lab1 = qrLabs.find(l => l.title === targetTitle1);

        if (lab1) {
            console.log(`\n[VERIFIED] Found: ${targetTitle1}`);
            console.log(`Scenario: ${lab1.scenario.substring(0, 50)}...`);
            console.log(`Decoded URL: ${lab1.content.decoded_url}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle1}`);
            console.log('Sample QR Titles:', qrLabs.slice(0, 5).map(l => l.title));
        }

        // 4. Find specific QR Lab (Intermediate)
        const targetTitle2 = "QR Attacks - Malicious vCard (Contact) QR";
        const lab2 = qrLabs.find(l => l.title === targetTitle2);

        if (lab2) {
            console.log(`\n[VERIFIED] Found: ${targetTitle2}`);
            console.log(`Payload: ${lab2.content.payload.substring(0, 30)}...`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle2}`);
        }

        // 5. Find specific QR Lab (Advanced)
        const targetTitle3 = "QR Attacks - Malicious Configuration Profile (iOS)";
        const lab3 = qrLabs.find(l => l.title === targetTitle3);

        if (lab3) {
            console.log(`\n[VERIFIED] Found: ${targetTitle3}`);
            console.log(`Prompt: ${lab3.content.prompt}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle3}`);
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

verifyQR();
