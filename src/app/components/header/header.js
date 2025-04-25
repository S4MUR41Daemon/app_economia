"use client"

import styles from './Header.module.css'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Añadido

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // 👈 Instancia del router

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goTo = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("departamento");
    router.push('/');
  };

  return (
    <header>
      <div className={styles.navBar}>
        <Image 
          src="/Salesianos.png"
          alt="Logo Salesianos"
          width={180}
          height={120}
          className={styles.logo}
        />
        <div className={`${styles.topCircle} ${menuOpen ? styles.menuOpen : ''}`}>
          <div className={styles.contenedorP}>
            <button onClick={() => goTo('/Principal')} className={styles.menuBtn}>SALDO DISPONIBLE</button>
            <button onClick={() => goTo('/nueva_orden')} className={styles.menuBtn}>NUEVA ORDEN</button>
            <button onClick={() => goTo('/bInversiones')} className={styles.menuBtn}>BOLSA DE INVERSIONES</button>
            <button onClick={() => goTo('/bPresupuestos')} className={styles.menuBtn}>BOLSA DE PRESUPUESTOS</button>
            <button onClick={handleLogout} className={styles.menuBtn}>CERRAR SESIÓN</button>
          </div>
        </div>
        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMenu}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
