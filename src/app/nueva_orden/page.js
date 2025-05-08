'use client';

import styles from './orden.module.css';
import { useEffect, useState } from 'react';
import useDepartamento from '@/utils/useDepartamento';

export default function Orden() {
  const departamento = useDepartamento();

  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    proveedor: '',
    saldo: '',
    nuevoProveedor: '',
    numInversion: '',
    pdf: null,
    comentarios: '',
  });

  // Cargar proveedores del departamento
  useEffect(() => {
    const fetchProveedores = async () => {
      if (!departamento) return;
      try {
        const res = await fetch(`/api/proveedores?departamento=${departamento}`);
        const data = await res.json();
        setProveedores(data.proveedores || []);
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
      }
    };

    fetchProveedores();
  }, [departamento]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddProveedor = async () => {
    if (!formData.nuevoProveedor.trim()) return;

    try {
      const res = await fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nuevoProveedor,
          departamento,
        }),
      });

      const { cif } = await res.json();

      const resLista = await fetch(`/api/proveedores?departamento=${departamento}`);
      const data = await resLista.json();
      setProveedores(data.proveedores || []);

      setFormData((prev) => ({
        ...prev,
        proveedor: cif,
        nuevoProveedor: '',
      }));
    } catch (err) {
      console.error('Error al añadir proveedor:', err);
      alert('No se pudo añadir el proveedor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departamento) return alert('No hay departamento seleccionado.');

    try {
      const datos = new FormData();
      datos.append('departamento', departamento);
      Object.entries(formData).forEach(([key, value]) =>
        datos.append(key, value)
      );

      const res = await fetch('/api/nueva_orden', {
        method: 'POST',
        body: datos,
      });

      if (!res.ok) throw new Error('Error al subir la orden');
      alert('Orden subida correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al subir la orden');
    }
  };

  if (!departamento) {
    return <main className={styles.main}><p>Cargando departamento...</p></main>;
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.formVertical}>
        <label htmlFor="proveedor" className={styles.etiqueta}>Proveedor:</label>
        <select
          id="proveedor"
          name="proveedor"
          className={styles.select}
          value={formData.proveedor}
          onChange={handleChange}
        >
          <option value="">Seleccione un proveedor</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="departamento" className={styles.etiqueta}>Departamento:</label>
        <input
          type="text"
          id="departamento"
          className={styles.select}
          value={departamento}
          disabled
        />

        <label htmlFor="saldo" className={styles.etiqueta}>Saldo gastado:</label>
        <input
          type="text"
          id="saldo"
          name="saldo"
          className={styles.input}
          value={formData.saldo}
          onChange={handleChange}
          placeholder="8000€"
        />

        <label htmlFor="nuevoProveedor" className={styles.etiqueta}>Añadir proveedor:</label>
        <div className={styles.inlineGroup}>
          <input
            type="text"
            id="nuevoProveedor"
            name="nuevoProveedor"
            className={styles.input}
            value={formData.nuevoProveedor}
            onChange={handleChange}
            placeholder="Nombre proveedor"
          />
          <button
            type="button"
            className={styles.botonSecundario}
            onClick={handleAddProveedor}
          >
            Añadir
          </button>
        </div>

        <label htmlFor="numInversion" className={styles.etiqueta}>Número de inversión:</label>
        <input
          type="text"
          id="numInversion"
          name="numInversion"
          className={styles.input}
          value={formData.numInversion}
          onChange={handleChange}
          placeholder="Nº Inversión"
        />

        <label htmlFor="pdf" className={styles.etiqueta}>Subir PDF:</label>
        <input
          type="file"
          id="pdf"
          name="pdf"
          accept=".pdf"
          className={styles.fileInput}
          onChange={handleChange}
        />

        <label htmlFor="comentarios" className={styles.etiqueta}>Comentarios:</label>
        <textarea
          id="comentarios"
          name="comentarios"
          className={styles.textarea}
          value={formData.comentarios}
          onChange={handleChange}
        />

        <button type="submit" className={styles.boton}>SUBIR ORDEN</button>
      </form>
    </main>
  );
}
