import Producto from '../models/Producto.js';

// GET - Todos los productos (solo activos)
export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({ 
            where: { activo: true },
            order: [['id', 'DESC']]
        });
        res.json(productos);
    } catch (error) {
        console.error('Error en getProductos:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET - Producto por ID
export const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto || !producto.activo) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST - Crear producto
export const createProducto = async (req, res) => {
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
        
        res.status(201).json({ 
            mensaje: 'Producto creado exitosamente', 
            producto: nuevoProducto 
        });
    } catch (error) {
        console.error('Error en createProducto:', error);
        res.status(500).json({ error: error.message });
    }
};

// PATCH - Actualizar producto
export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        await producto.update(req.body);
        
        res.json({ 
            mensaje: 'Producto actualizado exitosamente', 
            producto 
        });
    } catch (error) {
        console.error('Error en updateProducto:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Eliminar producto (lógico)
export const deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        await producto.update({ activo: false });
        
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteProducto:', error);
        res.status(500).json({ error: error.message });
    }
};