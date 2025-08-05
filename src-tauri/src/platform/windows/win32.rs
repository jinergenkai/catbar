use windows_sys::Win32::{
    Foundation::{BOOL, HWND, LPARAM},
    System::Threading::GetCurrentProcessId,
    UI::WindowsAndMessaging::{
        BringWindowToTop, EnumWindows, GetWindowTextW, GetWindowThreadProcessId,
        SetForegroundWindow, SetWindowPos, HWND_NOTOPMOST, HWND_TOPMOST, 
        SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW,
    },
};

static mut FOUND_HWND: HWND = 0 as HWND;
static mut TARGET_TITLE: Vec<u16> = Vec::new();

/// Force a window to be topmost
pub fn force_topmost(hwnd: *mut std::ffi::c_void) {
    unsafe {
        SetWindowPos(
            hwnd,
            HWND_TOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW,
        );

        // Try to get focus and bring window in front of taskbar
        BringWindowToTop(hwnd as _);
        SetForegroundWindow(hwnd as _);
    }
}

/// Remove topmost status from a window
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

/// Find a window by its title
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

/// Find a window by title and set it as topmost
pub fn find_and_set_topmost(window_title: &str) -> bool {
    if let Some(hwnd) = find_window_by_title(window_title) {
        force_topmost(hwnd as *mut std::ffi::c_void);
        true
    } else {
        false
    }
}

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