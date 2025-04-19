import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // cambia si usas otro usuario
    password: 'password', // pon aquí tu contraseña de MySQL
    database: 'sistema_gestion',
  });

  const [rows] = await connection.execute('SELECT id_departamento, tipo FROM Departamento');
  await connection.end();

  return NextResponse.json(rows);
}
