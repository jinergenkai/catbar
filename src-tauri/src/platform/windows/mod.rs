//! Windows-specific functionality
//! Contains implementations for:
//! - Window overlay management
//! - Taskbar interaction
//! - Win32 API utilities

pub mod overlay;
pub mod taskbar;
pub mod win32;

pub use self::{
    overlay::*,
    taskbar::*,
    win32::*
};