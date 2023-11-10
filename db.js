const { MongoClient } = require("mongodb");

const db = {};

const connectToDb = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const database = client.db("text-mindx-bai2");
    db.inventories = database.collection("inventories");
    db.orders = database.collection("orders");
    db.users = database.collection("users");
    console.log("Connected to MongoDB");

    // Import data
    await importData();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

const importData = async () => {
    const ordersData = [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
    { "_id" : 3, "item" : "pecans", "price" : 20, "quantity" : 3 }
    ];
    
    const inventoryData = [
    { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
    { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
    { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
    { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 }
    ];
    
    const usersData = [
    {"username": "admin", "password": "MindX@2022"},
    {"username": "alice", "password": "MindX@2022"}
    ];
    
    try {
    await db.orders.insertMany(ordersData);
    console.log("Orders imported successfully");
    
    Copier
    await db.inventories.insertMany(inventoryData);
    console.log("Inventory imported successfully");
    
    await db.users.insertMany(usersData);
    console.log("Users imported successfully");
    } catch (error) {
    console.error("Failed to import data:", error);
    }
    };
    
    module.exports = { connectToDb, db };

