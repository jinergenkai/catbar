#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let webview_url = tauri::WebviewUrl::App("index.html".into());
            // First window
            tauri::WebviewWindowBuilder::new(app, "first", webview_url.clone())
                .title("Cat Bar")
                .decorations(false)
                .always_on_top(true)
                .minimizable(true)
                .resizable(true)
                .skip_taskbar(false)
                .inner_size(800.0, 600.0)
                .position(0.0, 1080.0-120.0)
                .build()?;
            // Second window
            tauri::WebviewWindowBuilder::new(app, "second", webview_url)
                .title("Second")
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
