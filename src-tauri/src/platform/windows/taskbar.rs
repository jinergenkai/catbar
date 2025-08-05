use windows_sys::Win32::{
    Foundation::RECT,
    Graphics::Gdi::{GetDC, GetDeviceCaps, ReleaseDC, VERTRES},
    UI::WindowsAndMessaging::{SystemParametersInfoW, SPI_GETWORKAREA},
};

/// Gets the height of the Windows taskbar
#[tauri::command]
pub fn get_taskbar_height() -> Option<i32> {
    #[cfg(target_os = "windows")]
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
            bottom: 0,
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

    #[cfg(not(target_os = "windows"))]
    None
}

/// Gets the position for a window to be placed above the taskbar
#[tauri::command]
pub fn get_bottom_position(window_height: f64) -> (f64, f64) {
    let taskbar_height = get_taskbar_height().unwrap_or(40) as f64;

    #[cfg(target_os = "windows")]
    unsafe {
        use windows_sys::Win32::Graphics::Gdi::{GetDC, GetDeviceCaps, ReleaseDC, HORZRES, VERTRES};

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

    // Fallback for other platforms or if Windows API calls fail
    (0.0, 1080.0 - window_height - taskbar_height)
}