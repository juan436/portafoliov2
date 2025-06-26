import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/conection';
import Content from '@/models/content.model';
import mongoose from 'mongoose';

// DELETE: Eliminar un servicio específico por su ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`[API/DELETE] Iniciando eliminación de servicio`);
  await dbConnect();
  
  try {
    const id = params.id;
    console.log(`[API/DELETE] ID recibido: ${id}`);
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`[API/DELETE] ID inválido: ${id}`);
      return NextResponse.json({ 
        success: false, 
        message: 'ID de servicio inválido' 
      }, { status: 400 });
    }
    
    // Buscar el documento de contenido
    console.log(`[API/DELETE] Buscando documento de contenido`);
    const content = await Content.findOne();
    
    if (!content) {
      console.error(`[API/DELETE] No se encontró documento de contenido`);
      return NextResponse.json({ 
        success: false, 
        message: 'No se encontró contenido' 
      }, { status: 404 });
    }
    
    console.log(`[API/DELETE] Documento de contenido encontrado`);
    console.log(`[API/DELETE] Número de servicios antes: ${content.services.length}`);
    
    // Verificar si el servicio existe
    const serviceIndex = content.services.findIndex(
      (service: any) => service._id.toString() === id
    );
    
    console.log(`[API/DELETE] Índice del servicio encontrado: ${serviceIndex}`);
    
    if (serviceIndex === -1) {
      console.error(`[API/DELETE] Servicio no encontrado con ID: ${id}`);
      return NextResponse.json({ 
        success: false, 
        message: 'Servicio no encontrado' 
      }, { status: 404 });
    }
    
    // Mostrar información del servicio a eliminar
    console.log(`[API/DELETE] Servicio a eliminar:`, content.services[serviceIndex]);
    
    // Eliminar el servicio del array
    content.services.splice(serviceIndex, 1);
    console.log(`[API/DELETE] Número de servicios después: ${content.services.length}`);
    
    // Guardar los cambios
    console.log(`[API/DELETE] Guardando cambios en la base de datos`);
    await content.save();
    console.log(`[API/DELETE] Cambios guardados correctamente`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Servicio eliminado correctamente' 
    });
  } catch (error) {
    console.error('[API/DELETE] Error eliminando servicio:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error del servidor' 
    }, { status: 500 });
  }
}
