const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Bug = require('../models/Bug');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Bug.deleteMany(); // Clean after each test
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Bug Tracker API', () => {
  test('Should create a new bug', async () => {
    const res = await request(app)
      .post('/api/bugs')
      .send({
        title: 'Bug 1',
        description: 'Sample description'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Bug 1');
    expect(res.body.status).toBe('open');
  });

  test('Should fetch all bugs', async () => {
    await Bug.create({ title: 'Bug 2', description: 'Fetch test' });

    const res = await request(app).get('/api/bugs');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Bug 2');
  });

  test('Should update bug status', async () => {
    const bug = await Bug.create({ title: 'Bug 3', description: 'Update test' });

    const res = await request(app)
      .put(`/api/bugs/${bug._id}`)
      .send({ status: 'resolved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('resolved');
  });

  test('Should delete a bug', async () => {
    const bug = await Bug.create({ title: 'Bug 4', description: 'Delete test' });

    const res = await request(app).delete(`/api/bugs/${bug._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Bug deleted successfully');
  });
});
