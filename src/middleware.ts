import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es-CL|es-PE|es-PY|es-UY|es-BO|es-AR)/:path*']
};
