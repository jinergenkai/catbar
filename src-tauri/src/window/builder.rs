use tauri::{WebviewWindowBuilder, Manager, LogicalPosition};
use tauri_plugin_positioner::{Position, WindowExt};

use crate::{get_taskbar_height, platform::windows::overlay};
// use crate::platform::windows::win32::get_taskbar_height;

/// Creates and configures the main application window
pub fn create_main_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    WebviewWindowBuilder::new(
        app,
        "catbar",
        tauri::WebviewUrl::App("index.html#/main".into()),
    )
    .title("Cat Bar")
    .decorations(false)
    .shadow(false)
    .transparent(true)
    .always_on_top(true)
    .minimizable(false)
    .resizable(true)
    .skip_taskbar(false)
    .inner_size(600.0, get_taskbar_height().unwrap_or(40) as f64 + 100.0)
    .position(0.0, 1080.0 - 120.0)
    .visible(true)
    .build()?;

    if let Some(window) = app.get_webview_window("catbar") {
        #[cfg(target_os = "windows")]
        {
            if let Ok(hwnd) = window.hwnd() {
                println!("Setting topmost for window: {:?}", hwnd);
                overlay::setup_smart_overlay(hwnd.0 as *mut _)?;
            }
        }
    }

    Ok(())
}

/// Creates and configures the settings window
pub fn create_settings_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    WebviewWindowBuilder::new(
        app, 
        "settings",
        tauri::WebviewUrl::App("index.html#/settings".into()),
    )
    .title("settings")
    .build()?;

    Ok(())
}

/// Positions the main window at the bottom left of the screen
pub fn position_main_window(window: &tauri::WebviewWindow) {
    let _ = window.move_window(Position::BottomLeft);
}