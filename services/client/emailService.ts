/**
 * Servicio para manejar la comunicación con el servidor de correo
 */

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  language?: string;
}

interface EmailResponse {
  status: 'success' | 'error';
  message: string;
  errors?: string[];
}

// Valores por defecto para desarrollo y producción
const API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY || '';
const EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_API_URL || 'https://mail-api.jvserver.com';

/**
 * Envía los datos del formulario de contacto al servidor de correo
 * @param formData Datos del formulario de contacto
 * @returns Respuesta del servidor
 */
export const sendContactForm = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    console.log('Enviando formulario a:', `${EMAIL_API_URL}/send`);
    
    const response = await fetch(`${EMAIL_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        clientName: formData.name,
        clientEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
        language: formData.language || 'es'
      }),
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    // Si la respuesta no es JSON, manejar como texto
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Respuesta no JSON:', text);
      data = { message: text };
    }
    
    if (!response.ok) {
      console.error(`Error al enviar el formulario: ${response.status} ${response.statusText}`, data);
      return {
        status: 'error',
        message: data.message || `Error ${response.status}: ${response.statusText}`,
        errors: data.errors || []
      };
    }
    
    return {
      status: 'success',
      message: data.message || 'Mensaje enviado correctamente'
    };
  } catch (error) {
    console.error('Error de conexión al servicio de correo:', error);
    // Mostrar más detalles sobre el error para depuración
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message);
    }
    return {
      status: 'error',
      message: 'Error de conexión al servicio de correo. Por favor, inténtalo de nuevo más tarde.'
    };
  }
};

/**
 * Verifica si el servicio de correo está funcionando
 * @returns Estado del servicio
 */
export const checkEmailServiceStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${EMAIL_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    
    // Manejar respuesta no JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.status === 'OK';
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error al verificar el estado del servicio de correo:', error);
    return false;
  }
};
