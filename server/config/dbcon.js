import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://exhaustechteam77:xQv9ZgKYM9MyRFq0@puyobay.wkrwt.mongodb.net/PuyobayClient?retryWrites=true&w=majority&appName=Puyobay', {
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
  