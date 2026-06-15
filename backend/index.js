// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import svgCaptcha from 'svg-captcha';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { conectarDB } from './config/bd.js';
import Producto from './models/Producto.js';
import Usuario from './models/Usuario.js';
import LogAcceso from './models/LogAcceso.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_tienda_2024';

// ============ MIDDLEWARES ============
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// ============ CONFIGURACIÓN DE SESIÓN (UNA SOLA VEZ) ============
app.use(session({
    secret: 'mi_secreto_captcha_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,          
        httpOnly: true,
        maxAge: 5 * 60 * 1000,  
        sameSite: 'lax'         
    },
    name: 'sessionId'           
}));

// ============ CONECTAR A BASE DE DATOS ============
await conectarDB();

// ============ RUTAS DE AUTENTICACIÓN ============

// GET - CAPTCHA
app.get('/api/auth/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 2,
        color: true,
        background: '#f0f0f0',
        width: 150,
        height: 50
    });
    
    req.session.captcha = captcha.text;
    console.log(' CAPTCHA guardado en sesión:', captcha.text);
    
    res.type('svg');
    res.send(captcha.data);
});

// POST - Registro
// POST - Registro (VERSIÓN SIMPLIFICADA)
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre, email, password, captcha } = req.body;
        
        console.log('\n REGISTRO:', { nombre, email, password, captcha });
        
        // Validar CAPTCHA
        if (!req.session?.captcha || captcha !== req.session.captcha) {
            return res.status(400).json({ error: 'CAPTCHA incorrecto' });
        }
        delete req.session.captcha;
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        // Verificar si ya existe
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        // Validar fortaleza de contraseña
        let score = 0;
        if (password.length >= 8) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>_-]/.test(password)) score++;
        
        if (score <= 2) {
            return res.status(400).json({ error: 'La contraseña es demasiado débil' });
        }
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: email === 'admin@tienda.com' ? 'admin' : 'usuario'
        });
        
        console.log(' Usuario creado:', nuevoUsuario.id);
        
        const token = jwt.sign(
            { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: { id: nuevoUsuario.id, nombre, email, rol: nuevoUsuario.rol }
        });
        
    } catch (error) {
        console.error(' Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// POST - Registro (versión estable)
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre, email, password, captcha } = req.body;

        // Validar CAPTCHA
        if (!req.session?.captcha || captcha !== req.session.captcha) {
            return res.status(400).json({ error: 'CAPTCHA incorrecto' });
        }
        delete req.session.captcha;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos' });
        }

        const existe = await Usuario.findOne({ where: { email } });
        if (existe) return res.status(400).json({ error: 'Email ya registrado' });

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'usuario'
        });

        // Verificar inmediatamente
        const test = await bcrypt.compare(password, nuevoUsuario.password);
        console.log(`Registro exitoso, verificación post: ${test}`);

        const token = jwt.sign({ id: nuevoUsuario.id, email, rol: 'usuario' }, JWT_SECRET, { expiresIn: '8h' });
        res.status(201).json({ mensaje: 'Registrado', token, usuario: { id: nuevoUsuario.id, nombre, email, rol: 'usuario' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// POST - Login (versión estable)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, captcha } = req.body;

        if (!req.session?.captcha || captcha !== req.session.captcha) {
            return res.status(400).json({ error: 'CAPTCHA incorrecto' });
        }
        delete req.session.captcha;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return res.status(401).json({ error: 'Credenciales inválidas' });

        await LogAcceso.create({ usuario_id: usuario.id, usuario_email: email, evento: 'ingreso', ip: req.ip, browser: req.headers['user-agent'] });

        const token = jwt.sign({ id: usuario.id, email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombre: usuario.nombre, email, rol: usuario.rol } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// POST - Logout
app.post('/api/auth/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            await LogAcceso.create({
                usuario_id: decoded.id,
                usuario_email: decoded.email,
                evento: 'salida',
                ip: req.ip,
                browser: req.headers['user-agent']
            });
        }
        res.json({ mensaje: 'Sesión cerrada' });
    } catch (error) {
        res.json({ mensaje: 'Sesión cerrada' });
    }
});

// GET - Verificar token
app.get('/api/auth/verificar', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valido: false });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valido: true, usuario: decoded });
    } catch {
        res.status(401).json({ valido: false });
    }
});

// ============ RUTAS DE PRODUCTOS ============

// GET - Todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const productos = await Producto.findAll({ where: { activo: true }, order: [['id', 'DESC']] });
        res.json(productos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET - Producto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto || !producto.activo) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Crear producto
app.post('/api/products', async (req, res) => {
    try {
        const { nombre, precio, colores, tallas, publico, temporada, stock } = req.body;
        
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
        }
        
        const nuevoProducto = await Producto.create({
            nombre,
            precio: parseFloat(precio),
            colores: colores || [],
            tallas: tallas || [],
            publico: publico || 'Dama',
            temporada: temporada || 'Verano',
            stock: stock || 10
        });
        
        res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH - Actualizar producto
app.patch('/api/products/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        await producto.update(req.body);
        res.json({ mensaje: 'Producto actualizado', producto });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Eliminar producto (lógico)
app.delete('/api/products/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        await producto.update({ activo: false });
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// ============ RUTAS TEMPORALES (PARA DEPURACIÓN - ELIMINAR DESPUÉS) ============
app.post('/api/auth/check-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailLimpio = email.toLowerCase().trim();
        const usuario = await Usuario.findOne({ where: { email: emailLimpio } });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const passwordValida = await bcrypt.compare(password.trim(), usuario.password);
        
        res.json({
            email: usuario.email,
            esValida: passwordValida,
            mensaje: passwordValida ? ' Contraseña correcta' : ' Contraseña incorrecta'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/generate-hash', async (req, res) => {
    try {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        res.json({ password, hash, longitud: hash.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/auth/generate-hash', async (req, res) => {
    try {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(' Hash generado para:', password);
        console.log('  Hash:', hash);
        res.json({ 
            password: password, 
            hash: hash,
            longitud: hash.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log(` Productos: http://localhost:${PORT}/api/products`);
    console.log(` CAPTCHA: http://localhost:${PORT}/api/auth/captcha`);
    console.log(` Registro: POST http://localhost:${PORT}/api/auth/registro`);
    console.log(` Login: POST http://localhost:${PORT}/api/auth/login\n`);
});