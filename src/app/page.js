import styles from './Login.module.css';

export default function Login() {
  return (
    <div className={styles.fondo}>
      <main className={styles.contenido}>
        <h1>Bienvenido</h1>
        <label htmlFor="departamento">Selecciona tu departamento:</label>
        <select id="departamento" name="departamento">
          <option value="">-- Selecciona --</option>
          <option value="informatica">Informática</option>
          <option value="contabilidad">Contabilidad</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </main>
      <div className={styles.imagenDecorativa}></div>
    </div>
  );
}
