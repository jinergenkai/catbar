//! Platform-specific implementations
//! Currently supports Windows platform for:
//! - Window overlay management
//! - Taskbar interaction
//! - Win32 API utilities

#[cfg(target_os = "windows")]
pub mod windows;

#[cfg(target_os = "windows")]
pub use self::windows::*;