use tauri::{Builder, Runtime};
use tauri_plugin_autostart::MacosLauncher;

/// Initialize and configure all application plugins
pub fn setup_plugins<R: Runtime>(builder: Builder<R>) -> Builder<R> {
    builder
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
}
