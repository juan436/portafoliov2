import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/conection'
import User from '@/models/user.model'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  console.log('⏳ [auth] Login attempt')
  console.log('⏳ [auth] SECRET_KEY:', process.env.SECRET_KEY)
  console.log('⏳ [auth] Request headers:', Object.fromEntries(request.headers))

  // 1) Conectar a Mongo
  await dbConnect()
  console.log('✅ [auth] MongoDB conectada')

  try {
    // 2) Leer payload con manejo de errores mejorado
    let username, password;
    
    try {
      // Verificar si hay cuerpo en la solicitud
      const text = await request.text();
      console.log('⏳ [auth] Request body raw:', text);
      
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'Cuerpo de solicitud vacío' },
          { status: 400 }
        );
      }
      
      // Intentar parsear como JSON
      const body = JSON.parse(text);
      username = body.username;
      password = body.password;
    } catch (parseError) {
      console.error('❌ [auth] Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Formato de solicitud inválido' },
        { status: 400 }
      );
    }
    
    console.log('⬇️ [auth] Payload:', { username, password })

    // 3) Validar
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // 4) Buscar usuario
    const user = await User.findOne({ username })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no existe' },
        { status: 401 }
      )
    }

    // 5) Comparar contraseña
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // 6) Firmar JWT
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.SECRET_KEY!,
      { expiresIn: '2h' }
    )
    console.log('✅ [auth] JWT generado')

    // 7) Responder
    return NextResponse.json(
      {
        success: true,
        message: 'Autenticación exitosa',
        token,
        user: { id: user._id, username: user.username }
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('❌ [auth] Error en autenticación:', err)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}