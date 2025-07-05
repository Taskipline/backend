import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

// Setup before all tests
beforeAll(async () => {
  // Disconnect any existing connections
  await mongoose.disconnect();

  // Start in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri);
}, 30000);

// Cleanup after each test
afterEach(async () => {
  // Clear all collections
  if (mongoose.connection.readyState === 1) {
    const { collections } = mongoose.connection;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  // Stop the in-memory MongoDB instance
  if (mongod) {
    await mongod.stop();
  }
}, 30000);

// Increase timeout for database operations
jest.setTimeout(30000);
