import styles from './rojoG.module.css';

export default function RojoG({ text, onClick }) {
  return (
    <button className={styles.botonRojo} onClick={onClick}>
      {text}
    </button>
  );
}
  