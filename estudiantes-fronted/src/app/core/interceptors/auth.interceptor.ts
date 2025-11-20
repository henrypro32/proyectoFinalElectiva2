import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // localStorage is not available during server-side rendering (SSR).
    // Guard access to avoid "localStorage is not defined" errors when the
    // dev server performs server-side rendering paths (or when running SSR).
    let token: string | null = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = window.localStorage.getItem('access_token');
      }
    } catch (e) {
      token = null;
    }
    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(cloned);
  }
}
