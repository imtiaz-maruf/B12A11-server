// ===========================================
// test-backend-response.js
// Place in client directory and run: node test-backend-response.js
// ===========================================

const API_URL = 'https://b12a11server.vercel.app'; // Your backend URL

console.log('🧪 Testing Backend JWT Response\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📡 API URL:', API_URL);
console.log('📧 Test email: maruf.techware@gmail.com\n');

async function testJWTEndpoint() {
    try {
        console.log('📤 Sending POST request to /api/auth/jwt...\n');

        const response = await fetch(`${API_URL}/api/auth/jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'maruf.techware@gmail.com'
            })
        });

        console.log('📨 Response received:');
        console.log('   Status:', response.status, response.statusText);
        console.log('   Content-Type:', response.headers.get('content-type'));
        console.log();

        const data = await response.json();

        console.log('📦 Response Data:');
        console.log(JSON.stringify(data, null, 2));
        console.log();

        // Validate response structure
        console.log('🔍 Validation:');
        console.log('   ✓ Has success field:', 'success' in data ? '✅' : '❌');
        console.log('   ✓ Has token field:', 'token' in data ? '✅' : '❌ MISSING!');
        console.log('   ✓ Has email field:', 'email' in data ? '✅' : '❌');
        console.log();

        if (data.token) {
            console.log('🔑 Token Details:');
            console.log('   Type:', typeof data.token);
            console.log('   Length:', data.token.length);
            console.log('   Preview:', data.token.substring(0, 50) + '...');
            console.log();
            console.log('✅ SUCCESS! Backend is returning token correctly');
        } else {
            console.log('❌ FAILED! Backend response structure is wrong');
            console.log();
            console.log('Expected structure:');
            console.log(JSON.stringify({
                success: true,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                email: 'maruf.techware@gmail.com'
            }, null, 2));
            console.log();
            console.log('Received structure:');
            console.log(JSON.stringify(data, null, 2));
            console.log();
            console.log('🔧 Fix: Update your server/routes/auth.js file');
            console.log('The response MUST include a "token" field');
        }

    } catch (error) {
        console.error('❌ Error testing endpoint:');
        console.error('   Name:', error.name);
        console.error('   Message:', error.message);

        if (error.cause) {
            console.error('   Cause:', error.cause);
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testJWTEndpoint();

// ===========================================
// HOW TO RUN THIS TEST:
// ===========================================
// 1. Save this as test-backend-response.js in your client folder
// 2. Make sure you have Node.js installed
// 3. Run: node test-backend-response.js
// 4. Check if "Has token field" shows ✅ or ❌
// 5. If ❌, your backend auth route is wrong