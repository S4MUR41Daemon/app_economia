'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/Principal');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.fondo}>
        <main className={styles.contenido}>
          <h2>Cargando sesión...</h2>
        </main>
        <div className={styles.imagenDecorativa}></div>
      </div>
    );
  }

  return (
    <div className={styles.fondo}>
      <main className={styles.contenido}>
        <h1>Bienvenido</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="google">Accede con Google:</label>
          <button
            type="button"
            onClick={() => signIn('google')}
            className={styles.botonGoogle}
          >
            Iniciar sesión con Google
          </button>
        </form>

        <p className={styles.pregunta}>
          ¿Has olvidado tu contraseña?
        </p>
      </main>

      <div className={styles.imagenDecorativa}></div>
    </div>
  );
}
