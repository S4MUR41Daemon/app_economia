import styles from './orden.module.css';

export default async function Orden() {
  return (
    <main className={styles.main}>
      <div className={styles.fila}>
        {/* Proveedor */}
        <div className={styles.columna}>
            <label htmlFor="proveedor">Proveedor:</label>
            <select id="proveedor" name="proveedor" className={styles.select}>
            <option value="">Proveedor</option>
            </select>
        </div>

    {/* Departamento */}
    <div className={styles.columna}>
        <label htmlFor="departamento">Departamento:</label>
        <select id="departamento" name="departamento" className={styles.select}>
        <option value="">Departamento</option>
        </select>
    </div>
    </div>


      <div className={styles.fila}>
        {/* Columna de "Saldo gastado" */}
        <div className={styles.columna}>
            <label htmlFor="saldogastado">Saldo gastado:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
            <input
                type="text"
                id="saldogastado"
                name="saldogastado"
                className={styles.input}
                placeholder="8000€"
            />
            <input
                type="text"
                name="añadirproveedor"
                className={styles.input}
                placeholder="Añadir proveedor"
            />
            </div>
        </div>
        </div>

        <div className={styles.fila}>
        {/* Columna de "Número de inversión" */}
        <div className={styles.columna}>
            <label htmlFor="numInversion">Número de inversión:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
            <input
                type="text"
                id="numInversion"
                name="numInversion"
                className={styles.input}
                placeholder="Nº Inversión"
            />
            <input
                type="file"
                id="pdf"
                name="pdf"
                accept=".pdf"
                className={styles.fileInput}
            />
            </div>
        </div>
        </div>


      <div className={styles.comentarios}>
        <label htmlFor="comentarios">Comentarios:</label>
        <textarea id="comentarios" className={styles.textarea}></textarea>
      </div>

      <div className={styles.fila}>
        <button className={styles.boton}>SUBIR ORDEN</button>
      </div>
    </main>
  );
}
