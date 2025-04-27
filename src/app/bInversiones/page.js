'use client';

import './bolsa-inversiones.css';
import { useEffect, useState } from 'react';

export default function BolsaInversiones() {
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [saldoInventariable, setSaldoInventariable] = useState(0);

  const toggleTransaction = (codigo) => {
    setExpandedTransaction(expandedTransaction === codigo ? null : codigo);
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const departamento = localStorage.getItem('departamento');
        
        // 1. Traemos el saldo inventariable
        const resSaldo = await fetch(`/api/orden_inver`);
        const dataSaldo = await resSaldo.json();
        setSaldoInventariable(dataSaldo.saldoInventariable || 0);

        // 2. Traemos las órdenes de inversión
        const resOrdenes = await fetch(`/api/orden_inver/ordenes?departamento=${departamento}`);
        const dataOrdenes = await resOrdenes.json();
        setOrdenes(dataOrdenes.ordenes || []);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchDatos();
  }, []);

  return (
    <div className="bolsa-inversiones">
      <h1>Bolsa de Inversiones</h1>

      {/* SALDO ACTUAL */}
      <div className="saldos-container">
        <div className="saldo-box">
          <div className="saldo-title">SALDO ACTUAL</div>
          <div className="saldo-amount">{saldoInventariable.toLocaleString()}€</div>
        </div>
      </div>

      {/* 10 ÚLTIMAS ÓRDENES */}
      <div className="filtro-section">
        <div className="filtro-title">10 ÚLTIMAS ÓRDENES</div>
      </div>

      <div className="transacciones-container">
        <div className="transaction-title">Fecha + Cantidad Gastada</div>

        <div className="column-headers">
          <div className="column-header">Fecha y Cantidad</div>
          <div className="column-header">Departamento</div>
        </div>

        {ordenes.length > 0 ? (
          ordenes.map((orden) => (
            <div key={orden.codigo}>
              <div 
                className="transaction-row"
                onClick={() => toggleTransaction(orden.codigo)}
              >
                <div className="transaction-text">
                  <span className="transaction-date">{orden.fecha}</span> - {orden.saldo_gastado}€
                </div>
                <div className="dropdown-arrow"></div>
              </div>

              {/* PANEL EXPANDIBLE */}
              {expandedTransaction === orden.codigo && (
                <div className="provider-details">
                  <div className="provider-row">
                    <div className="provider-label">Proveedor:</div>
                    <div className="provider-value">{orden.nombreProveedor}</div>
                  </div>

                  <div className="provider-row">
                    <div className="provider-label">Comentarios:</div>
                  </div>

                  <div className="provider-products">
                    {orden.comentarios}
                    <div className="button-container">
                      <button className="button">Ver PDF</button>
                      <button className="button">Ver Facturas</button>
                      <button className="button button-danger">Eliminar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ padding: '1rem' }}>No hay órdenes disponibles.</p>
        )}
      </div>
    </div>
  );
}
