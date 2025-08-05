//! Cat Bar Application
//! 
//! A desktop application that displays a cat bar at the bottom of the screen.
//! Built with Tauri and integrates with Windows API for special window behaviors.

mod app;
mod platform;
mod window;

pub use app::builder::build_app;

// Re-export commonly used items
pub use platform::windows::{
    taskbar::get_taskbar_height,
    win32::{set_window_topmost, remove_window_topmost}
};
