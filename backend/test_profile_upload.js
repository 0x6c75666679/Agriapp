const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Configuration
const API_BASE_URL = 'http://localhost:9696/api';
const LOGIN_CREDENTIALS = {
    email: 'b@gmail.com',
    password: 'Asdf@1234'
};
const IMAGE_PATH = '/home/luffy/Pictures/86fbe557-5fb8-419e-a410-4921c581fc03.png';

async function testProfilePictureUpload() {
    try {
        console.log('🚀 Starting profile picture upload test...\n');
        
        // Step 1: Login to get JWT token
        console.log('🔐 Logging in...');
        const loginResponse = await axios.post(`${API_BASE_URL}/user/login`, LOGIN_CREDENTIALS);
        
        if (!loginResponse.data.token) {
            throw new Error('No token received from login');
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful! Token received.\n');
        
        // Step 2: Check if image file exists
        console.log('📁 Checking image file...');
        if (!fs.existsSync(IMAGE_PATH)) {
            throw new Error(`Image file not found: ${IMAGE_PATH}`);
        }
        console.log('✅ Image file found!\n');
        
        // Step 3: Create FormData and upload
        console.log('📤 Uploading profile picture...');
        const formData = new FormData();
        formData.append('profilePicture', fs.createReadStream(IMAGE_PATH));
        
        const uploadResponse = await axios.post(
            `${API_BASE_URL}/user/uploadProfilePicture`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );
        
        console.log('✅ Upload successful!');
        console.log('📋 Response:', JSON.stringify(uploadResponse.data, null, 2));
        
        // Step 4: Verify by getting user profile
        console.log('\n🔍 Verifying upload by getting user profile...');
        const profileResponse = await axios.get(`${API_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Profile retrieved!');
        console.log('📋 Profile Picture URL:', profileResponse.data.user.profilePicture);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        
        if (error.response) {
            console.error('📊 Status:', error.response.status);
            console.error('📋 Headers:', error.response.headers);
        }
    }
}

// Run the test
testProfilePictureUpload(); 