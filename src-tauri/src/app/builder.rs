use crate::{
    app::{plugins::setup_plugins, tray::setup_tray},
    platform::windows::{taskbar::*, win32::*},
    window::WindowManager,
};

/// Creates and configures the main application
pub fn build_app() {
    let mut builder = tauri::Builder::default();
    
    // Setup plugins
    builder = setup_plugins(builder);
    
    // Configure builder
    builder
        // Register commands
        .invoke_handler(tauri::generate_handler![
            get_taskbar_height,
            get_bottom_position,
            set_window_topmost,
            remove_window_topmost
        ])
        // Setup application
        .setup(|app| {
            // Create windows
            WindowManager::setup(app)?;
            
            // Setup system tray
            setup_tray(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}