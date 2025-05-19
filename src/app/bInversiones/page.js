'use client';

import './bolsa-inversiones.css';
import { useState, useEffect } from 'react';
import useDepartamento from '@/utils/useDepartamento';
import { useSession } from 'next-auth/react';

export default function BolsaInversiones() {
  const departamento = useDepartamento();
  const { data: session } = useSession();
  const rol = session?.user?.rol;

  const [ordenes, setOrdenes] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [saldoInventariable, setSaldoInventariable] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTipo, setToastTipo] = useState('');
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);

  useEffect(() => {
    if (!departamento) return;

    const fetchData = async () => {
      const resSaldo = await fetch(`/api/orden_inver?departamento=${departamento}`);
      const saldoData = await resSaldo.json();
      setSaldoInventariable(saldoData.saldoInventariable);

      const resOrdenes = await fetch(`/api/orden_inver/ordenes?departamento=${departamento}`);
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
    if (rol === 'contable') {
      setToastMessage('❌ No tienes permisos para eliminar esta orden.');
      setToastTipo('error');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
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

      const resSaldo = await fetch(`/api/orden_inver?departamento=${departamento}`);
      const saldoData = await resSaldo.json();
      setSaldoInventariable(saldoData.saldoInventariable);

      const resOrdenes = await fetch(`/api/orden_inver/ordenes?departamento=${departamento}`);
      const ordenesData = await resOrdenes.json();
      setOrdenes(ordenesData.ordenes || []);

      setToastMessage('Orden eliminada con éxito ✅');
      setToastTipo('success');
    } catch (error) {
      console.error(error);
      setToastMessage('⚠️ Error al eliminar la orden');
      setToastTipo('error');
    } finally {
      setOrdenAEliminar(null);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  if (!departamento) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando departamento...</p>;
  }

  return (
    <div className="bolsa-inversiones">
      <h1>Bolsa de Inversiones</h1>

      {toastMessage && (
        <div className={`toast ${toastTipo === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toastMessage}
        </div>
      )}

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
          <div className="saldo-amount">{Number(saldoInventariable).toLocaleString('es-ES')}€</div>
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
                      {rol !== 'contable' && (
                        <button
                          className="button button-danger"
                          onClick={() => confirmarEliminacion(orden.codigo, orden.documento_pdf)}
                        >
                          Eliminar
                        </button>
                      )}
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
