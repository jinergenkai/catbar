mod win32;

use tauri::{window, LogicalPosition};
// Thêm các import cần thiết cho command
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WebviewWindowBuilder,
};
use tauri_plugin_positioner::{Position, WindowExt};
use win32::{get_bottom_position, get_taskbar_height};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .invoke_handler(tauri::generate_handler![
            win32::get_taskbar_height,
            win32::get_bottom_position
        ])
        .setup(|app| {
            // First window mở route /main
            WebviewWindowBuilder::new(
                app,
                "first",
                tauri::WebviewUrl::App("index.html#/main".into()),
            )
            .title("Cat Bar")
            .decorations(false)
            .shadow(false)
            .transparent(true) // nếu bạn muốn nền trong suốt
            .always_on_top(true)
            .minimizable(true)
            .resizable(true)
            .skip_taskbar(false)
            .inner_size(800.0, get_taskbar_height().unwrap_or(40) as f64)
            .position(0.0, 1080.0 - 120.0)
            .visible(true)
            .build()?;
            // Second window mở route /settings
            WebviewWindowBuilder::new(
                app,
                "second",
                tauri::WebviewUrl::App("index.html#/settings".into()),
            )
            .title("Second")
            .build()?;

            if let Some(window) = app.get_webview_window("first") {
                let _ = window.move_window(Position::BottomLeft);
            }
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;

            TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(true)
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| match event {
                    tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } => {
                        println!("left click pressed and released");
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("first") {
                            let _ = window.move_window(Position::BottomLeft);
                            let _ = window.show();
                            // window.set_position(LogicalPosition::new(0.0, 960.0));
                            // let _ = window.set_focus();
                        }
                    }
                    _ => {
                        println!("unhandled event {event:?}");
                    }
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
