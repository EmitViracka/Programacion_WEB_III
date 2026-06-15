import React from 'react'
import './Modal.css'

const CarritoModal = ({ show, onClose, items, onRemove }) => {
  if (!show) return null

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Carrito de Compras</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío!</p>
              <button className="btn-secondary" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.cartId} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">Bs {item.price}</span>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => onRemove(item.cartId)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-total">
                <h3>Total: Bs {total}</h3>
                <button className="btn-checkout">
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CarritoModal