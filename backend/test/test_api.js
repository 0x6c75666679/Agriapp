const request = require('supertest');
require('dotenv').config();
const path = require('path');

// Set test environment
process.env.NODE_ENV = 'test';

const BASE_URL = `http://localhost:${process.env.PORT || 9696}`;

// Import database connection
const { connectDB, sequelize } = require('../db/database');

describe('open API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await connectDB();
  });

  afterAll(async () => {
    // Close database connection after all tests
    await sequelize.close();
  });
  it('should create a new user without an image', async () => {
    const uniqueUsername = `testuser_noimage_${Date.now()}`;
    const uniqueEmail = `noimage_${Date.now()}@example.com`;

    const res = await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'securepassword123'
      });

    console.log(res.body)
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('User created');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toEqual(uniqueUsername);
    expect(res.body.user.email).toEqual(uniqueEmail);
    expect(res.body.user.profilePicture).toBeDefined();
  });



  it('should return 200 with success: false for missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: 'test_incomplete',
        email: 'incomplete@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Please fill all the parameters ');
  });



  // login
  it('should login a  user', async () => {
    // First create a user
    const uniqueUsername = `testuser_login_${Date.now()}`;
    const uniqueEmail = `login_${Date.now()}@example.com`;
    const password = 'securepassword123';

    // Register the user
    await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: password
      });

    // Now try to login
    const userData = {
      email: uniqueEmail,
      password: password
    };

    const res = await request(BASE_URL)
      .post('/api/user/login')
      .send(userData);

    console.log(res.body)
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('You have succesfully logged in');
    expect(res.body.token).toBeDefined();
  });


  // 
});


describe('test for authorization needed', () => {
  let authToken = '';
  let adminToken = '';

  beforeAll(async () => {
    // Create an admin user first
    const adminUsername = `admin_${Date.now()}`;
    const adminEmail = `admin_${Date.now()}@example.com`;
    const adminPassword = 'adminpassword123';

    // Register admin user
    await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });

    // Login as admin
    const adminLoginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({
        email: adminEmail,
        password: adminPassword
      });

    adminToken = adminLoginRes.body.token;
  });

  it('should get a list of all users when authenticated as admin', async () => {
    const res = await request(BASE_URL)
      .get('/api/user/get-users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
    expect(res.body.users[0]).toHaveProperty('id');
    expect(res.body.users[0]).toHaveProperty('username');
    expect(res.body.users[0]).toHaveProperty('email');
    expect(res.body.users[0]).not.toHaveProperty('password');
  });


  it('should return 403 Forbidden if no token is provided', async () => {
    const res = await request(BASE_URL)
      .get('/api/user/get-users');

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBeDefined();
  });

  it('should return 401 Unauthorized if the token is invalid', async () => {
    const res = await request(BASE_URL)
      .get('/api/user/get-users')
      .set('Authorization', 'Bearer an-invalid-token-string');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });



});

