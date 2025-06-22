import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/conection'
import User from '@/models/user.model'
import jwt from 'jsonwebtoken'

// POST - Autenticar usuario y devolver JWT
export async function POST(request: Request) {
  // 1. Conectar a MongoDB
  await dbConnect()

  try {
    const { username, password } = await request.json()

    // 2. Validar payload
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // 3. Buscar usuario en la colección
    const user = await User.findOne({ username })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no existe' },
        { status: 401 }
      )
    }

    // 4. Comparar contraseña (el método comparePassword ya está en el schema)
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // 5. Firmar JWT con tu SECRET_KEY
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.SECRET_KEY!,
      { expiresIn: '2h' }
    )

    // 6. Responder con éxito
    return NextResponse.json(
      {
        success: true,
        message: 'Autenticación exitosa',
        token,
        user: { id: user._id, username: user.username }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en la autenticación:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}