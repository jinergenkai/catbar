//! Application setup and initialization
//! 
//! This module contains all application-level setup and configuration:
//! - Application builder and initialization
//! - Plugin setup
//! - System tray configuration

pub mod builder;
mod plugins;
mod tray;

pub use builder::build_app;
pub(crate) use plugins::setup_plugins;
pub(crate) use tray::setup_tray;