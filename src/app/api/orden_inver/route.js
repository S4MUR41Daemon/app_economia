import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(
      `SELECT cantidad_inv 
       FROM Bolsa
       WHERE id_Departamento = ?`,
      [1] // Aquí depende del departamento (de momento puedes poner el 1 como prueba)
    );

    await connection.end();

    if (rows.length > 0) {
      return NextResponse.json({ saldoInventariable: rows[0].cantidad_inv });
    } else {
      return NextResponse.json({ saldoInventariable: 0 });
    }
  } catch (error) {
    console.error('Error al obtener saldo inventariable:', error);
    await connection.end();
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }
}
