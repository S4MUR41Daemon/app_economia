import styles from './Header.module.css'
import Image from 'next/image';

export default function Header() {
    return(
        <header>
            <div className={styles.topCircle}>
                <div className={styles.contenedorP}>
                    <p>SALDO DISPONIBLE</p>
                    <p>NUEVA ORDEN</p>
                    <p>BOLSA DE INVERSIONES</p>
                    <p>BOLSA DE PRESUPUESTOS</p>
                    <p>CERRAR SESIÓN</p>
                </div>
            </div>
            <div className={styles.navBar}>
            <Image 
                src="/Salesianos.png"  // Ojo: sin 'src/app', usa 'public' como raíz
                alt="Logo Salesianos"
                width={250}            // ajusta el tamaño
                height={100}
                className={styles.logo}
            />
            </div>
        </header>
    )
}