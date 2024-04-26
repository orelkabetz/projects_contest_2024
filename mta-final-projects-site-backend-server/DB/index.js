const { connect, ServerApiVersion, connection } = require('mongoose');

// URI from MongoDB Atlas (make sure to replace credentials and database name appropriately)
const uri = "mongodb+srv://main:vbvh2oarIXqTgB6B@mta-final-projects-site.q4iylbw.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=mta-final-projects-site";

// Connect to MongoDB using Mongoose
connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion
});

const client = connection;

client.on('error', console.error.bind(console, 'connection error:'));
client.once('open',async function(ref) {
  const db = connection.db; // Get a reference to the database

  try {
    const names = await db.listCollections().toArray(); 
    const collections = {};

    for (const { name } of names) {
        collections[name] = db.collection(name);
    }

    module.exports.collections = collections; 
} catch (err) {
    console.error("Error fetching collections:", err);
}
});

// You might want to export the mongoose connection
module.exports = client
