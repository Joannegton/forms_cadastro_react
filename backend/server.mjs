import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from 'multer';
import path from 'path';
import { connectDb } from "./dbConfig.mjs";
import User from './schema.mjs';

const UPLOADS_DIR = './uploads';
const PORT = 5000;

connectDb();

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: 500 * 1024 * 1024 }));
app.use(bodyParser.urlencoded({ limit: 500 * 1024 * 1024, extended: true }));

app.post('/api/users', async (req, res) => {
    try {
        const { name, age, bio, address, district, city, uf, profileImage } = req.body;

        const newUser = new User({ name, age, bio, address, district, city, uf, profileImage });
        const savedUser = await newUser.save();
        
        res.status(201).json({ user: savedUser, message: "User created successfully" });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: `Erro ao cadastrar usuário: ${error.message}` });
    }
});

app.put('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user data' });
    }
});

app.get('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});