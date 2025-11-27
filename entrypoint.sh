#!/bin/sh
# Fix permissions for uploads directory
# This is needed because volume mounts can override the permissions set in the Dockerfile
chown -R nextjs:nodejs /app/uploads

# Execute the command as nextjs user
exec su-exec nextjs "$@"
