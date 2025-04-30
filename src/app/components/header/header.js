"use client";

import styles from './Header.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // 👈 Importamos NextAuth

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // 👈 Obtenemos datos del usuario

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goTo = (path) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // 👈 Cierra sesión y redirige al login
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

            {/* Nombre del usuario, si está logueado */}
            {session?.user?.name && (
              <span className={styles.nombreUsuario}>
                {session.user.name.toUpperCase()}
              </span>
            )}

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
