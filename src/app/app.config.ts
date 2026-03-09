import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';

/**
 * Application configuration — sets up all global Angular providers.
 * HttpClient is provided for future REST API integration with JSON Server.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // HttpClient provider for REST API / JSON Server integration
    provideHttpClient(withInterceptors([apiInterceptor]))
  ]
};
