import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  console.log('🔍 Testing API Connection...\n');

  try {
    // First, check if server is running
    try {
      await axios.get('http://localhost:5000');
      console.log('✅ Server is running\n');
    } catch (error) {
      console.log('❌ Cannot connect to server. Make sure server is running on port 5000\n');
      console.log('To start the server:');
      console.log('  cd backend');
      console.log('  node server-simple.js\n');
      return;
    }

    // 1. Test user registration
    console.log('📝 Testing Registration...');
    try {
      const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'password123'
      };

      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.success);
      console.log('   User created:', registerResponse.data.data.user.name);
      
      // Save token for next tests
      const token = registerResponse.data.token;
      
      // 2. Test login with same credentials
      console.log('\n🔑 Testing Login...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data.success);
      
      const authToken = loginResponse.data.token || token;
      
      // 3. Test getting categories (protected route)
      console.log('\n📊 Testing Categories API...');
      const categoriesResponse = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Categories fetched:', categoriesResponse.data.success);
      console.log(`   Found ${categoriesResponse.data.data.categories.length} categories`);

      // 4. Test getting items (protected route)
      console.log('\n📦 Testing Items API...');
      const itemsResponse = await axios.get(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Items fetched:', itemsResponse.data.success);
      console.log(`   Found ${itemsResponse.data.data.items.length} items`);

      // 5. Test dashboard stats
      console.log('\n📈 Testing Dashboard API...');
      const dashboardResponse = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Dashboard stats fetched:', dashboardResponse.data.success);
      
      console.log('\n✨ All tests passed! Your API is working correctly.\n');
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists - trying login instead...\n');
        
        // Try logging in instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'password123'
        });
        
        console.log('✅ Login successful:', loginResponse.data.success);
        console.log('\n✨ API is working correctly!\n');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Cannot connect to server. Make sure backend is running on port 5000');
      console.error('\n   Run this command to start the server:');
      console.error('   cd backend && node server-simple.js');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      console.error('   Server responded with error:');
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('   No response from server. Is it running?');
    } else {
      // Something happened in setting up the request
      console.error('   Error:', error.message);
    }
  }
};

// Run the test
console.log('🚀 API Test Script\n');
console.log('Testing connection to:', API_URL);
console.log('Make sure your backend server is running!\n');

testAPI();