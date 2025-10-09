import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DeviceService {
  private readonly mobileWidthThreshold = 768;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  isMobile(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return true;
    //return window.innerWidth <= this.mobileWidthThreshold;
  }
}
