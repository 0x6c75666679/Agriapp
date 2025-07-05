const axios = require('axios');

// API configuration
const API_BASE_URL = 'http://localhost:9696/api';
const LOGIN_CREDENTIALS = {
    email: 'a@gmail.com',
    password: 'Asdf@1234'
};

// Sample field data (without userId - will be set by the API based on JWT)
const sampleFields = [
    {
        name: 'North Wheat Field',
        area: 25.5,
        latitude: 40.7128,
        longitude: -74.0060,
        crop: 'wheat'
    },
    {
        name: 'South Corn Field',
        area: 18.2,
        latitude: 40.7120,
        longitude: -74.0065,
        crop: 'corn'
    },
    {
        name: 'East Tomato Patch',
        area: 8.7,
        latitude: 40.7130,
        longitude: -74.0055,
        crop: 'tomatoes'
    },
    {
        name: 'West Rice Paddy',
        area: 32.1,
        latitude: 40.7125,
        longitude: -74.0068,
        crop: 'rice'
    }
];

async function login() {
    try {
        console.log('🔐 Logging in...');
        const response = await axios.post(`${API_BASE_URL}/user/login`, LOGIN_CREDENTIALS);
        
        if (response.data.token) {
            console.log('✅ Login successful!');
            return response.data.token;
        } else {
            throw new Error('No token received');
        }
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data?.message || error.message);
        throw error;
    }
}

async function createField(fieldData, token) {
    try {
        const response = await axios.post(`${API_BASE_URL}/field/create`, fieldData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`✅ Created field: ${fieldData.name} (${fieldData.area} acres) - Crop: ${fieldData.crop}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 409) {
            console.log(`⚠️  Field ${fieldData.name} already exists, skipping...`);
        } else {
            console.error(`❌ Error creating field ${fieldData.name}:`, error.response?.data?.message || error.message);
        }
        throw error;
    }
}

async function getFields(token) {
    try {
        const response = await axios.get(`${API_BASE_URL}/field/get`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('\n📋 All fields for current user:');
        response.data.fields.forEach(field => {
            console.log(`- ${field.name} (${field.area} acres, ${field.crop})`);
        });
        
        return response.data.fields;
    } catch (error) {
        console.error('❌ Error fetching fields:', error.response?.data?.message || error.message);
        return [];
    }
}

async function createSampleFields() {
    try {
        console.log('🚀 Starting sample fields creation...\n');
        
        // Step 1: Login to get JWT token
        const token = await login();
        
        // Step 2: Create sample fields using the API
        console.log('\n🌾 Creating sample fields...');
        for (const fieldData of sampleFields) {
            try {
                await createField(fieldData, token);
            } catch (error) {
                // Continue with next field even if one fails
                continue;
            }
        }
        
        console.log('\n🎉 Sample fields creation completed!');
        
        // Step 3: Display all fields for the user
        await getFields(token);
        
    } catch (error) {
        console.error('❌ Script failed:', error.message);
    }
}

// Run the script
createSampleFields(); 