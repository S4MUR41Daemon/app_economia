import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // CAMBIAR id_departamento por id
  const [rows] = await connection.execute('SELECT id, tipo FROM Departamento');

  await connection.end();

  return NextResponse.json(rows);
}
