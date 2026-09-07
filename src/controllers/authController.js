const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto';

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
        }
        const existing = await UserModel.findByEmail(email);
        if (existing) {
            return res.status(409).json({ mensaje: 'El email ya está registrado' });
        }
        // Pasar el rol al crear el usuario (si no viene, 'user' por defecto)
        const user = await UserModel.create({ name, email, password, role: role || 'user' });
        res.status(201).json({ mensaje: 'Usuario registrado', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
        }
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const isValid = await UserModel.verifyPassword(user, password);
        if (!isValid) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ mensaje: 'Login exitoso', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
