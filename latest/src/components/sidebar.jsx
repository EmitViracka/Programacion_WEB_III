import React from 'react';
import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar-content">
            <div className="filter-section">
                <h4>PRENDA</h4>
                <ul className="filter-list">
                    <li>Chompa</li>
                    <li>Polera</li>
                    <li>Vestidos</li>
                    <li>Pantalon</li>
                </ul>
            </div>
            
            <div className="filter-section">
                <h4>TEMPORADA</h4>
                <ul className="filter-list">
                    <li>Invierno</li>
                    <li>Verano</li>
                </ul>
            </div>
            
            <div className="filter-section">
                <h4>PUBLICO</h4>
                <ul className="filter-list">
                    <li>Niña</li>
                    <li>Joven</li>
                    <li>Dama</li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;