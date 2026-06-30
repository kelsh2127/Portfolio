const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017'; // or your Atlas connection string
const dbName = 'Ecommerce';

async function insertData() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db(dbName);
    const collection = db.collection('portfolio');
    
    // Insert one document
    const oneDocument = {
      name: "My Portfolio Item",
      category: "Web Design",
      price: 99.99,
      createdAt: new Date(),
      status: "active"
    };
    
    const result = await collection.insertOne(oneDocument);
    console.log(`Inserted one document with _id: ${result.insertedId}`);
    
    // Insert multiple documents
    const manyDocuments = [
      {
        name: "Ecommerce Website",
        category: "Development",
        price: 499.99,
        createdAt: new Date(),
        status: "active"
      },
      {
        name: "Mobile App Design",
        category: "UI/UX",
        price: 299.99,
        createdAt: new Date(),
        status: "pending"
      },
      {
        name: "Brand Identity",
        category: "Design",
        price: 199.99,
        createdAt: new Date(),
        status: "active"
      }
    ];
    
    const manyResult = await collection.insertMany(manyDocuments);
    console.log(`Inserted ${manyResult.insertedCount} documents`);
    
  } finally {
    await client.close();
  }
}

insertData().catch(console.error);