// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, Manager};

fn main() {
  // Define the tray menu items
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let show = CustomMenuItem::new("show".to_string(), "Show");

  // Create the tray menu and add items to it
  let tray_menu = SystemTrayMenu::new()
      .add_item(show)
      .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(hide)
      .add_item(quit);

  // Create the system tray with the defined menu
  let system_tray = SystemTray::new().with_menu(tray_menu);

  // Build and run the Tauri application
  tauri::Builder::default()
      .system_tray(system_tray)
      .on_system_tray_event(|app, event| match event {
          SystemTrayEvent::LeftClick { .. } => {
              let window = app.get_window("main").unwrap();
              window.show().unwrap();
              window.unminimize().unwrap();
              window.set_focus().unwrap();
          }
          SystemTrayEvent::RightClick { .. } => {
              println!("System tray received a right click");
          }
          SystemTrayEvent::DoubleClick { .. } => {
              println!("System tray received a double click");
          }
          SystemTrayEvent::MenuItemClick { id, .. } => {
              match id.as_str() {
                  "quit" => {
                      std::process::exit(0);
                  }
                  "hide" => {
                      let window = app.get_window("main").unwrap();
                      window.hide().unwrap();
                  }
                  "show" => {
                      let window = app.get_window("main").unwrap();
                      window.show().unwrap();
                      window.unminimize().unwrap();
                      window.set_focus().unwrap();
                  }
                  _ => {}
              }
          }
          _ => {}
      })
      .on_window_event(|event| match event.event() {
          tauri::WindowEvent::CloseRequested { api, .. } => {
              // Prevent the app from closing, and hide the window instead
              event.window().hide().unwrap();
              api.prevent_close();
          }
          _ => {}
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
