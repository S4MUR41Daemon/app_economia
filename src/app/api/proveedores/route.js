import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const departamento = searchParams.get('departamento');

  if (!departamento) {
    return NextResponse.json({ error: 'ID de departamento requerido' }, { status: 400 });
  }

  const connection = await mysql.createConnection(dbConfig);

  const [proveedores] = await connection.execute(
    `
    SELECT p.cif AS id, p.nombre
    FROM Proveedor p
    INNER JOIN Suministrar s ON p.cif = s.cif_Proveedor
    WHERE s.id_Departamento = ?
    `,
    [departamento]
  );

  await connection.end();

  return NextResponse.json({ proveedores });
}

export async function POST(req) {
  try {
    const { nombre, departamento } = await req.json();

    if (!nombre || !departamento) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Generar un CIF ficticio temporal (en una app real, esto vendría de un input)
    const cif = generarCIF();

    const connection = await mysql.createConnection(dbConfig);

    // Insertar proveedor (si no existe ya)
    await connection.execute(
      `INSERT INTO Proveedor (cif, nombre) VALUES (?, ?)`,
      [cif, nombre]
    );

    // Relacionar con el departamento
    await connection.execute(
      `INSERT INTO Suministrar (id_Departamento, cif_Proveedor) VALUES (?, ?)`,
      [departamento, cif]
    );

    await connection.end();

    return NextResponse.json({ ok: true, cif });
  } catch (err) {
    console.error('Error en POST /api/proveedores:', err);
    return NextResponse.json({ error: 'Error al insertar proveedor' }, { status: 500 });
  }
}

// Función auxiliar para generar un CIF aleatorio
function generarCIF() {
  const letras = 'ABCDEFGHJKLMNPQRSUVW';
  const letra = letras[Math.floor(Math.random() * letras.length)];
  const numeros = Math.floor(10000000 + Math.random() * 90000000);
  return letra + numeros.toString();
}
