// CODIGO CRUD FUNCIONAL Guardar original
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'mi_secreto_captcha',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ============ DATOS DE EJEMPLO CON CAMPOS COMPLETOS ============
let productos = [
    { 
        id: 1, 
        nombre: "Vestido Elegante", 
        precio: 120, 
        colors: ["darkblue", "green", "blue"], 
        sizes: ["S", "M", "L", "XL"],
        publico: "Dama",
        temporada: "Verano",
        stock: 15,
        activo: true
    },
    { 
        id: 2, 
        nombre: "Blusa Casual", 
        precio: 50, 
        colors: ["darkgreen", "beige"], 
        sizes: ["S", "M", "L", "XL", "XXL"],
        publico: "Joven",
        temporada: "Verano",
        stock: 20,
        activo: true
    },
    { 
        id: 3, 
        nombre: "Pantalón Clásico", 
        precio: 100, 
        colors: ["black", "white", "khaki"], 
        sizes: ["S", "M", "L"],
        publico: "Dama",
        temporada: "Invierno",
        stock: 12,
        activo: true
    },
    { 
        id: 4, 
        nombre: "Chompa Cómoda", 
        precio: 120, 
        colors: ["black", "brown", "darkblue"], 
        sizes: ["S", "M", "L"],
        publico: "Dama",
        temporada: "Invierno",
        stock: 10,
        activo: true
    },
    { 
        id: 5, 
        nombre: "Blusa Estampada", 
        precio: 90, 
        colors: ["violet", "yellow", "lightgreen"], 
        sizes: ["S", "M", "L"],
        publico: "Joven",
        temporada: "Verano",
        stock: 18,
        activo: true
    },
    { 
        id: 6, 
        nombre: "Chompa Verano", 
        precio: 150, 
        colors: ["lightblue", "lightgreen", "red"], 
        sizes: ["S", "M", "L"],
        publico: "Dama",
        temporada: "Verano",
        stock: 8,
        activo: true
    }
];

// ============ RUTAS API COMPLETAS (CRUD) ============

// GET - Obtener todos los productos (solo activos)
app.get('/api/products', (req, res) => {
    const activos = productos.filter(p => p.activo !== false);
    res.json(activos);
});

// GET - Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id && p.activo !== false);
    
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
});

// POST - Crear nuevo producto
app.post('/api/products', (req, res) => {
    const { nombre, precio, colors, sizes, publico, temporada, stock } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }
    
    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio: parseFloat(precio),
        colors: colors || [],
        sizes: sizes || [],
        publico: publico || 'Dama',
        temporada: temporada || 'Verano',
        stock: stock || 10,
        activo: true
    };
    
    productos.push(nuevoProducto);
    console.log('✅ Producto creado:', nuevoProducto.nombre);
    res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto });
});

// PATCH - Actualizar producto
app.patch('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    productos[index] = { ...productos[index], ...req.body };
    console.log('✏️ Producto actualizado:', productos[index].nombre);
    res.json({ mensaje: 'Producto actualizado', producto: productos[index] });
});

// DELETE - Eliminar producto (lógico)
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    productos[index].activo = false;
    console.log('🗑️ Producto eliminado (lógico):', productos[index].nombre);
    res.json({ mensaje: 'Producto eliminado' });
});

// ============ RUTAS PARA CATEGORÍAS ============
let categorias = [
    { id: 1, nombre: "Vestidos", descripcion: "Ropa elegante" },
    { id: 2, nombre: "Blusas", descripcion: "Ropa casual" },
    { id: 3, nombre: "Pantalones", descripcion: "Ropa formal" }
];

app.get('/api/categorias', (req, res) => {
    res.json(categorias);
});

app.post('/api/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;
    const nueva = { id: categorias.length + 1, nombre, descripcion };
    categorias.push(nueva);
    res.status(201).json({ mensaje: 'Categoría creada', categoria: nueva });
});

app.patch('/api/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categorias.findIndex(c => c.id === id);
    if (index !== -1) {
        categorias[index] = { ...categorias[index], ...req.body };
        res.json({ mensaje: 'Categoría actualizada' });
    } else {
        res.status(404).json({ error: 'No encontrada' });
    }
});

app.delete('/api/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    categorias = categorias.filter(c => c.id !== id);
    res.json({ mensaje: 'Categoría eliminada' });
});

// ============ RUTA DE PRUEBA ============
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando',
        productos: productos.filter(p => p.activo !== false).length,
        categorias: categorias.length
    });
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ Health: http://localhost:${PORT}/api/health`);
    console.log(`✅ Productos: http://localhost:${PORT}/api/products`);
    console.log(`✅ Categorías: http://localhost:${PORT}/api/categorias`);
    console.log(`📦 Productos activos: ${productos.filter(p => p.activo !== false).length}\n`);
});