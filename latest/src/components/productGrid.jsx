import React, { useState, useEffect } from 'react';
import ProductCard from './productCard';
import { api } from '../services/api';
import './productGrid.css';

const ProductGrid = ({ addToCart, onProductosCargados }) => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                const data = await api.getProductos();
                console.log('Productos cargados:', data);
                
                if (Array.isArray(data) && data.length > 0) {
                    setProductos(data);
                    if (onProductosCargados) onProductosCargados(data);
                } else {
                    setError('No se encontraron productos');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Error al cargar productos');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    if (cargando) {
        return <div className="loading">Cargando productos...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="products-grid">
            {productos.map(producto => (
                <ProductCard 
                    key={producto.id} 
                    product={producto} 
                    addToCart={addToCart} 
                />
            ))}
        </div>
    );
};

export default ProductGrid;