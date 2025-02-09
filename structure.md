# Project Structure Documentation

This document provides an overview of the project architecture and directory structure for the XarV2.1 Telegram bot.

## Directory Structure

```
/workspaces/XarV2.1-BETA.1
├── .gitignore
├── bun.lock
├── config.json
├── database/
│   ├── config.ts
│   ├── database.ts
│   └── main.ts
├── models/
│   ├── threadModel.ts
│   └── userModel.ts
├── public/
│   └── index.html
├── scripts/
│   ├── cmds/
│   ├── events/
│   └── loader/
├── server/
│   ├── global.js
│   ├── main.ts
│   └── utils.ts
├── types/
│   └── index.d.ts
├── README.md
└── package.json
```

### Core Components

- **Database**: The `database/` directory contains files for database configuration and management, including SQLite, MongoDB, and JSON databases.
- **Models**: The `models/` directory contains data models for threads and users, defining the structure and behavior of the data.
- **Scripts**: The `scripts/` directory contains command and event scripts, as well as the loader for managing commands and events.
- **Server**: The `server/` directory contains the main server files, including global configurations, main application logic, and utility functions.
- **Public**: The `public/` directory contains static files, such as HTML files for the user interface.

### Database Configuration

The bot supports multiple database types, including:
- **SQLite**: A lightweight database for local storage.
- **MongoDB**: A NoSQL database for scalable storage.
- **JSON**: A simple file-based storage option.

### Loader System

The loader system is responsible for dynamically loading commands and events. It allows for easy management of the bot's functionality by enabling or disabling commands as needed.

### Dependency Diagram

A dependency diagram can be created to visualize the relationships between different components of the bot. This can help in understanding how various parts of the code interact with each other.
