import { Component, inject, Output, EventEmitter, output } from "@angular/core";
import type { MenuItem } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from "primeng/menu";
import { AuthService } from "../../../../services/auth/auth.service";
import type { User } from "../../../../models/user.models";
import { menuThemes } from "../../../../themes/form.themes";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-info",
  imports: [AvatarModule, MenuModule],
  templateUrl: "./user-info.component.html",
  styles: ``,
})
export class UserInfoComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  user: Partial<User> = {};

  setCreateModalVisible = output<"createRoom">();

  get ghost() {
    return menuThemes.ghost;
  }

  actions: MenuItem[] = [
    {
      label: "Grupos",
      items: [
        {
          label: "Criar",
          icon: "pi pi-plus",
          command: () => this.handleCreateRoom(),
        },
        {
          label: "Pesquisar",
          icon: "pi pi-comments",
          command: () => console.log("Create Channel clicked"),
        },
      ],
    },
    {
      label: "Conta",
      items: [
        {
          label: "Configurações",
          icon: "pi pi-cog",
          command: () => console.log("User Settings clicked"),
        },
        {
          label: "Sair",
          icon: "pi pi-sign-out",
          command: () => this.handleLogout(),
          styleClass:
            "[&_.p-menu-item-content]:text-red-500! [&_.p-menu-item-icon]:text-red-500!",
        },
      ],
    },
  ];

  ngOnInit() {
    const user = this.authService.getUser();

    if (user) {
      this.user = user;
    } else {
      this.authService.logout();
    }
  }

  handleCreateRoom() {
    this.setCreateModalVisible.emit("createRoom");
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
