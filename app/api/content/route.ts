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

// PATCH: Actualizar contenido parcialmente de forma dinámica
export async function PATCH(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // Buscar contenido existente (siempre trabajamos con un solo registro)
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
    
    // Función recursiva para actualizar campos anidados
    const updateNestedFields = (source: any, target: any) => {
      Object.keys(source).forEach(key => {
        // Si es un objeto y no un array, actualiza recursivamente
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          updateNestedFields(source[key], target[key]);
        } else {
          // Actualiza el valor
          target[key] = source[key];
        }
      });
    };
    
    // Actualizar campos de manera dinámica
    updateNestedFields(body, existingContent);
    
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
