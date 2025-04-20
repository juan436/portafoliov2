import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/conection';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function PATCH(request: Request) {
  await dbConnect();
  
  try {
    // Buscar el usuario admin (asumimos que solo hay uno)
    const admin = await User.findOne();
    
    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        message: 'No existe un usuario administrador' 
      }, { status: 404 });
    }
    
    const { username, currentPassword, newPassword } = await request.json();
    
    // Si se proporcionó la contraseña actual, verificarla
    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      
      if (!isPasswordValid) {
        return NextResponse.json({ 
          success: false, 
          message: 'Contraseña actual incorrecta' 
        }, { status: 401 });
      }
    }
    
    // Actualizar username si se proporciona
    if (username) {
      admin.username = username;
    }
    
    // Actualizar contraseña si se proporciona una nueva
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }
    
    await admin.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuario administrador actualizado correctamente',
      data: { username: admin.username }
    });
  } catch (error) {
    console.error('Error actualizando usuario administrador:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor',
      error: (error as Error).message
    }, { status: 500 });
  }
}