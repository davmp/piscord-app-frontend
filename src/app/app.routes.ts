import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/chat/layout/layout.component";
import { AuthGuardService } from "./services/auth/auth-guard.service";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/chat/chat.component").then((m) => m.ChatComponent),
      },
      {
        path: "chat/:roomId",
        loadComponent: () =>
          import("./pages/chat/chat.component").then((m) => m.ChatComponent),
      },
    ],
    canActivate: [AuthGuardService],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  { path: "**", redirectTo: "" },
];
