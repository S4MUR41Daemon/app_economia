'use client';

import styles from './orden.module.css';
import { useState, useEffect } from 'react';
import useDepartamento from '@/utils/useDepartamento';

export default function Orden() {
  const departamento = useDepartamento();

  const [formData, setFormData] = useState({
    proveedor: '',
    saldo: '',
    nuevoProveedor: '',
    numInversion: '',
    pdf: null,
    comentarios: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departamento) {
      alert('No se ha seleccionado ningún departamento.');
      return;
    }

    try {
      const datos = new FormData();
      datos.append('departamento', departamento);
      datos.append('proveedor', formData.proveedor);
      datos.append('nuevoProveedor', formData.nuevoProveedor);
      datos.append('saldo', formData.saldo);
      datos.append('numInversion', formData.numInversion);
      datos.append('pdf', formData.pdf);
      datos.append('comentarios', formData.comentarios);

      const res = await fetch('/api/nueva_orden', {
        method: 'POST',
        body: datos,
      });

      if (!res.ok) throw new Error('Error al subir la orden');

      alert('Orden subida correctamente');
      // Puedes resetear el form si quieres:
      // setFormData({ ... });
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al subir la orden');
    }
  };

  if (!departamento) {
    return <main className={styles.main}><p>Cargando departamento...</p></main>;
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit}>
        <div className={styles.fila}>
          {/* Proveedor */}
          <div className={styles.columna}>
            <label htmlFor="proveedor">Proveedor:</label>
            <select
              id="proveedor"
              name="proveedor"
              className={styles.select}
              value={formData.proveedor}
              onChange={handleChange}
            >
              <option value="">Proveedor</option>
              {/* Aquí puedes hacer un map con proveedores reales */}
              <option value="1">Proveedor 1</option>
              <option value="2">Proveedor 2</option>
            </select>
          </div>

          {/* Departamento */}
          <div className={styles.columna}>
            <label>Departamento:</label>
            <input
              type="text"
              value={departamento}
              className={styles.select}
              disabled
            />
          </div>
        </div>

        <div className={styles.fila}>
          {/* Saldo + nuevo proveedor */}
          <div className={styles.columna}>
            <label htmlFor="saldo">Saldo gastado:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                id="saldo"
                name="saldo"
                className={styles.input}
                placeholder="8000€"
                value={formData.saldo}
                onChange={handleChange}
              />
              <input
                type="text"
                name="nuevoProveedor"
                className={styles.input}
                placeholder="Añadir proveedor"
                value={formData.nuevoProveedor}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.fila}>
          {/* Inversión + PDF */}
          <div className={styles.columna}>
            <label htmlFor="numInversion">Número de inversión:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                id="numInversion"
                name="numInversion"
                className={styles.input}
                placeholder="Nº Inversión"
                value={formData.numInversion}
                onChange={handleChange}
              />
              <input
                type="file"
                id="pdf"
                name="pdf"
                accept=".pdf"
                className={styles.fileInput}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.comentarios}>
          <label htmlFor="comentarios">Comentarios:</label>
          <textarea
            id="comentarios"
            name="comentarios"
            className={styles.textarea}
            value={formData.comentarios}
            onChange={handleChange}
          />
        </div>

        <div className={styles.fila}>
          <button type="submit" className={styles.boton}>SUBIR ORDEN</button>
        </div>
      </form>
    </main>
  );
}
