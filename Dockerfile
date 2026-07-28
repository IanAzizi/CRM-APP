  # Stage 1: Build the Frontend
  FROM node:18-alpine AS frontend-build
  WORKDIR /app/frontend
  # Copy package files for dependency installation
  COPY frontend/package*.json ./
  RUN npm install
  # Copy the rest of the frontend source
  COPY frontend/ .
  # Build the React app
  RUN npm run build

  # Stage 2: Build/Run the Backend
  FROM node:18-alpine
  WORKDIR /app/backend
  # Copy package files for backend dependencies
  COPY backend/package*.json ./
  RUN npm install
  # Copy backend source
  COPY backend/ .

  # Copy the built frontend into the location expected by backend/index.js
  # Backend expects frontend files at: path.join(__dirname, '../frontend/dist')
  COPY --from=frontend-build /app/frontend/build /app/frontend/dist

  # Expose the port the backend runs on
  EXPOSE 5000

  # Start the backend
  CMD ["node", "index.js"]