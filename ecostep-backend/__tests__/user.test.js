import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let token;
let userId;

beforeAll(async () => {
  // Connect to test db (mocking via mongoose is usually done, but supertest spins up app)
  // Assumes mongoose connects to a test DB in setup or we mock it.
  // For this test, we mock Mongoose models directly.
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Controller endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1d' });
    
    // Mock user findById
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        ecoPoints: 50,
        streak: 2
      })
    });
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Test User');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/leaderboard', () => {
    it('should return top 10 users', async () => {
      User.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([
              { _id: userId, name: 'Test User', ecoPoints: 100, streak: 5 },
              { _id: '2', name: 'Other User', ecoPoints: 80, streak: 2 }
            ])
          })
        })
      });

      const res = await request(app)
        .get('/api/users/leaderboard')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.leaderboard).toHaveLength(2);
      expect(res.body.leaderboard[0].name).toBe('Test U***'); // Checks anonymisation
    });
  });
});
