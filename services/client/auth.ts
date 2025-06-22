import { API_URL } from '../api/index';

export async function authenticateUser(username: string, password: string) {
  try {
    // Determinar la URL base para las llamadas API
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_API_URL || 'https://jvillegas-portafolio.jvserver.com';
    
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message
      };
    } else {
      return {
        success: false,
        message: data.message || 'Error de autenticación'
      };
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return { 
      success: false, 
      message: 'Error interno del servidor' 
    };
  }
}
