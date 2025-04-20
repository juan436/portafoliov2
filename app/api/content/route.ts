import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/conection';
import Content from '@/models/content.model';

// GET: Obtener todo el contenido
export async function GET() {
  await dbConnect();
  
  try {
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      return NextResponse.json({ 
        success: false, 
        message: 'No se encontró contenido' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: content 
    });
  } catch (error) {
    console.error('Error obteniendo contenido:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor' 
    }, { status: 500 });
  }
}

// POST: Crear contenido
export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    const content = new Content(body);
    await content.save();
    
    return NextResponse.json({ 
      success: true, 
      data: content 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creando contenido:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor' 
    }, { status: 500 });
  }
}

// PATCH: Actualizar contenido parcialmente
export async function PATCH(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // Buscar contenido existente
    const existingContent = await Content.findOne();
    
    if (!existingContent) {
      // Si no existe, crear nuevo
      const newContent = new Content(body);
      await newContent.save();
      
      return NextResponse.json({ 
        success: true, 
        data: newContent 
      }, { status: 201 });
    }
    
    // Actualizar solo los campos proporcionados
    Object.keys(body).forEach(key => {
      (existingContent as any)[key] = body[key];
    });
    
    await existingContent.save();
    
    return NextResponse.json({ 
      success: true, 
      data: existingContent 
    });
  } catch (error) {
    console.error('Error actualizando contenido:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor',
      error: (error as Error).message
    }, { status: 500 });
  }
}
