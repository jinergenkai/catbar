import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';

const menu = await Menu.new({
  items: [
       {
            id: "settings",
            text: "Cài đặt",
          },
          {
            id: "quit",
            text: "Thoát",
          },
  ],
});

const options = {
  menu,
  menuOnLeftClick: true,
};

const tray = await TrayIcon.new(options);