#[cfg(target_os = "windows")]
use windows_sys::Win32::{
    Foundation::*,
    UI::WindowsAndMessaging::*,
    System::Threading::*,
};

#[cfg(target_os = "windows")]
use std::ffi::c_void;

#[cfg(target_os = "windows")]
static mut OVERLAY_HWND: HWND = std::ptr::null_mut();

#[cfg(target_os = "windows")]
pub fn setup_overlay(hwnd: *mut c_void) -> Result<(), Box<dyn std::error::Error>> {
    unsafe {
        let hwnd = hwnd as HWND;
        OVERLAY_HWND = hwnd;

        // Tăng độ ưu tiên của process
        SetPriorityClass(GetCurrentProcess(), REALTIME_PRIORITY_CLASS);

        // Thay đổi style để loại bỏ viền và thanh tiêu đề
        let style = GetWindowLongW(hwnd, GWL_STYLE) as u32;
        SetWindowLongW(hwnd, GWL_STYLE, ((style & !(WS_CAPTION | WS_THICKFRAME)) | WS_POPUP) as i32);

        let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE) as u32;
        SetWindowLongW(
            hwnd,
            GWL_EXSTYLE,
            (ex_style | WS_EX_TOPMOST | WS_EX_NOACTIVATE | WS_EX_LAYERED) as i32,
        );

        // Set opacity cho layered window
        SetLayeredWindowAttributes(hwnd, 0, 255, LWA_ALPHA);

        // Force topmost lần đầu
        SetWindowPos(
            hwnd,
            HWND_TOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW,
        );

        // Start monitoring thread
        let hwnd_value = hwnd as isize;
        std::thread::spawn(move || {
            let thread_hwnd = hwnd_value as HWND;
            loop {
                SetWindowPos(
                    thread_hwnd,
                    HWND_TOPMOST,
                    0,
                    0,
                    0,
                    0,
                    SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_ASYNCWINDOWPOS,
                );
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
        });

        Ok(())
    }
}

// Dùng Windows API chưa có trong windows-sys
#[cfg(target_os = "windows")]
extern "system" {
    fn SetLayeredWindowAttributes(
        hwnd: HWND,
        crKey: u32,
        bAlpha: u8,
        dwFlags: u32,
    ) -> BOOL;
}

// Constants cho SetLayeredWindowAttributes
#[cfg(target_os = "windows")]
const LWA_ALPHA: u32 = 0x2;
