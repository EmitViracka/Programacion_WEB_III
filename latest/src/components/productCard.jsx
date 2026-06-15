import React from 'react';
import './productCard.css';

const ProductCard = ({ product, addToCart }) => {
    if (!product) {
        return <div className="product-card error">Producto no disponible</div>;
    }

    const precio = product.precio || product.price || 0;
    const nombre = product.nombre || product.name || 'Producto sin nombre';
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];

    return (
        <div className="product-card">
            <div className="product-info">
                <h3 className="product-title">{nombre}</h3>
                <div className="precio-container">
                    <p className="product-price">Bs {precio}</p>
                </div>
                
                <div className="product-colors">
                    {colors.length > 0 ? (
                        colors.map((color, i) => (
                            <span 
                                key={i} 
                                className="color-dot" 
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))
                    ) : (
                        <span className="no-colors">Sin colores</span>
                    )}
                </div>
                
                <p className="product-sizes">
                    Tallas: {sizes.length > 0 ? sizes.join(', ') : 'No disponible'}
                </p>
                
                <button className="add-to-cart" onClick={() => addToCart(product)}>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;