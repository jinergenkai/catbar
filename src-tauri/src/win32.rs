#[tauri::command]
pub fn get_taskbar_height() -> Option<i32> {
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::UI::WindowsAndMessaging::{SystemParametersInfoW, SPI_GETWORKAREA};
        use windows_sys::Win32::Foundation::RECT;
        use windows_sys::Win32::Graphics::Gdi::{GetDeviceCaps, GetDC, ReleaseDC, VERTRES};

        unsafe {
            // Get device context for the entire screen
            let hdc = GetDC(std::ptr::null_mut());
            if hdc.is_null() {
                return None;
            }

            // Get screen height
            let screen_height = GetDeviceCaps(hdc, VERTRES.try_into().unwrap());
            
            // Release DC when done
            ReleaseDC(std::ptr::null_mut(), hdc);

            // Get work area (screen minus taskbar)
            let mut rect = RECT { 
                left: 0, 
                top: 0, 
                right: 0, 
                bottom: 0 
            };

            let result = SystemParametersInfoW(
                SPI_GETWORKAREA,
                0,
                &mut rect as *mut RECT as *mut std::ffi::c_void,
                0,
            );

            if result != 0 {
                let work_height = rect.bottom - rect.top;
                let taskbar_height = screen_height - work_height;
                Some(taskbar_height)
            } else {
                None
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        // macOS implementation using Cocoa
        use objc2::rc::Id;
        use objc2_app_kit::{NSScreen, NSApplication};
        use objc2_foundation::NSArray;

        unsafe {
            let app = NSApplication::sharedApplication();
            if app.is_null() {
                return None;
            }

            let screens = NSScreen::screens();
            if let Some(main_screen) = screens.first() {
                let frame = main_screen.frame();
                let visible_frame = main_screen.visibleFrame();
                
                // Taskbar height is the difference
                let taskbar_height = (frame.size.height - visible_frame.size.height) as i32;
                Some(taskbar_height)
            } else {
                None
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        // Linux implementation - this is tricky as there are many DEs
        // For now, return a common default or try to detect
        use std::process::Command;

        // Try to get panel height from various desktop environments
        if let Ok(output) = Command::new("gsettings")
            .args(&["get", "org.gnome.shell", "panel-height"])
            .output()
        {
            if let Ok(height_str) = String::from_utf8(output.stdout) {
                if let Ok(height) = height_str.trim().parse::<i32>() {
                    return Some(height);
                }
            }
        }

        // Fallback to common taskbar heights
        Some(24) // Common default for most Linux DEs
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        None
    }
}

// Helper function để position window above taskbar
#[tauri::command]
pub fn get_bottom_position(window_height: f64) -> (f64, f64) {
    let taskbar_height = get_taskbar_height().unwrap_or(40) as f64;
    
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::Graphics::Gdi::{GetDeviceCaps, GetDC, ReleaseDC, HORZRES, VERTRES};
        
        unsafe {
            let hdc = GetDC(std::ptr::null_mut());
            if !hdc.is_null() {
                let screen_width = GetDeviceCaps(hdc, HORZRES.try_into().unwrap()) as f64;
                let screen_height = GetDeviceCaps(hdc, VERTRES.try_into().unwrap()) as f64;
                ReleaseDC(std::ptr::null_mut(), hdc);
                
                let x = 0.0; // Left edge
                let y = screen_height - window_height - taskbar_height;
                return (x, y);
            }
        }
    }

    // Fallback for other platforms
    (0.0, 1080.0 - window_height - taskbar_height)
}