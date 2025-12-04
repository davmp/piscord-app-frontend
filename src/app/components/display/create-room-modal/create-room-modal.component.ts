import { Component, inject, input, output, signal } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import type { CreateRoomRequest } from "../../../models/rooms.models";
import { ChatService } from "../../../services/chat/chat.service";
import * as themes from "../../../themes/form.themes";

import { catchError, EMPTY, finalize } from "rxjs";
import { RoomService } from "../../../services/room/room.service";

@Component({
  selector: "app-create-room-modal",
  imports: [
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-room-modal.component.html",
})
export class CreateRoomModalComponent {
  private chatService = inject(ChatService);
  private roomService = inject(RoomService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form: FormGroup;

  visible = input<boolean>();
  setVisible = output<boolean>();
  isLoading = signal(false);

  readonly buttonThemes = themes.buttonThemes;
  readonly inputThemes = themes.inputThemes;
  readonly dialogThemes = themes.dialogThemes;

  constructor() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      info: [""],
      public: [true, Validators.required],
      picture: [null],
      maxMembers: [20, [Validators.min(0), Validators.max(200)]],
      members: [[]],
      admins: [[]],
    });
  }

  createRoom() {
    if (this.form.invalid || this.isLoading()) {
      return;
    }

    const val = this.form.value;

    if (val.name) {
      this.isLoading.set(true);

      const members = val.members.filter((member: string) => member !== "");
      const admins = val.admins.filter((admin: string) => admin !== "");

      if (members.length >= val.maxMembers) {
        this.isLoading.set(false);
        this.form.get("maxMembers")?.setErrors({
          maxMembers: true,
        });
        return;
      }

      const createRoomRequest: CreateRoomRequest = {
        name: val.name,
        description: val.info,
        type: val.public ? "public" : "private",
        picture: val.picture,
        maxMembers: val.maxMembers > 0 ? val.maxMembers : undefined,
        members: members,
        admins: admins,
      };

      this.chatService
        .createRoom(createRoomRequest)
        .pipe(
          finalize(() => this.isLoading.set(false)),
          catchError((err) => {
            console.error("Error creating room: ", err);
            return EMPTY;
          })
        )
        .subscribe((room) => {
          this.roomService.roomCreated.next(room);
          this.roomService.selectedRoom.next(room);
          this.router.navigateByUrl(`/rooms/${room.id}`);
          this.handleSetVisible(false);
          this.form.reset();
        });
    }
  }

  handleSetVisible(visible: boolean) {
    this.setVisible.emit(visible);
  }
}
