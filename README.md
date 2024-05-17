# 🏠 Tô Salvo Canoas

Welcome to the Tô Salvo Canoas project. This guide will help you set up the project and understand its structure.

## 🚀 Development Setup

Follow these steps to run the application in development mode:

- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm run dev
  ```

## 📦 Simulating Production

To simulate production environment on your local machine, execute the following:

- Build the project:
  ```bash
  npm run build
  ```
- Start the production simulation:
  ```bash
  npm run dev:start
  ```

## 🔁 Periodic Tasks

For the application to function properly, certain tasks need to run periodically to fetch and cache data from various sources. This not only populates the data but also enhances the response speed of our application to frontend requests.

- The tasks are managed through a file named `cronTasks.ts`.
- To initiate these tasks, use one of the following commands depending on your current mode:

  ```bash
  npm run dev:cron-tasks
  ```

  ```bash
  npm run start:cron-tasks
  ```

## 🌐 Data Sources

- Instagram: [@tosalvocanoas](https://www.instagram.com/tosalvocanoas)
  - [Google Sheets Data](https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/edit#gid=1798758152)
- Instagram: [@prefcanoas](https://www.instagram.com/prefcanoas)
  - [Google Sheets Data](https://docs.google.com/spreadsheets/d/1f5gofOOv4EFYWhVqwPWbgF2M-7uHrJrCMiP7Ug4y6lQ/htmlview#gid=1619683963)

## 🗺️ Roadmap

Our development roadmap includes a variety of exciting features and enhancements:

- Login (Google) + Roles
- CRUD Cleaning form

This documentation is designed to get you started and familiar with our project's structure and setup. For more detailed information or support, please refer to our contributing guidelines or contact the development team directly.
