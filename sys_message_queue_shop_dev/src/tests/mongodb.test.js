'use strict';

const mongoose = require('mongoose');
require("dotenv").config();

const connectString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}?authSource=admin`;

console.log(`Connecting to MongoDB at ${connectString}`);

const TestSchema = new mongoose.Schema({name: String});
const Test = mongoose.model('Test', TestSchema);

describe('MongoDB Tests', () => {
  let conn;

  beforeAll(async () => {
    conn = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should connect to MongoDB', async () => {
    console.log(`Connected to MongoDB at ${conn.readyState}`);
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('should create a document', async () => {
    const doc = new Test({ name: 'Test Document' });
    const savedDoc = await doc.save();
    expect(savedDoc.name).toBe('Test Document');
  });

  it('should read a document', async () => {
    const doc = await Test.findOne({ name: 'Test Document' });
    expect(doc).toBeDefined();
    expect(doc.name).toBe('Test Document');
  });

  it('should update a document', async () => {
    const updatedDoc = await Test.findOneAndUpdate({ name: 'Test Document' }, { name: 'Updated Document' }, { new: true });
    expect(updatedDoc.name).toBe('Updated Document');
  });

  it('should delete a document', async () => {
    const deletedDoc = await Test.findOneAndDelete({ name: 'Updated Document' });
    expect(deletedDoc).toBeDefined();
    expect(deletedDoc.name).toBe('Updated Document');
  });
});