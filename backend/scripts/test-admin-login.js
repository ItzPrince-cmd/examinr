const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@examinr.com',
      password: 'TestPass123!'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user);
    console.log('Access Token:', response.data.accessToken ? 'Received' : 'Not received');
    console.log('Refresh Token:', response.data.refreshToken ? 'Received' : 'Not received');
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

// Wait a bit for server to start
setTimeout(testAdminLogin, 3000);