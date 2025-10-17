import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Profile } from "../../models/user.models";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly profileApiUrl = "/api/profile";
  private http = inject(HttpClient);

  getProfileById(id: string) {
    return this.http.get<Profile>(`${this.profileApiUrl}/${id}`);
  }
}
