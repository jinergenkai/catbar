mod builder;

use tauri::{Manager};

pub use builder::*;

/// Window management module
/// Provides functionality for creating and managing application windows
pub struct WindowManager;

impl WindowManager {
    /// Creates all application windows
    pub fn setup(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
        // Create main window
        create_main_window(app)?;
        
        // Create settings window 
        create_settings_window(app)?;

        // Position main window
        if let Some(window) = app.get_webview_window("catbar") {
            position_main_window(&window);
        }

        Ok(())
    }

    /// Shows the main window and positions it correctly
    pub fn show_main_window(app: &tauri::AppHandle) {
        if let Some(window) = app.get_webview_window("catbar") {
            position_main_window(&window);
            let _ = window.show();
        }
    }
}