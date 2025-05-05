'use client';

import styles from './Page.module.css';
import RojoG from '../components/Botones/RojoG';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inventariable, setInventariable] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');

  // Redirige si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Cargar departamento inicial
  useEffect(() => {
    if (status === 'authenticated') {
      const dep = session.user.departamentos?.[0]?.id || '';
      setDepartamentoSeleccionado(dep);
      localStorage.setItem('departamentoSeleccionado', dep);
    }
  }, [status, session]);

  // Cargar saldos según departamento seleccionado
  useEffect(() => {
    if (status !== 'authenticated' || !departamentoSeleccionado) return;

    const fetchSaldos = async () => {
      try {
        const resInv = await fetch(`/api/cantidad_inventariable?id=${departamentoSeleccionado}`);
        const dataInv = await resInv.json();
        setInventariable(dataInv.cantidad);

        const resPresu = await fetch(`/api/cantidad_presupuesto?id=${departamentoSeleccionado}`);
        const dataPresu = await resPresu.json();
        setPresupuesto(dataPresu.cantidad);
      } catch (error) {
        console.error('Error al cargar los saldos:', error);
      }
    };

    fetchSaldos();
  }, [status, departamentoSeleccionado]);

  const esAdminOContable =
    session?.user?.rol === 'admin' || session?.user?.rol === 'contable';

  const handleSelect = (e) => {
    const nuevoId = e.target.value;
    setDepartamentoSeleccionado(nuevoId);
    localStorage.setItem('departamentoSeleccionado', nuevoId);
  };

  if (status === 'loading') {
    return (
      <main className={styles.main}>
        <h2>Cargando sesión...</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>DISPONIBLE</h1>

      {esAdminOContable && (
        <div className={styles.selectorDepartamentos}>
          <label htmlFor="departamento">Ver datos de departamento:</label>
          <select
            id="departamento"
            value={departamentoSeleccionado}
            onChange={handleSelect}
          >
            {session.user.departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.tipo}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.contenedorDiv}>
        <div className={styles.sInv}>
          <h2 className={styles.cardTitle}>SALDO INVERSIONES:</h2>
          <p className={styles.cardValue}>
            {inventariable !== null
              ? Number(inventariable).toLocaleString('es-ES') + '€'
              : 'Cargando...'}
          </p>
        </div>
        <div className={styles.sPres}>
          <h2 className={styles.cardTitle}>SALDO PRESUPUESTO:</h2>
          <p className={styles.cardValue}>
            {presupuesto !== null
              ? Number(presupuesto).toLocaleString('es-ES') + '€'
              : 'Cargando...'}
          </p>
        </div>
      </div>

      <div className={styles.botonContainer}>
        <RojoG text="NUEVA ORDEN" />
      </div>
    </main>
  );
}
