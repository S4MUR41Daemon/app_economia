"use client"

import styles from './Header.module.css'
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    return(
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
                        <p>SALDO DISPONIBLE</p>
                        <p>NUEVA ORDEN</p>
                        <p>BOLSA DE INVERSIONES</p>
                        <p>BOLSA DE PRESUPUESTOS</p>
                        <p>CERRAR SESIÓN</p>
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
    )
}