// components/Dashboard.jsx
import React, { useState } from 'react';
import ProductoManager from './producto';
import EstadisticasChart from './EstadisticasChart';
import Topbar from './topbar';
import Footers from './footers';
import pdfService from '../services/pdfService';
import { api } from '../services/api';

function Dashboard({ usuario, setProductos, productos }) {
    const [seccionActiva, setSeccionActiva] = useState('crud'); // 'crud', 'estadisticas', 'pdf'
    const isAdmin = usuario?.rol === 'admin';

    const generarPDF = () => {
        if (productos.length > 0) {
            pdfService.generarReporteProductos(productos);
            alert(' Reporte PDF generado correctamente');
        } else {
            alert('No hay productos para generar el reporte');
        }
    };

    const handleLogout = async () => {
        await api.logout();
        window.location.href = '/';
    };

    const styles = {
        container: { display: 'flex', minHeight: '100vh' },
        
        // Menú lateral
        sidebar: {
            width: '280px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        sidebarTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: '1rem',
            borderBottom: '2px solid #70a1bf',
            marginBottom: '1rem'
        },
        menuItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '1rem',
            fontWeight: '500',
            border: 'none',
            width: '100%',
            textAlign: 'left'
        },
        menuItemActive: {
            backgroundColor: '#70a1bf',
            color: 'white'
        },
        menuItemInactive: {
            backgroundColor: 'transparent',
            color: '#ecf0f1'
        },
        logoutBtn: {
            marginTop: 'auto',
            backgroundColor: '#5d056e',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '1rem',
            fontWeight: '500'
        },
        
        // Contenido principal
        mainContent: {
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: '2rem',
            overflowY: 'auto'
        },
        header: {
            backgroundColor: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        welcomeText: {
            fontSize: '1.2rem',
            color: '#333'
        },
        userName: {
            fontWeight: 'bold',
            color: '#70a1bf'
        },
        contentCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }
    };

    const getMenuItemStyle = (seccion) => ({
        ...styles.menuItem,
        ...(seccionActiva === seccion ? styles.menuItemActive : styles.menuItemInactive)
    });

    return (
        <div style={styles.container}>
            {/* Menú Lateral */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarTitle}>
                     Mi Panel
                </div>
                
                {/* Botón CRUD (solo para admin) */}
                {isAdmin && (
                    <button
                        style={getMenuItemStyle('crud')}
                        onClick={() => setSeccionActiva('crud')}
                    >
                        <span style={{ fontSize: '1.5rem' }}></span>
                        <span>Administrar Productos</span>
                    </button>
                )}
                
                {/* Botón Estadísticas */}
                <button
                    style={getMenuItemStyle('estadisticas')}
                    onClick={() => setSeccionActiva('estadisticas')}
                >
                    <span>Estadísticas</span>
                </button>
                
                {/* Botón Reporte PDF */}
                <button
                    style={getMenuItemStyle('pdf')}
                    onClick={generarPDF}
                >
                    <span>Generar Reporte PDF</span>
                </button>
                
                <button
                    style={styles.logoutBtn}
                    onClick={handleLogout}
                >
                    <span>Cerrar Sesión</span>
                </button>
            </div>
            
            {/* Contenido Principal */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <div style={styles.welcomeText}>
                         Bienvenido, <span style={styles.userName}>{usuario?.nombre}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        Rol: {usuario?.rol === 'admin' ? 'Administrador' : 'Cliente'}
                    </div>
                </div>
                
                <div style={styles.contentCard}>
                    {seccionActiva === 'crud' && isAdmin && (
                        <ProductoManager onProductosChange={setProductos} />
                    )}
                    
                    {seccionActiva === 'crud' && !isAdmin && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p> No tienes permisos de administrador.</p>
                            <p>Contacta al administrador para acceder al CRUD.</p>
                        </div>
                    )}
                    
                    {seccionActiva === 'estadisticas' && (
                        <EstadisticasChart />
                    )}
                    
                    {seccionActiva === 'pdf' && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}> Generar Reporte PDF</h2>
                            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                                Genera un reporte completo de todos los productos en formato PDF.
                            </p>
                            <button
                                onClick={generarPDF}
                                style={{
                                    backgroundColor: '#5d056e',
                                    color: 'white',
                                    padding: '12px 30px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Generar Reporte PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;