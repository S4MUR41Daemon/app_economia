'use client';

import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const router = useRouter();

  // Fetch de departamentos al cargar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch('/api/departamentos');
        const data = await res.json();
        setDepartamentos(data);
      } catch (err) {
        console.error('Error al cargar departamentos:', err);
      }
    };

    fetchDepartamentos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (departamento) {
      localStorage.setItem('departamento', departamento);
      router.push('/Principal');
    }
  };

  return (
    <div className={styles.fondo}>
      <main className={styles.contenido}>
        <h1>Bienvenido</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="departamento">Selecciona tu departamento:</label>
          <select
            id="departamento"
            name="departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
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
          <input type="submit" value="Enviar" />
        </form>
          <h3>¿has olvidado tu contraseña?</h3>
      </main>
      <div className={styles.imagenDecorativa}></div>
    </div>
  );
}
