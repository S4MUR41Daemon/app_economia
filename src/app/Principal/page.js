import styles from './Page.module.css';
import RojoG from './components/Botones/RojoG';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>DISPONIBLE</h1>
      <div className={styles.contenedorDiv}>
        <div className={styles.sInv}></div>
        <div className={styles.sPres}></div>
      </div>
      <RojoG text="NUEVA ORDEN" />
    </main>
  );
}
