FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
