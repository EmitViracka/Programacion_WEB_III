// components/topbar.jsx
import React from 'react';
import './topbar.css';

const Topbar = ({ onRegistroClick, onLoginClick, onCarritoClick, carritoCount, onPdfClick, isLoggedIn, usuario, onLogout }) => {
    return (
        <div className="topbar">
            <div className="topbar-container">
                <div className="logo-container">
                    <img src="/logotipo.png" alt="Logo" className="logo" />
                </div>
                
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder=" ¿Qué estas buscando?" 
                        className="search-input" 
                    />
                </div>
                
                <div className="buttons-container">
                    {/* Botón Iniciar Sesión */}
                    {!isLoggedIn && (
                        <button className="btn-login" onClick={onLoginClick}>
                             Iniciar Sesión
                        </button>
                    )}
                    
                    {/* Botón Registrarse */}
                    {!isLoggedIn && (
                        <button className="btn-registro" onClick={onRegistroClick}>
                             Registrate
                        </button>
                    )}
                    
                    {/* Usuario logueado */}
                    {isLoggedIn && (
                        <>
                            <button className="btn-user" onClick={() => alert(`Usuario: ${usuario?.nombre}`)}>
                                 {usuario?.nombre}
                            </button>
                            <button className="btn-logout" onClick={onLogout}>
                                 Cerrar Sesión
                            </button>
                        </>
                    )}
                    
                    <button className="btn-carrito" onClick={onCarritoClick}>
                         Carrito
                        {carritoCount > 0 && <span className="carrito-badge">{carritoCount}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;