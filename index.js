const express = require('express');
const app = express();
const bd = require('./bd');
app.use(express.json());
// 1. POST /categorias
app.post('/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;
    const sql = `
        INSERT INTO categorias(nombre, descripcion)
        VALUES (?, ?)
    `;
    bd.query(sql, [nombre, descripcion], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }
        res.json({
            mensaje: 'Categoría creada',
            id: result.insertId
        });
    });
});
//2. GET /categorias
app.get('/categorias', (req, res) => {
    const sql = `SELECT * FROM categorias`;
    bd.query(sql, (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});
//3. GET /categorias/:id
app.get('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            c.id AS categoria_id,
            c.nombre AS categoria,
            c.descripcion,
            p.id AS producto_id,
            p.nombre AS producto,
            p.precio
        FROM categorias c
        LEFT JOIN productos p
        ON c.id = p.categoriaId
        WHERE c.id = ?
    `;
    bd.query(sql, [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});
//4. PATCH /categorias/:id
app.patch('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const sql = `
        UPDATE categorias
        SET nombre = ?, descripcion = ?
        WHERE id = ?
    `;
    bd.query(sql, [nombre, descripcion, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({
            mensaje: 'Categoría actualizada'
        });
    });
});
//5. DELETE /categorias/:id
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        DELETE FROM categorias
        WHERE id = ?
    `;
    bd.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({
            mensaje: 'Categoría eliminada'
        });
    });
});
//PUERTO
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});