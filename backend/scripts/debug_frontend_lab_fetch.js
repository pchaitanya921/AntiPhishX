const http = require('http');

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

const debugFrontendFetch = async () => {
    try {
        // 1. Login
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}...`);

        let authResponse = await request('POST', '/api/auth/register', {
            name: 'FrontendDebugger',
            email,
            password
        });

        if (!authResponse.success) {
            authResponse = await request('POST', '/api/auth/login', { email, password });
        }

        const token = authResponse.token;
        if (!token) throw new Error('No token received');
        console.log('Token received.');

        // 2. Simulate User Fetching "Email Phishing - Beginner"
        // Frontend sends: /labs?topic=phishing&level=beginner
        console.log('\n--- Test 1: Email Phishing (Beginner) ---');
        const res1 = await request('GET', '/api/labs?topic=phishing&level=beginner', null, token);
        if (res1.success) {
            console.log(`Status: Success. Count: ${res1.count}`);
            if (res1.data.length > 0) {
                console.log('First Lab:', res1.data[0].title);
                console.log('Type:', res1.data[0].type);
            } else {
                console.log('Result: EMPTY ARRAY');
            }
        } else {
            console.log('Status: Failed', res1);
        }

        // 3. Simulate User Fetching "Malware Detection - Beginner"
        // Frontend sends: /labs?topic=malware_detection&level=beginner
        console.log('\n--- Test 2: Malware Detection (Beginner) ---');
        const res2 = await request('GET', '/api/labs?topic=malware_detection&level=beginner', null, token);
        if (res2.success) {
            console.log(`Status: Success. Count: ${res2.count}`);
            if (res2.data.length > 0) {
                console.log('First Lab:', res2.data[0].title);
                console.log('Type:', res2.data[0].type);
            } else {
                console.log('Result: EMPTY ARRAY');
            }
        } else {
            console.log('Status: Failed', res2);
        }

    } catch (err) {
        console.error('Debug failed:', err);
    }
};

debugFrontendFetch();
