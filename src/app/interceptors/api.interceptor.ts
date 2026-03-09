import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Global HTTP Interceptor
 * - Logs outgoing requests for debugging purposes.
 * - Catches and logs HTTP errors globally, then re-throws.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[API Interceptor] HTTP ${req.method} to ${req.url}`);

  return next(req).pipe(
    tap(event => {
       // Allow responses to pass through
    }),
    catchError(error => {
      console.error('[API Interceptor] HTTP Error:', error);
      // Optional: Add a user-facing toaster or snackbar notification here
      return throwError(() => error);
    })
  );
};
