import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  {
    path: "chat/:roomId",
    renderMode: RenderMode.Client,
  },
  {
    path: "chat/user/:userId",
    renderMode: RenderMode.Client,
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
