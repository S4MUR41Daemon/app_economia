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

  // Si no hay sesión, redirige al login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Una vez autenticado, carga los saldos
  useEffect(() => {
    if (status !== 'authenticated') return;

    const id = session.user.departamentos?.[0]?.id;

    if (!id) return;

    const fetchSaldos = async () => {
      try {
        const resInv = await fetch(`/api/cantidad_inventariable?id=${id}`);
        const dataInv = await resInv.json();
        setInventariable(dataInv.cantidad);

        const resPresu = await fetch(`/api/cantidad_presupuesto?id=${id}`);
        const dataPresu = await resPresu.json();
        setPresupuesto(dataPresu.cantidad);
      } catch (error) {
        console.error('Error al cargar los saldos:', error);
      }
    };

    fetchSaldos();
  }, [status, session]);

  if (status === 'loading') {
    return <main className={styles.main}><h2>Cargando sesión...</h2></main>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>DISPONIBLE</h1>
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
