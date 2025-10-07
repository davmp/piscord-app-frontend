import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, shareReplay, tap } from "rxjs";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../models/auth.models";
import type { User } from "../../models/user.models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly authApiUrl = "http://localhost:8000/api";
  private readonly platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  profile(): Observable<any> {
    return this.http.get(`${this.authApiUrl}/profile`);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/login`, data)
      .pipe(
        tap((res) => this.setSession(res)),
        shareReplay()
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/register`, data)
      .pipe(
        tap((res) => this.setSession(res)),
        shareReplay()
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token");
    }
    return null;
  }

  getUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private setSession(authResult: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("token", authResult.token);
      localStorage.setItem("user", JSON.stringify(authResult.user));
    }
  }
}
