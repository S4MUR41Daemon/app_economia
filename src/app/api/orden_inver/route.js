import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idDepartamento = searchParams.get('departamento');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(
      `
      SELECT i.cantidad
      FROM Inversion i
      INNER JOIN Bolsa b ON i.id_Bolsa_Inversion = b.id
      WHERE b.id_Departamento = ?
        AND YEAR(b.año) = 2025
      `,
      [idDepartamento]
    );

    await connection.end();

    return NextResponse.json({
      saldoInventariable: rows.length > 0 ? rows[0].cantidad : 0,
    });
  } catch (error) {
    console.error('Error al obtener saldo inventariable:', error);
    await connection.end();
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }
}
