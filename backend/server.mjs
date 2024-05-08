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
/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });*/

app.post('/api/users', async (req, res) => {
    try {
        const { name, age, bio, address, district, city, uf, profileImage } = req.body;
        //const { path: profileImage } = req.file;

        const newUser = new User({ name, age, bio, address, district, city, uf, profileImage });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send(`Erro ao cadastrar usuário: ${error.message}`);
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send(`Erro ao buscar usuários: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});