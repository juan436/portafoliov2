/**
 * Utilidades de autenticación para manejar login y logout
 */

/**
 * Cierra la sesión del usuario eliminando las cookies mediante el endpoint de logout
 * @returns Promise<boolean> - true si se cerró la sesión correctamente, false en caso contrario
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
}

/**
 * Verifica si el usuario está autenticado comprobando las cookies
 * @returns boolean - true si el usuario está autenticado, false en caso contrario
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;
  
  // Verificar si existe la cookie isLoggedIn
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('isLoggedIn=true'));
}

/**
 * Obtiene el nombre de usuario desde las cookies
 * @returns string | null - nombre de usuario o null si no existe
 */
export function getUsername(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const adminUserCookie = cookies.find(cookie => cookie.trim().startsWith('adminUser='));
  
  if (adminUserCookie) {
    return adminUserCookie.trim().substring('adminUser='.length);
  }
  
  return null;
}

/**
 * Redirige al usuario a la página de login
 */
export function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}

/**
 * Redirige al usuario al dashboard
 */
export function redirectToDashboard(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/dashboard';
  }
}
