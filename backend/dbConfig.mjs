import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export async function connectDb() {
  try {
    await mongoose.connect(process.env.REACT_APP_MONGODB_URI); //Substitua "process.env.REACT_APP_MONGODB_URI" pela URI mandada no e-mail
    console.log("Conectado ao MongoDB");
  } catch (err) {
    console.log(err.message);
  }
}

export async function disconnectDb() {
  await mongoose.disconnect();
}