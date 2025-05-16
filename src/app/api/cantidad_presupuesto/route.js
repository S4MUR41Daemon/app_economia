import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idDepartamento = parseInt(searchParams.get('id'));

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(
      `
      SELECT SUM(p.cantidad) AS cantidad
      FROM Presupuesto p
      INNER JOIN Bolsa b ON p.id_Bolsa_Presupuesto = b.id
      WHERE b.id_Departamento = ?
        AND YEAR(b.año) = YEAR(CURDATE())
      `,
      [idDepartamento]
    );

    await connection.end();

    return NextResponse.json({
      cantidad: rows[0]?.cantidad || 0,
    });
  } catch (error) {
    console.error('Error al obtener saldo presupuesto:', error);
    await connection.end();
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }
}
