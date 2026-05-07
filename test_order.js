const http = require('http');

async function run() {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@foodiehub.com', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 2. Place order
    const orderRes = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{ price: 10, quantity: 1 }],
        deliveryAddress: {},
        paymentMethod: 'cod'
      })
    });
    const orderData = await orderRes.json();
    console.log("ORDER RESPONSE:", orderData);
  } catch(e) {
    console.error(e);
  }
}
run();
