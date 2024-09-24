import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

export default connectDB;
  