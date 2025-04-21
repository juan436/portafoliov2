import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/conection';
import OtherSkill from '@/models/otherSkills.model';

// PATCH: Actualizar una otra habilidad
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const skill = await OtherSkill.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!skill) {
      return NextResponse.json({ success: false, message: 'Habilidad no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Error actualizando otra habilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar una otra habilidad
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  
  try {
    const skill = await OtherSkill.findByIdAndDelete(params.id);
    
    if (!skill) {
      return NextResponse.json({ success: false, message: 'Habilidad no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Habilidad eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando otra habilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}