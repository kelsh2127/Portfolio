const { MongoClient } = require('mongodb');

// Your connection string
const uri = "mongodb+srv://kelemzhekale_db_user:lidu1234@ecommerce.xr2btey.mongodb.net/";

// Database and Collection names
const dbName = "Ecommerce"; // or whatever your database is named
const collectionName = "portfolio";

async function insertData() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully!");
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Insert one document
    const oneDocument = {
      name: "My Ecommerce Project",
      category: "Web Development",
      price: 499.99,
      description: "Complete ecommerce website",
      status: "active",
      createdAt: new Date(),
      technologies: ["React", "Node.js", "MongoDB"]
    };
    
    const result = await collection.insertOne(oneDocument);
    console.log(`✅ Inserted document with _id: ${result.insertedId}`);
    
    // Insert multiple documents
    const manyDocuments = [
      {
        name: "Mobile Shopping App",
        category: "Mobile Development",
        price: 799.99,
        description: "React Native ecommerce app",
        status: "pending",
        createdAt: new Date(),
        technologies: ["React Native", "Express", "MongoDB"]
      },
      {
        name: "Admin Dashboard",
        category: "Frontend",
        price: 299.99,
        description: "Analytics dashboard for ecommerce",
        status: "active",
        createdAt: new Date(),
        technologies: ["Vue.js", "D3.js", "MongoDB"]
      },
      {
        name: "Payment Gateway Integration",
        category: "Backend",
        price: 399.99,
        description: "Stripe + PayPal integration",
        status: "active",
        createdAt: new Date(),
        technologies: ["Node.js", "Stripe API", "PayPal API"]
      },{  
        name:"Wude zhekale",
        work:"manager",
        age:24,
        price:75000,
        gpa:3.75,
      },
      {
        name:"Kelemzhekale",
        work:"developer",
        age:24,
        price:90000,
        gpa:3.75,
      }

    ];
    
    const manyResult = await collection.insertMany(manyDocuments);
    console.log(`✅ Inserted ${manyResult.insertedCount} documents`);
    
    // Verify by counting
    const count = await collection.countDocuments();
    console.log(`📊 Total documents in portfolio: ${count}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

// Run the function
insertData();