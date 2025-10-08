import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import Aura from "@primeuix/themes/aura";
import { providePrimeNG } from "primeng/config";
import { authInterceptor } from "./interceptors/auth.interceptor";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          inputStyle: "outlined",
          darkMode: true,
          darkModeSelector: "app-dark",
        },
      },
    }),
  ],
};
