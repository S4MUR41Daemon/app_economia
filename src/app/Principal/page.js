'use client';

import styles from './Page.module.css';
import RojoG from '../components/Botones/RojoG';
import { useEffect, useState } from 'react';

export default function Home() {
  const [inventariable, setInventariable] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('departamento');

    const fetchSaldos = async () => {
      if (!id) return;

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
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>DISPONIBLE</h1>
      <div className={styles.contenedorDiv}>
        <div className={styles.sInv}>
          <h2 className={styles.cardTitle}>SALDO INVERSIONES:</h2>
          <p className={styles.cardValue}>
            {inventariable !== null ? Number(inventariable).toLocaleString('es-ES') + '€' : 'Cargando...'}
          </p>
        </div>
        <div className={styles.sPres}>
          <h2 className={styles.cardTitle}>SALDO PRESUPUESTO:</h2>
          <p className={styles.cardValue}>
            {presupuesto !== null ? Number(presupuesto).toLocaleString('es-ES') + '€' : 'Cargando...'}
          </p>
        </div>
      </div>
      <div className={styles.botonContainer}>
        <RojoG text="NUEVA ORDEN" />
      </div>
    </main>
  );
}
