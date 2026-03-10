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
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    console.error('Response:', data);
                    resolve(data);
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const verify = async () => {
    try {
        // 1. Register/Login
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'Password@123';

        console.log(`Registering user: ${email}...`);
        const authResponse = await request('POST', '/api/auth/register', {
            firstName: 'Verification',
            lastName: 'Bot',
            email: email,
            password: password,
            role: 'learner'
        });

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

        // Dump all titles to file
        fs.writeFileSync('all_titles.txt', labs.map(l => l.title).join('\n'));
        console.log('Titles dumped to all_titles.txt');
        if (labs.length > 0) {
            console.log(`First Lab Title: ${labs[0].title}`);
        } else {
            console.log('No labs fetched from API.');
        }

        // 3. Find specific Phishing Lab (Beginner)
        const targetTitle1 = "Email Phishing - Identify spoofed sender domain";
        const lab1 = labs.find(l => l.title === targetTitle1);

        if (lab1) {
            console.log(`\n[VERIFIED] Found: ${targetTitle1}`);
            console.log(`Scenario: ${lab1.scenario.substring(0, 100)}...`);
            console.log(`Content Email Sender: ${lab1.content.email ? lab1.content.email.sender : 'MISSING'}`);
            console.log(`Quiz Question: ${lab1.content.quiz ? lab1.content.quiz.question : 'MISSING'}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle1}`);
            const phishingLabs = labs.filter(l => l.title.includes('Phishing'));
            console.log(`Found ${phishingLabs.length} Phishing labs.`);
            console.log('First 3 Phishing Titles:', phishingLabs.slice(0, 3).map(l => l.title));
        }

        // 4. Find specific Phishing Lab (Expert)
        const targetTitle2 = "Email Phishing - Executive impersonation analysis";
        const lab2 = labs.find(l => l.title === targetTitle2);

        if (lab2) {
            console.log(`\n[VERIFIED] Found: ${targetTitle2}`);
            console.log(`Scenario: ${lab2.scenario.substring(0, 100)}...`);
            console.log(`Content Email Sender: ${lab2.content.email ? lab2.content.email.sender : 'MISSING'}`);
        } else {
            console.error(`\n[FAILED] Could not find: ${targetTitle2}`);
        }

    } catch (err) {
        console.error('Verification failed:', err.message);
    }
};

verify();
