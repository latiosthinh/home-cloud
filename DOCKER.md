# Docker Setup Summary

## 📦 What Was Created

Your Home Cloud application has been successfully dockerized! Here's what was added:

### Files Created:
1. **Dockerfile** - Multi-stage Docker build configuration
2. **docker-compose.yml** - Docker Compose orchestration file
3. **.dockerignore** - Excludes unnecessary files from Docker builds

### Files Modified:
1. **next.config.ts** - Added `output: 'standalone'` for optimized Docker builds
2. **README.md** - Added comprehensive Docker deployment instructions
3. **.gitignore** - Updated to allow `env.example` file
4. **env.example** - Enhanced with Docker-specific instructions

## 🚀 Quick Start

### 1. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
# Copy from example
cp env.example .env

# Edit the file and set your password
# .env should contain:
APP_PASSWORD=your_secure_password_here
```

### 2. Build and Run
```bash
# Build and start the container in detached mode
docker-compose up -d
```

### 3. Access the Application
Open your browser and navigate to:
**http://localhost:21043**

## 📋 Common Docker Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs (follow mode)
docker-compose logs -f

# View logs (static)
docker-compose logs

# Restart the application
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove containers, networks, and volumes
docker-compose down -v
```

## 🔧 Configuration Details

### Port Mapping
- **External Port**: 21043 (accessible from your host machine)
- **Internal Port**: 3000 (inside the container)

### Volume Persistence
- **./uploads** directory is mounted to persist uploaded files
- Files will remain even if the container is stopped or removed

### Environment Variables
Set in `.env` file or directly in `docker-compose.yml`:
- `APP_PASSWORD` - Password for accessing the application
- `NODE_ENV` - Automatically set to `production`

## 🏗️ Docker Architecture

### Multi-Stage Build
The Dockerfile uses a multi-stage build for optimization:
1. **deps** - Installs dependencies using Yarn
2. **builder** - Builds the Next.js application with Yarn
3. **runner** - Creates minimal production image

### Benefits:
- ✅ Smaller final image size
- ✅ Faster deployments
- ✅ Better security (minimal attack surface)
- ✅ Optimized for production

## 🔒 Security Features

- Runs as non-root user (`nextjs`)
- HTTP-only cookies for session management
- Environment variables isolated in container
- Minimal production image

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check if port 21043 is already in use
netstat -ano | findstr :21043  # Windows
lsof -i :21043                 # macOS/Linux
```

### Permission issues with uploads
```bash
# The uploads directory should be writable
# On Linux/macOS, you may need to adjust permissions
chmod 755 uploads
```

### Environment variables not loading
```bash
# Ensure .env file exists and is in the correct location
# Restart the container after changing .env
docker-compose down
docker-compose up -d
```

### Rebuild after code changes
```bash
# Always rebuild when you modify the code
docker-compose up -d --build
```

## 📊 Health Check

The container includes a health check that:
- Runs every 30 seconds
- Checks if the application responds on port 3000
- Allows 40 seconds for startup
- Retries 3 times before marking as unhealthy

Check health status:
```bash
docker-compose ps
```

## 🌐 Production Deployment

For production deployment:

1. **Update environment variables**
   ```env
   APP_PASSWORD=strong_production_password_here
   ```

2. **Use a reverse proxy** (recommended)
   - Nginx or Traefik for SSL/TLS termination
   - Domain name configuration
   - HTTPS certificates (Let's Encrypt)

3. **Consider adding**
   - Database for metadata (instead of file system)
   - Object storage (S3, MinIO) for files
   - Backup strategy for uploads directory
   - Monitoring and logging

## 📝 Next Steps

1. ✅ Create `.env` file with your password
2. ✅ Run `docker-compose up -d`
3. ✅ Access http://localhost:21043
4. ✅ Test file upload and download
5. ✅ Verify uploads persist after container restart

Enjoy your dockerized Home Cloud! 🎉
