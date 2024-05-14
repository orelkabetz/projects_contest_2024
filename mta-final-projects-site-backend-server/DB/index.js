const mongoose = require('mongoose');

// URI from MongoDB Atlas (make sure to replace credentials and database name appropriately)
const uri = "mongodb+srv://main:vbvh2oarIXqTgB6B@mta-final-projects-site.q4iylbw.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=mta-final-projects-site";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: mongoose.ServerApiVersion
});

const getCollections = () => {
  return new Promise((resolve, reject) => {
    mongoose.connection.on('error', (err) => {
      console.error('connection error:', err);
      reject(err);
    });

    mongoose.connection.once('open', async function(ref) {
      const db = mongoose.connection.db; // Get a reference to the database

      try {
        const names = await db.listCollections().toArray(); 
        const collections = {};

        for (const { name } of names) {
          collections[name] = db.collection(name);
        }

        resolve(collections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        reject(err);
      }
    });
  });
};

module.exports = { mongoose, getCollections };