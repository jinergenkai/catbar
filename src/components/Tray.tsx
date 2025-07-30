import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { moveWindow, Position } from '@tauri-apps/plugin-positioner';

function onTrayMenuClick(itemId: string) {
  if (itemId === "settings") {
    moveWindow(Position.TrayCenter);
    window.__TAURI__.window.getCurrent().show();
  }
}

const menu = await Menu.new({
  items: [
    {
      id: "settings",
      text: "Cài đặt",
      action: onTrayMenuClick,
    },
    {
      id: "quit",
      text: "Thoát",
      action: onTrayMenuClick,
    },
  ],
});

const options = {
  menu,
  menuOnLeftClick: true,
};

const tray = await TrayIcon.new(options);

