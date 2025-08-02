#[tauri::command]
pub fn get_taskbar_height() -> Option<i32> {
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::Foundation::RECT;
        use windows_sys::Win32::Graphics::Gdi::{GetDC, GetDeviceCaps, ReleaseDC, VERTRES};
        use windows_sys::Win32::UI::WindowsAndMessaging::{SystemParametersInfoW, SPI_GETWORKAREA};

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
    }

    #[cfg(target_os = "macos")]
    {
        // macOS implementation using Cocoa
        use objc2::rc::Id;
        use objc2_app_kit::{NSApplication, NSScreen};
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
        use windows_sys::Win32::Graphics::Gdi::{
            GetDC, GetDeviceCaps, ReleaseDC, HORZRES, VERTRES,
        };

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

#[cfg(target_os = "windows")]
use windows_sys::Win32::{
    Foundation::{BOOL, HWND, LPARAM},
    System::Threading::GetCurrentProcessId,
    UI::WindowsAndMessaging::{
        EnumWindows, GetWindowTextW, GetWindowThreadProcessId, SetWindowPos, HWND_NOTOPMOST,
        HWND_TOPMOST, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW,
    },
};

#[cfg(target_os = "windows")]
pub fn force_topmost(hwnd: *mut std::ffi::c_void) {
    use windows_sys::Win32::Foundation::BOOL;
    use windows_sys::Win32::UI::WindowsAndMessaging::*;

    unsafe {
        // Đặt topmost
        SetWindowPos(
            hwnd,
            HWND_TOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW,
        );

        // Cố lấy lại focus và đẩy về trước taskbar
        BringWindowToTop(hwnd as _);
        SetForegroundWindow(hwnd as _);
        // SetFocus(hwnd as _);
    }
}

#[cfg(target_os = "windows")]
pub fn remove_topmost(hwnd: isize) {
    unsafe {
        SetWindowPos(
            hwnd as HWND,
            HWND_NOTOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
        );
    }
}

#[cfg(target_os = "windows")]
static mut FOUND_HWND: HWND = 0 as HWND;
#[cfg(target_os = "windows")]
static mut TARGET_TITLE: Vec<u16> = Vec::new();

#[cfg(target_os = "windows")]
unsafe extern "system" fn enum_windows_proc(hwnd: HWND, _lparam: LPARAM) -> BOOL {
    let mut buffer = [0u16; 256];
    let len = GetWindowTextW(hwnd, buffer.as_mut_ptr(), buffer.len() as i32);

    if len > 0 {
        let window_title_slice = &buffer[0..len as usize];

        // Compare with target title
        if window_title_slice.len() == TARGET_TITLE.len() - 1 {
            // -1 for null terminator
            let mut matches = true;
            for i in 0..window_title_slice.len() {
                if window_title_slice[i] != TARGET_TITLE[i] {
                    matches = false;
                    break;
                }
            }

            if matches {
                // Check if it belongs to our process
                let mut process_id = 0;
                GetWindowThreadProcessId(hwnd, &mut process_id);
                if process_id == GetCurrentProcessId() {
                    FOUND_HWND = hwnd;
                    return 0; // Stop enumeration
                }
            }
        }
    }
    1 // Continue enumeration
}

#[cfg(target_os = "windows")]
pub fn find_window_by_title(title: &str) -> Option<isize> {
    unsafe {
        FOUND_HWND = 0 as HWND;
        TARGET_TITLE = title.encode_utf16().chain(std::iter::once(0)).collect();

        EnumWindows(Some(enum_windows_proc), 0);

        if FOUND_HWND != 0 as HWND {
            Some(FOUND_HWND as isize)
        } else {
            None
        }
    }
}

#[cfg(target_os = "windows")]
pub fn find_and_set_topmost(window_title: &str) -> bool {
    if let Some(hwnd) = find_window_by_title(window_title) {
        force_topmost(hwnd as *mut std::ffi::c_void);
        true
    } else {
        false
    }
}

// Tauri commands
#[tauri::command]
pub fn set_window_topmost(window_title: String) -> bool {
    #[cfg(target_os = "windows")]
    {
        find_and_set_topmost(&window_title)
    }
    #[cfg(not(target_os = "windows"))]
    {
        false
    }
}

#[tauri::command]
pub fn remove_window_topmost(window_title: String) -> bool {
    #[cfg(target_os = "windows")]
    {
        if let Some(hwnd) = find_window_by_title(&window_title) {
            remove_topmost(hwnd);
            true
        } else {
            false
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        false
    }
}
