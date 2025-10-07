import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, shareReplay, tap } from "rxjs";
import type {
  CreateRoomRequest,
  GetRooms,
  Room,
} from "../../models/rooms.models";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private readonly roomsApiUrl = "http://127.0.0.1:8000/api/rooms";
  private http = inject(HttpClient);
  selectedRoom = signal<Room | null>(null);

  selectRoom(room: Room | null) {
    this.selectedRoom.set(room);
  }

  getRooms(): Observable<GetRooms> {
    return this.http.get<GetRooms>(this.roomsApiUrl).pipe(
      shareReplay(),
      catchError((error) => {
        console.error("Error fetching rooms:", error);
        return [];
      })
    );
  }

  getRoom(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.roomsApiUrl}/${id}`).pipe(
      shareReplay(),
      catchError((error) => {
        console.error(`Error fetching room with id ${id}:`, error);
        throw error;
      })
    );
  }

  createRoom(data: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(this.roomsApiUrl, data).pipe(
      catchError((error) => {
        console.error("Error creating room:", error);
        throw error;
      })
    );
  }
}
