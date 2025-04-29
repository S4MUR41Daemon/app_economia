"use client";

import './presupuesto.css';
import { useState, useEffect } from 'react';

export default function BolsaPresupuestos() {
  const [ordenes, setOrdenes] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [saldoPresupuesto, setSaldoPresupuesto] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departamento = localStorage.getItem('departamento');
        if (!departamento) return;

        // Traer saldo actual
        const resSaldo = await fetch(`/api/orden_presu?departamento=${departamento}`);
        const saldoData = await resSaldo.json();
        setSaldoPresupuesto(saldoData.saldoPresupuesto);

        // Traer últimas órdenes
        const resOrdenes = await fetch(`/api/orden_presu/ordenes?departamento=${departamento}`);
        const ordenesData = await resOrdenes.json();
        setOrdenes(ordenesData.ordenes || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, []);

  const toggleTransaction = (codigo) => {
    setExpandedTransaction(expandedTransaction === codigo ? null : codigo);
  };

  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    return nuevaFecha.toLocaleDateString('es-ES');
  };

  return (
    <div className="bolsa-inversiones">
      <h1>Bolsa de Presupuestos</h1>

      <div className="saldos-container">
        <div className="saldo-box">
          <div className="saldo-title">SALDO ACTUAL</div>
          <div className="saldo-amount">{saldoPresupuesto.toLocaleString('es-ES')}€</div>
        </div>
      </div>

      <div className="filtro-section">
        <div className="filtro-title">10 ÚLTIMAS ÓRDENES</div>
      </div>

      <div className="transacciones-container">
        <div className="transaction-title">
          Fecha + Departamento + Cantidad Gastada
        </div>

        <div className="column-headers">
          <div className="column-header">Fecha - Departamento - Cantidad</div>
          <div className="column-header"></div>
        </div>

        {ordenes.length > 0 ? (
          ordenes.map((orden) => (
            <div key={orden.codigo}>
              <div
                className="transaction-row"
                onClick={() => toggleTransaction(orden.codigo)}
              >
                <div className="transaction-text">
                  <span className="transaction-date">
                    {formatearFecha(orden.fecha)}
                  </span> - {orden.nombreDepartamento} - {orden.saldo_gastado}€
                </div>
                <div className="dropdown-arrow"></div>
              </div>

              {expandedTransaction === orden.codigo && (
                <div className="provider-details">
                  <div className="provider-row">
                    <div className="provider-label">Proveedor:</div>
                    <div className="provider-value">{orden.nombreProveedor}</div>
                  </div>
                  <div className="provider-row">
                    <div className="provider-label">Comentarios:</div>
                    <div className="provider-value">{orden.comentarios}</div>
                  </div>
                  <div className="provider-products">
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
          <div className="transaction-row">
            No hay órdenes disponibles.
          </div>
        )}
      </div>
    </div>
  );
}
