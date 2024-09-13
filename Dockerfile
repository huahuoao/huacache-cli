# 使用官方 Node.js 镜像作为基础镜像
FROM node:20 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 编译 Vue 工程
RUN npm run build

# 使用 Nginx 镜像
FROM nginx:alpine

# 复制编译好的文件到 Nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
