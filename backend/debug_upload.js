const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function debugUpload() {
    try {
        console.log('🔍 Debugging profile picture upload...\n');
        
        // Step 1: Login
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post('http://localhost:9696/api/user/login', {
            email: 'b@gmail.com',
            password: 'Asdf@1234'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful\n');
        
        // Step 2: Check file
        const imagePath = '/home/luffy/Pictures/86fbe557-5fb8-419e-a410-4921c581fc03.png';
        console.log('2️⃣ Checking file...');
        if (!fs.existsSync(imagePath)) {
            throw new Error('File not found');
        }
        console.log('✅ File exists\n');
        
        // Step 3: Create FormData
        console.log('3️⃣ Creating FormData...');
        const formData = new FormData();
        formData.append('profilePicture', fs.createReadStream(imagePath));
        console.log('✅ FormData created\n');
        
        // Step 4: Upload with timeout
        console.log('4️⃣ Uploading (with 30s timeout)...');
        const uploadResponse = await axios.post(
            'http://localhost:9696/api/user/uploadProfilePicture',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...formData.getHeaders()
                },
                timeout: 30000, // 30 second timeout
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );
        
        console.log('✅ Upload successful!');
        console.log('Response:', uploadResponse.data);
        
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Message:', error.message);
        
        if (error.code === 'ECONNABORTED') {
            console.error('💡 Request timed out - backend might be stuck');
        }
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        if (error.request) {
            console.error('💡 No response received - backend might be hanging');
        }
    }
}

debugUpload(); 