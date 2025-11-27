# 🏠 Home Cloud

<div align="center">

<img src="/home-cloud.svg" alt="Home Cloud Logo" width="120" height="120" />

**A beautiful, self-hosted cloud storage solution built with Next.js**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## ✨ Features

### 📁 **Folder Management**
- Create nested folders with intuitive UI
- Navigate through folder hierarchy with breadcrumb navigation
- Organize your files exactly how you want

### 🔍 **Smart Search**
- Real-time search across all files and folders
- Instant filtering as you type
- Find what you need in seconds

### 🔄 **Flexible Sorting**
- Sort by **Name** (A-Z or Z-A)
- Sort by **Date** (Newest or Oldest)
- Folders always appear first for easy navigation

### 🗑️ **Safe Deletion**
- Delete files and folders with confirmation dialogs
- Recursive folder deletion (removes all contents)
- Clear warnings before destructive actions

### 📤 **Drag & Drop Upload**
- Simply drag files into the upload area
- Upload to specific folders
- Support for all file types
- Automatic file naming to prevent collisions

### 🎨 **Modern UI/UX**
- Beautiful dark theme with glassmorphism effects
- Smooth animations and transitions
- Responsive design for all screen sizes
- Image previews for visual files
- Icon-based file type indicators

### 🔐 **Secure Access**
- Password-protected login
- Session-based authentication
- Protected API routes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **Yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd home-cloud
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   APP_PASSWORD=your_secure_password_here
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Guide

### 🔑 **Login**
1. Navigate to the login page
2. Enter your password (set in `.env.local`)
3. Click "Sign In" to access your cloud storage

### 📂 **Creating Folders**
1. Click the **"New Folder"** button in the toolbar
2. Enter a folder name
3. Press Enter or click **"Create"**

### 📤 **Uploading Files**
**Method 1: Drag & Drop**
- Drag files from your computer
- Drop them into the upload area
- Files will be uploaded to the current folder

**Method 2: Click to Browse**
- Click the upload area
- Select files from the file picker
- Multiple files can be selected at once

### 🔍 **Searching Files**
1. Type in the search box in the toolbar
2. Results filter in real-time
3. Search works across file and folder names

### 🔄 **Sorting Items**
- Click **"Name"** to sort alphabetically
- Click **"Date"** to sort by modification time
- Click again to reverse the sort order
- Active sort shows an arrow indicator (↑ or ↓)

### 🗑️ **Deleting Items**
1. Click the trash icon on any file or folder
2. Confirm the deletion in the dialog
3. For folders, you'll see a warning about recursive deletion

### 🧭 **Navigation**
- Click on any folder to open it
- Use the breadcrumb navigation at the top to go back
- Click **"Home"** to return to the root directory

---

## 🏗️ Project Structure

```
home-cloud/
├── app/
│   ├── api/
│   │   ├── auth/login/      # Authentication endpoint
│   │   ├── delete/          # Delete files/folders
│   │   ├── file/[name]/     # File download endpoint
│   │   ├── files/           # List files with sorting/search
│   │   ├── folders/         # Create folders
│   │   └── upload/          # File upload endpoint
│   ├── login/               # Login page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── lib/
│   ├── config.ts            # Configuration
│   └── fileUtils.ts         # File system utilities
├── uploads/                 # File storage directory
├── middleware.ts            # Authentication middleware
└── .env.local              # Environment variables
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: Session-based with HTTP-only cookies
- **File System**: Node.js `fs/promises` API

---

## 🔒 Security Features

- **Path Validation**: Prevents directory traversal attacks
- **Input Sanitization**: All file and folder names are sanitized
- **HTTP-only Cookies**: Session tokens not accessible via JavaScript
- **Protected Routes**: Middleware guards all authenticated pages
- **Safe File Operations**: Recursive operations with proper error handling

---

## 🎨 Customization

### Changing the Theme

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --background: #0f172a;      /* Main background */
  --foreground: #e2e8f0;      /* Text color */
  --primary: #3b82f6;         /* Primary accent */
  --primary-hover: #2563eb;   /* Primary hover */
  --surface: #1e293b;         /* Card background */
  --border: #334155;          /* Border color */
}
```

### Changing the Password

Update the `APP_PASSWORD` in your `.env.local` file:

```env
APP_PASSWORD=your_new_password
```

Restart the development server for changes to take effect.

---

## 📝 API Reference

### `GET /api/files`
List files and folders with optional filtering and sorting.

**Query Parameters:**
- `path` - Current folder path (default: root)
- `sortBy` - Sort field: `name` or `date` (default: `date`)
- `sortOrder` - Sort order: `asc` or `desc` (default: `desc`)
- `search` - Search query string

### `POST /api/upload`
Upload a file to the specified path.

**Form Data:**
- `file` - File to upload (required)
- `path` - Destination folder path (optional)

### `POST /api/folders`
Create a new folder.

**JSON Body:**
```json
{
  "folderName": "My Folder",
  "currentPath": "optional/parent/path"
}
```

### `DELETE /api/delete`
Delete a file or folder.

**JSON Body:**
```json
{
  "itemPath": "path/to/item"
}
```

---

## 🚀 Deployment

### 🐳 Docker Deployment (Recommended)

The easiest way to deploy Home Cloud is using Docker Compose.

**Prerequisites:**
- Docker and Docker Compose installed

**Steps:**

1. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   APP_PASSWORD=your_secure_password_here
   ```

2. **Build and start the container**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   
   Navigate to [http://localhost:21043](http://localhost:21043)

**Docker Commands:**
```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build
```

**Notes:**
- The application runs on port **21043** (mapped from internal port 3000)
- Uploaded files are persisted in the `./uploads` directory
- Environment variables can be set in a `.env` file or directly in `docker-compose.yml`

---

### Production Build (Without Docker)

```bash
yarn build
yarn start
```

### Environment Variables for Production

Ensure your production environment has:
```env
APP_PASSWORD=your_secure_production_password
NODE_ENV=production
```

### Recommended Platforms

- **Docker** - Self-hosted with Docker Compose (recommended)
- **Vercel** - Optimized for Next.js
- **Railway** - Easy deployment with persistent storage
- **DigitalOcean** - Full control with App Platform
- **Self-hosted** - VPS with Node.js support

> **Note**: For production deployments, consider using a proper database and object storage (like S3) instead of the local file system for better scalability.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern cloud storage solutions

---

<div align="center">

**Made with ❤️ for self-hosted cloud storage**

[⬆ Back to Top](#-home-cloud)

</div>
