import request from 'supertest'
import mongoose from 'mongoose'
import app from '../server.js'
import User from '../models/User.js'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost/ecostep-test')
})
afterAll(async () => {
  await User.deleteMany({ email: /test/ })
  await mongoose.disconnect()
})

describe('POST /api/auth/register', () => {
  test('registers new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User', email: 'test@ecostep.com', password: 'password123'
    })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.password).toBeUndefined()
  })
  test('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'dup@ecostep.com', password: 'password123'
    })
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'dup@ecostep.com', password: 'password123'
    })
    expect(res.status).toBe(400)
  })
  test('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'short@ecostep.com', password: '123'
    })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  test('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Test', email: 'login@ecostep.com', password: 'password123'
    })
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@ecostep.com', password: 'password123'
    })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
  test('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@ecostep.com', password: 'wrongpassword'
    })
    expect(res.status).toBe(401)
  })
})
