import styles from './Page.module.css';
import RojoG from '../components/Botones/RojoG';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>DISPONIBLE</h1>
      <div className={styles.contenedorDiv}>
        <div className={styles.sInv}>
          <h2 className={styles.cardTitle}>SALDO INVENTARIABLE:</h2>
          <p className={styles.cardValue}>45,678.90</p>
        </div>
        <div className={styles.sPres}>
          <h2 className={styles.cardTitle}>SALDO PRESUPUESTO:</h2>
          <p className={styles.cardValue}>2,405</p>
        </div>
      </div>
      <div className={styles.botonContainer}>
        <RojoG text="NUEVA ORDEN" />
      </div>
    </main>
  );
}