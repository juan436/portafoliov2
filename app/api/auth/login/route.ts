import { NextResponse } from 'next/server';
import { authenticateUser } from '@/services/user.service';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validar datos de entrada
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Autenticar usuario
    const result = await authenticateUser(username, password);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }

    // Devolver respuesta exitosa con token
    return NextResponse.json({
      message: 'Autenticación exitosa',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
