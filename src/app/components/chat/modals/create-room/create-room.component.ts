import { Component, inject, input, output } from "@angular/core";
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
import { RoomService } from "../../../../services/room/room.service";
import * as themes from "../../../../themes/form.themes";

@Component({
  selector: "app-create-room",
  imports: [
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-room.component.html",
})
export class CreateRoomComponent {
  private roomService = inject(RoomService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form: FormGroup;

  visible = input<boolean>();
  setVisible = output<boolean>();
  loading = false;

  buttonThemes = themes.buttonThemes;
  inputThemes = themes.inputThemes;
  dialogThemes = themes.dialogThemes;

  constructor() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      info: [""],
      type: ["public", Validators.required],
      picture: [null],
      maxMembers: [0, [Validators.min(0), Validators.max(200)]],
      participantIDs: [[]],
    });
  }

  createRoom() {
    const val = this.form.value;

    if (val.name && val.type) {
      this.loading = true;

      const createRoomRequest = {
        name: val.name,
        info: val.info,
        type: val.type,
        picture: val.picture,
        maxMembers: val.maxMembers > 0 ? val.maxMembers : undefined,
        participantIDs: val.participantIDs,
      };
      this.roomService.createRoom(createRoomRequest).subscribe((room) => {
        this.router.navigateByUrl(`/rooms/${room.id}`);
        this.handleSetVisible(false);
        this.form.reset();
      });

      this.loading = false;
    }
  }

  handleSetVisible(visible: boolean) {
    console.log("Setting modal visible:", visible);
    this.setVisible.emit(visible);
  }
}
