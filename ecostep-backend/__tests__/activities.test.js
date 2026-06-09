import request from 'supertest'
import mongoose from 'mongoose'
import app from '../server.js'
import Activity from '../models/Activity.js'

let token = ''
let activityId = ''

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost/ecostep-test')
  const res = await request(app).post('/api/auth/register').send({
    name: 'Activity Test', email: 'activity@ecostep.com', password: 'password123'
  })
  token = res.body.token
})
afterAll(async () => {
  await Activity.deleteMany({})
  await mongoose.disconnect()
})

describe('POST /api/activities', () => {
  test('creates activity and calculates CO2', async () => {
    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'travel', type: 'Car (petrol)', quantity: 10 })
    expect(res.status).toBe(201)
    expect(res.body.data.co2).toBe(1.8)
    activityId = res.body.data._id
  })
  test('rejects invalid category', async () => {
    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'flying', type: 'Rocket', quantity: 10 })
    expect(res.status).toBe(400)
  })
  test('rejects unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ category: 'travel', type: 'Bus', quantity: 5 })
    expect(res.status).toBe(401)
  })
})

describe('DELETE /api/activities/:id', () => {
  test('deletes own activity', async () => {
    const res = await request(app)
      .delete(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
  test('returns 404 for non-existent activity', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .delete(`/api/activities/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
