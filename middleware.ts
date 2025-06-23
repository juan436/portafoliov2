import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si es ruta protegida
  const path = request.nextUrl.pathname
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login'
  const isLoginPath = path === '/admin/login'

  // Verificar autenticación en cookies
  const authToken = request.cookies.get('authToken')?.value
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  
  // Lógica de redirección
  if (isAdminPath && (!authToken || !isLoggedIn)) {
    // Si intenta acceder a una ruta protegida sin autenticación, redirigir al login
    const url = new URL('/admin/login', request.url)
    return NextResponse.redirect(url)
  }

  // Si ya está autenticado e intenta acceder al login, redirigirlo al dashboard
  if (isLoginPath && authToken && isLoggedIn) {
    const url = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  // Continuar con la solicitud normal
  return NextResponse.next()
}

// Aplicar solo a rutas admin
export const config = {
  matcher: ['/admin/:path*']
}
