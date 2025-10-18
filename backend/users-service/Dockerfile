# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist

# Port
ARG PORT_ARG=3000
ENV PORT=${PORT_ARG}
EXPOSE ${PORT_ARG}

# Start the application
CMD ["node", "dist/main.js"]