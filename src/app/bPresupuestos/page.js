'use client';

import './presupuesto.css';
import { useState, useEffect } from 'react';
import useDepartamento from '@/utils/useDepartamento';

export default function BolsaPresupuestos() {
  const departamento = useDepartamento();
  const [ordenes, setOrdenes] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [saldoPresupuesto, setSaldoPresupuesto] = useState(0);

  useEffect(() => {
    if (!departamento) return;

    const fetchData = async () => {
      try {
        const resSaldo = await fetch(`/api/orden_presu?departamento=${departamento}`);
        const saldoData = await resSaldo.json();
        setSaldoPresupuesto(saldoData.saldoPresupuesto || 0);

        const resOrdenes = await fetch(`/api/orden_presu/ordenes?departamento=${departamento}`);
        const ordenesData = await resOrdenes.json();
        setOrdenes(ordenesData.ordenes || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, [departamento]);

  const toggleTransaction = (codigo) => {
    setExpandedTransaction(expandedTransaction === codigo ? null : codigo);
  };

  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    return nuevaFecha.toLocaleDateString('es-ES');
  };

  const eliminarOrden = async (codigo, documento_pdf) => {
    try {
      const res = await fetch('/api/eliminar_orden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo, documento_pdf }),
      });

      if (!res.ok) {
        throw new Error('Error al eliminar la orden');
      }

      // Recargar datos después de eliminar
      const resSaldo = await fetch(`/api/orden_presu?departamento=${departamento}`);
      const saldoData = await resSaldo.json();
      setSaldoPresupuesto(saldoData.saldoPresupuesto || 0);

      const resOrdenes = await fetch(`/api/orden_presu/ordenes?departamento=${departamento}`);
      const ordenesData = await resOrdenes.json();
      setOrdenes(ordenesData.ordenes || []);

    } catch (error) {
      console.error('Error eliminando la orden:', error);
    }
  };

  if (!departamento) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando departamento...</p>;
  }

  return (
    <div className="bolsa-inversiones">
      <h1>Bolsa de Presupuestos</h1>

      <div className="saldos-container">
        <div className="saldo-box">
          <div className="saldo-title">SALDO ACTUAL</div>
          <div className="saldo-amount">
            {Number(saldoPresupuesto).toLocaleString('es-ES')}€
          </div>
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
          ordenes.map((orden, index) => (
            <div key={`${orden.codigo}-${orden.fecha || index}`}>
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
                      {orden.documento_pdf && (
                        <a
                          className="button"
                          href={`/uploads/${orden.documento_pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver PDF
                        </a>
                      )}
                      <button
                        className="button button-danger"
                        onClick={() => eliminarOrden(orden.codigo, orden.documento_pdf)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="transaction-row">No hay órdenes disponibles.</div>
        )}
      </div>
    </div>
  );
}
