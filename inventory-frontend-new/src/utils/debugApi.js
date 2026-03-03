// Simple debug tool to test API
export const debugApi = async () => {
  console.log('=== API DEBUG START ===');
  
  // Test 1: Check if backend is accessible
  console.log('Test 1: Checking backend health...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData);
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
  
  // Test 2: Test registration endpoint
  console.log('\nTest 2: Testing registration endpoint...');
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'test123',
    confirmPassword: 'test123'
  };
  
  console.log('Test data:', testUser);
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json().catch(() => ({ error: 'No JSON response' }));
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Registration test successful!');
      return true;
    } else {
      console.error('❌ Registration test failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Registration test error:', error);
    return false;
  }
};

// Run debug from console
window.debugApi = debugApi;