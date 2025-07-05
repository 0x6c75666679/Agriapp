const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// CONFIGURE THESE:
const ENDPOINT_URL = 'http://localhost:9696/api/field/analyze'; // Change if your server/route is different
const SOIL_IMAGE_PATH = './uploads/test/soil_image.webp'; // Path to a sample soil image on your disk

async function testAnalyzeField() {
  const form = new FormData();
  form.append('seed_type', 'Wheat');
  form.append('fertilizer_type', 'Urea');
  form.append('fertilizer_amount', '15kg/acre');
  form.append('soilImage', fs.createReadStream(SOIL_IMAGE_PATH));

  try {
    const response = await axios.post(ENDPOINT_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log('API response:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('API error:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

testAnalyzeField(); 