
"use client";

import './bolsa-inversiones.css';
import { useState } from 'react';

export default function BolsaInversiones() {
  // Estado para controlar qué transacción está expandida
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  
  // Definimos los datos del proveedor
  const proveedorInfo = {
    nombre: "Nombre del Proveedor",
    factura: "FAC-001",
    productos: "Descripción de productos adquiridos"
  };

  // Datos de ejemplo para las transacciones (10 transacciones)
  const [transactions, setTransactions] = useState([
    { id: 1, fecha: "2023-04-15", cantidad: "$1,200.00", departamento: "Ventas" },
    { id: 2, fecha: "2023-04-20", cantidad: "$980.50", departamento: "Marketing" },
    { id: 3, fecha: "2023-04-28", cantidad: "$2,345.75", departamento: "Operaciones" },
    { id: 4, fecha: "2023-05-03", cantidad: "$1,567.20", departamento: "Ventas" },
    { id: 5, fecha: "2023-05-12", cantidad: "$765.30", departamento: "IT" },
    { id: 6, fecha: "2023-05-18", cantidad: "$3,210.45", departamento: "Finanzas" },
    { id: 7, fecha: "2023-05-25", cantidad: "$950.00", departamento: "Marketing" },
    { id: 8, fecha: "2023-06-01", cantidad: "$1,845.60", departamento: "Operaciones" },
    { id: 9, fecha: "2023-06-10", cantidad: "$2,100.75", departamento: "Ventas" },
    { id: 10, fecha: "2023-06-15", cantidad: "$1,320.25", departamento: "IT" }
  ]);

  // Función para mostrar/ocultar detalles de transacción
  const toggleTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  return(
    <div className="bolsa-inversiones">
      <h1>Bolsa de Inversiones</h1>

      {/* Sección de saldo actual (solo un recuadro) */}
      <div className="saldos-container">
        <div className="saldo-box">
          <div className="saldo-title">SALDO ACTUAL</div>
          <div className="saldo-amount">$45,678.90</div>
        </div>
      </div>

      {/* Sección de últimas órdenes */}
      <div className="filtro-section">
        <div className="filtro-title">10 ULTIMAS ORDENES</div>
      </div>

      {/* Contenedor de transacciones */}
      <div className="transacciones-container">
        {/* Título fuera del recuadro blanco */}
        <div className="transaction-title">
          Fecha + Cantidad Gastada
        </div>
        
        {/* Encabezados de columnas */}
        <div className="column-headers">
          <div className="column-header">Fecha y Cantidad</div>
          <div className="column-header">Departamento</div>
        </div>
        
        {/* Filas de transacciones - ahora 10 recuadros */}
        {transactions.map(transaction => (
          <div key={transaction.id}>
            <div 
              className="transaction-row"
              onClick={() => toggleTransaction(transaction.id)}
            >
              <div className="transaction-text">
                <span className="transaction-date">{transaction.fecha}</span> - {transaction.cantidad}
              </div>
              <div className="dropdown-arrow"></div>
            </div>
            
            {/* Panel expandido con detalles del proveedor */}
            {expandedTransaction === transaction.id && (
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
                    <button className="button">Ver PDF</button>
                    <button className="button">Ver Facturas</button>
                    <button className="button button-danger">Eliminar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
