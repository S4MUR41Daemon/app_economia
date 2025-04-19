import styles from './Login.module.css';

export default async function Login() {
  const res = await fetch('http://localhost:3000/api/departamentos');
  const departamentos = await res.json();

  return (
    <div className={styles.fondo}>
      <main className={styles.contenido}>
        <h1>Bienvenido</h1>
        <label htmlFor="departamento">Selecciona tu departamento:</label>
        <select id="departamento" name="departamento">
          <option value="">-- Selecciona --</option>
          {departamentos.map((dep) => (
            <option key={dep.id_departamento} value={dep.id_departamento}>
              {dep.tipo}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="Usuario">Nombre de usuario:</label>
        <input type="text" id="Usuario" name="Usuario" placeholder="Inserte su nombre de usuario" />
        <br />
        <label htmlFor="Contraseña">Contraseña:</label>
        <input type="password" id="Contraseña" name="Contraseña" placeholder="Inserte su contraseña" />
        <br />
        <input type="submit" />
      </main>
      <div className={styles.imagenDecorativa}></div>
    </div>
  );
}
