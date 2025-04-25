"use client";

import styles from './presupuesto.module.css';
import { useState } from 'react';

export default function BolsaInversiones() {
  // Definimos los datos del proveedor
  const proveedorInfo = {
    nombre: "Nombre del Proveedor",
    factura: "FAC-001",
    productos: "Descripción de productos adquiridos"
  };

  // Datos de ejemplo para las transacciones
  const [transactions, setTransactions] = useState([
    { id: 1, fecha: "2023-01-15", cantidad: "$1,200.00", departamento: "Ventas" },
    { id: 2, fecha: "2023-01-20", cantidad: "$980.50", departamento: "Marketing" },
    { id: 3, fecha: "2023-02-05", cantidad: "$2,345.75", departamento: "Operaciones" }
  ]);

  // Función para mostrar/ocultar detalles de transacción
  const toggleTransaction = (id) => {
    console.log(`Toggled transaction ${id}`);
    // Aquí puedes implementar la lógica para mostrar/ocultar detalles
  };

  return(
    <div className="bolsa-inversiones">
      <h1>Bolsa de Presupuestos</h1>

      {/* Sección de saldos */}
      <div className="saldos-container">
        <div className="saldo-box">
          <div className="saldo-title">SALDO INICIAL:</div>
          <div className="saldo-amount">$50,000.00</div>
          <div className="saldo-rate">+3% month over month</div>
        </div>
        
        <div className="saldo-box">
          <div className="saldo-title">SALDO ACTUAL:</div>
          <div className="saldo-amount">$45,678.90</div>
          <div className="saldo-rate">+2% month over month</div>
        </div>
      </div>

      {/* Sección de filtro */}
      <div className="filtro-section">
        <div className="filtro-title">FILTRO</div>
        <div className="filtro-caption">Utilice o campo</div>
      </div>

      {/* Contenedor de transacciones */}
      <div className="transacciones-container">
        {/* Barra de búsqueda */}
        <div className="search-bar">
          "fecha" + "cantidad gastada"
        </div>
        
        {/* Encabezados de columnas */}
        <div className="column-headers">
          <div className="column-header">"fecha" + "cantidad gastada"</div>
          <div className="column-header">"Departamento"</div>
        </div>
        
        {/* Detalles del proveedor - Este es un ejemplo expandido */}
        <div className="provider-details">
          <div className="provider-row">
            <div className="provider-label">{proveedorInfo.nombre}</div>
            <div className="provider-value">Factura <span style={{ color: 'red' }}>{proveedorInfo.factura}</span></div>
          </div>
          
          <div className="provider-row">
            <div className="provider-label">Productos o servicios adquiridos:</div>
          </div>
          
          <div className="provider-products">
            {proveedorInfo.productos}
            <div className="button-container">
              <button className="button">Editar</button>
              <button className="button button-danger">Eliminar</button>
            </div>
          </div>
        </div>
        
        {/* Filas de transacciones */}
        {transactions.map(transaction => (
          <div 
            key={transaction.id} 
            className="transaction-row"
            onClick={() => toggleTransaction(transaction.id)}
          >
            <div className="transaction-text">{transaction.fecha} + {transaction.cantidad}</div>
            <div className="dropdown-arrow"></div>
          </div>
        ))}
      </div>
    </div>
  );
}