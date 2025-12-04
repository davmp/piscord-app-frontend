import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Injector } from "@angular/core";
import { BehaviorSubject, Observable, shareReplay, tap } from "rxjs";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../../models/auth.models";
import type {
  Profile,
  UpdateProfileRequest,
  User,
} from "../../../models/user.models";
import { WebsocketService } from "../../chat/ws.service";
import { DeviceService } from "../../device.service";
import { RoomService } from "../../room/room.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly authApiUrl = "/api";
  private readonly profileApiUrl = "/api/profile";
  private deviceService = inject(DeviceService);
  private http = inject(HttpClient);
  private injector = inject(Injector);

  auth = new BehaviorSubject<User | null>(this.getStoredProfile());

  private get wsService(): WebsocketService {
    return this.injector.get(WebsocketService);
  }

  private get roomService(): RoomService {
    return this.injector.get(RoomService);
  }

  getProfile() {
    return this.http.get<Profile>(this.profileApiUrl).pipe(
      tap((profile) => {
        const user: User = {
          id: profile.id,
          username: profile.username,
          picture: profile.picture,
        };
        this.auth.next(user);
        this.setAuth(user);
      })
    );
  }

  updateProfile(data: Partial<UpdateProfileRequest>) {
    return this.http.put<User>(this.profileApiUrl, data).pipe(
      tap((profile) => {
        this.auth.next(profile);
        this.setAuth(profile);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/login`, data)
      .pipe(
        tap((res) => {
          this.auth.next(res.user);
          this.setSession(res);
        }),
        shareReplay()
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/register`, data)
      .pipe(
        tap((res) => {
          this.auth.next(res.user);
          this.setSession(res);
        }),
        shareReplay()
      );
  }

  logout(): void {
    if (this.deviceService.isBrowser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    this.wsService.close();
    this.roomService.selectedRoom.next(null);
    this.auth.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (this.deviceService.isBrowser) {
      return localStorage.getItem("token");
    }
    return null;
  }

  private getStoredProfile(): Profile | null {
    if (this.deviceService.isBrowser) {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private setAuth(user: User) {
    if (this.deviceService.isBrowser) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private setSession(authResult: AuthResponse): void {
    if (this.deviceService.isBrowser) {
      localStorage.setItem("token", authResult.token);
      localStorage.setItem("user", JSON.stringify(authResult.user));
    }
  }
}
