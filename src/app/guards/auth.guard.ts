import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * authGuard — functional route guard that restricts access to the
 * Leave Approval module to HR users only.
 *
 * If the user is not in HR mode, they are redirected to the dashboard
 * with an `accessDenied=true` query param so the dashboard can display
 * an appropriate notification.
 *
 * Applied in app.routes.ts:
 *   { path: 'leave-approval', canActivate: [authGuard], ... }
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isHR()) {
        return true; // HR user — allow access
    }

    // Redirect non-HR users to dashboard with notification flag
    return router.createUrlTree(['/'], {
        queryParams: { accessDenied: true }
    });
};
