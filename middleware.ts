import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(' [middleware] Ejecutando middleware para:', request.nextUrl.pathname);

  // Verificar si es ruta protegida
  const path = request.nextUrl.pathname
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login'
  const isLoginPath = path === '/admin/login'

  // Verificar autenticación en cookies
  const authToken = request.cookies.get('authToken')?.value
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  
  // Registrar estado para debugging
  console.log(' [middleware] Estado de autenticación:', { 
    isAdminPath, 
    isLoginPath, 
    hasAuthToken: !!authToken,
    isLoggedIn 
  });
  
  // Lógica de redirección
  if (isAdminPath && (!authToken || !isLoggedIn)) {
    console.log(' [middleware] Redirigiendo a login por falta de autenticación');
    const url = new URL('/admin/login', request.url)
    return NextResponse.redirect(url)
  }

  // Si ya está autenticado e intenta acceder al login, redirigirlo al dashboard
  if (isLoginPath && authToken && isLoggedIn) {
    console.log(' [middleware] Redirigiendo a dashboard por ya estar autenticado');
    const url = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  console.log(' [middleware] Permitiendo acceso a:', path);
  return NextResponse.next()
}

// Aplicar solo a rutas admin
export const config = {
  matcher: ['/admin/:path*']
}
