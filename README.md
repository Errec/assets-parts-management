
# Assets Parts Management

A Tauri React application designed to facilitate the management and maintenance of industrial assets. Assets, ranging from manufacturing equipment to transportation vehicles and power generation systems, are vital to the operation of industries. This application visualizes the hierarchy of assets through a dynamic tree structure, enabling companies to efficiently manage and maintain their assets.

## Features

- **Asset Tree**: The core feature of the application, providing a visual tree representation of the company's asset hierarchy, including components, assets, and locations.
- **Text Search**: Allows users to search for specific components, assets, or locations within the asset hierarchy quickly.
- **Energy Sensor Filter**: Users can isolate energy sensors within the asset tree to focus on specific monitoring tasks.
- **Critical Sensor Status Filter**: This filter highlights assets that have critical sensor statuses, enabling prompt maintenance actions.
- **Drag and Drop Images**: Users can drag and drop images into the asset view menu for easier association and management of visual data with assets.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Errec/assets-parts-management.git
   cd assets-parts-management
   ```

2. Install the dependencies:
   ```bash
   yarn install
   ```

3. Run the application in development mode:
   ```bash
   yarn tauri dev
   ```

## Usage

Once the application is running, users can interact with the asset tree, apply filters, search for specific items, and manage images related to assets. The intuitive interface is designed to streamline asset management tasks and ensure that critical systems remain operational and well-maintained.

## Technology Stack

- **Tauri**: A lightweight, fast framework for building cross-platform desktop applications using web technologies. Tauri ensures a minimal application footprint and provides native performance.
- **React**: A JavaScript library for building user interfaces. React's component-based architecture facilitates the development of a dynamic and responsive user interface.
- **Tailwind CSS**: A utility-first CSS framework used for building custom user interfaces quickly. Tailwind's utility classes enable rapid and responsive UI development.
- **Tray Menu**: The application includes a system tray menu, enhancing user convenience and providing quick access to essential functions without the need to open the main application window.

## Multi-Platform/OS Usage

This application is designed to run seamlessly across multiple platforms and operating systems, including:

- **Windows**
- **macOS**
- **Linux**

Tauri's cross-platform capabilities ensure consistent performance and user experience regardless of the operating system.

## Performance

The use of Tauri in this project allows for a minimal memory footprint and fast startup times, making it an ideal choice for building efficient desktop applications. The React frontend ensures a responsive and fluid user experience, while Tailwind CSS aids in creating a well-structured and visually appealing interface. Additionally, Tauri's ability to leverage native system resources enhances overall performance.

## License

This project is licensed under the [MIT License](LICENSE).
