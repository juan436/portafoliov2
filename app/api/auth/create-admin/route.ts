import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/conection';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    // Verificar si ya existe un admin
    const adminExists = await User.findOne();
    
    if (adminExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ya existe un usuario administrador' 
      }, { status: 400 });
    }
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requiere nombre de usuario y contraseña' 
      }, { status: 400 });
    }
    
    // Crear el hash de la contraseña manualmente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear el usuario administrador
    const user = new User({ 
      username, 
      password: hashedPassword 
    });
    
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuario administrador creado correctamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creando usuario administrador:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor',
      error: (error as Error).message
    }, { status: 500 });
  }
}