use windows_sys::Win32::{
    Foundation::*, 
    Graphics::Gdi::*, 
    System::Threading::*, 
    UI::WindowsAndMessaging::*,
};

use std::ffi::c_void;

static mut APP_HWND: HWND = std::ptr::null_mut();
static mut TASKBAR_HWND: HWND = std::ptr::null_mut();
static mut IS_FULLSCREEN_APP_ACTIVE: bool = false;

/// Setup smart overlay behavior for a window
pub fn setup_smart_overlay(hwnd: *mut c_void) -> Result<(), Box<dyn std::error::Error>> {
    unsafe {
        APP_HWND = hwnd as HWND;
        let class_name: Vec<u16> = "Shell_TrayWnd\0".encode_utf16().collect();
        TASKBAR_HWND = FindWindowW(class_name.as_ptr(), std::ptr::null());

        if TASKBAR_HWND == std::ptr::null_mut() {
            return Err("Cannot find taskbar HWND".into());
        }

        // Set highest priority
        SetPriorityClass(GetCurrentProcess(), REALTIME_PRIORITY_CLASS);

        SetWindowPos(
            APP_HWND,
            HWND_TOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW,
        );

        std::thread::spawn(|| {
            monitor_fullscreen_apps();
        });

        Ok(())
    }
}

fn monitor_fullscreen_apps() {
    unsafe {
        loop {
            let foreground = GetForegroundWindow();

            if is_fullscreen_application(foreground) {
                if !IS_FULLSCREEN_APP_ACTIVE {
                    IS_FULLSCREEN_APP_ACTIVE = true;
                    ShowWindow(APP_HWND, SW_HIDE);
                }
            } else {
                if IS_FULLSCREEN_APP_ACTIVE {
                    IS_FULLSCREEN_APP_ACTIVE = false;
                    ShowWindow(APP_HWND, SW_SHOW);
                }

                // Recheck and force overlay to top
                SetWindowPos(
                    APP_HWND,
                    HWND_TOPMOST,
                    0,
                    0,
                    0,
                    0,
                    SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_ASYNCWINDOWPOS,
                );
            }

            std::thread::sleep(std::time::Duration::from_millis(10));
        }
    }
}

unsafe fn is_taskbar_related(hwnd: HWND) -> bool {
    if hwnd == TASKBAR_HWND {
        return true;
    }

    let mut class_name = [0u16; 256];
    let len = GetClassNameW(hwnd, class_name.as_mut_ptr(), 256);
    if len == 0 {
        return false;
    }
    let class_str = String::from_utf16_lossy(&class_name[..len as usize]).to_lowercase();
    class_str.contains("shell_traywnd")
        || class_str.contains("button")
        || class_str.contains("start")
        || class_str.contains("task")
}

unsafe fn is_fullscreen_application(hwnd: HWND) -> bool {
    if hwnd == GetDesktopWindow() || hwnd == TASKBAR_HWND {
        return false;
    }

    let mut rect = RECT {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    };
    if GetWindowRect(hwnd, &mut rect) == 0 {
        return false;
    }

    let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
    let mut info = MONITORINFO {
        cbSize: std::mem::size_of::<MONITORINFO>() as u32,
        rcMonitor: RECT {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        rcWork: RECT {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        dwFlags: 0,
    };
    if GetMonitorInfoW(monitor, &mut info) == 0 {
        return false;
    }

    let covers_screen = rect.left <= info.rcMonitor.left
        && rect.top <= info.rcMonitor.top
        && rect.right >= info.rcMonitor.right
        && rect.bottom >= info.rcMonitor.bottom;

    let style = GetWindowLongW(hwnd, GWL_STYLE) as u32;
    let is_borderless = (style & WS_CAPTION == 0) && (style & WS_THICKFRAME == 0);

    covers_screen && is_borderless
}

extern "system" {
    fn SetLayeredWindowAttributes(hwnd: HWND, crKey: u32, bAlpha: u8, dwFlags: u32) -> BOOL;
}

const LWA_ALPHA: u32 = 0x2;