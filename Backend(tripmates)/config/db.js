import mongoose from 'mongoose';

const mongo_url = process.env.MONGO_URI;

// Debug check
console.log("Mongo URI:", mongo_url);

mongoose.connect(mongo_url)
  .then(() => {
    console.log("MongoDB Connected....!");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });
