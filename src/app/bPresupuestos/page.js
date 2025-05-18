'use client';

import './presupuesto.css';
import { useState, useEffect } from 'react';
import useDepartamento from '@/utils/useDepartamento';

export default function BolsaPresupuestos() {
  const departamento = useDepartamento();
  const [ordenes, setOrdenes] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [saldoPresupuesto, setSaldoPresupuesto] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);

  useEffect(() => {
    if (!departamento) return;

    const fetchData = async () => {
      const resSaldo = await fetch(`/api/orden_presu?departamento=${departamento}`);
      const saldoData = await resSaldo.json();
      setSaldoPresupuesto(saldoData.saldoPresupuesto || 0);

      const resOrdenes = await fetch(`/api/orden_presu/ordenes?departamento=${departamento}`);
      const ordenesData = await resOrdenes.json();
      setOrdenes(ordenesData.ordenes || []);
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

  const confirmarEliminacion = (codigo, documento_pdf) => {
    setOrdenAEliminar({ codigo, documento_pdf });
  };

  const cancelarEliminacion = () => {
    setOrdenAEliminar(null);
  };

  const eliminarOrden = async () => {
    if (!ordenAEliminar) return;
    const { codigo, documento_pdf } = ordenAEliminar;

    try {
      const res = await fetch('/api/eliminar_orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, documento_pdf }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Error al eliminar');

      // Refrescar datos
      const resSaldo = await fetch(`/api/orden_presu?departamento=${departamento}`);
      const saldoData = await resSaldo.json();
      setSaldoPresupuesto(saldoData.saldoPresupuesto || 0);

      const resOrdenes = await fetch(`/api/orden_presu/ordenes?departamento=${departamento}`);
      const ordenesData = await resOrdenes.json();
      setOrdenes(ordenesData.ordenes || []);

      setToastMessage('Orden eliminada con éxito ✅');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setToastMessage('⚠️ Error al eliminar la orden');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setOrdenAEliminar(null);
    }
  };

  if (!departamento) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando departamento...</p>;
  }

  return (
    <div className="bolsa-inversiones">
      <h1>Bolsa de Presupuestos</h1>

      {toastMessage && <div className="toast">{toastMessage}</div>}

      {ordenAEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Estás seguro de que quieres eliminar esta orden?</p>
            <div className="modal-buttons">
              <button onClick={eliminarOrden} className="button button-danger">Sí</button>
              <button onClick={cancelarEliminacion} className="button">No</button>
            </div>
          </div>
        </div>
      )}

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
                        onClick={() => confirmarEliminacion(orden.codigo, orden.documento_pdf)}
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
