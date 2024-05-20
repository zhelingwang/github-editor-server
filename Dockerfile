# Start your image with a node base image
FROM node:20

# The /app directory should act as the main application directory
WORKDIR /app

# Copy local directories to the current local directory of our docker image (/app)
COPY . /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
# 安装
RUN npm set registry https://registry.npmmirror.com/
RUN npm i
RUN npm install pm2 -g

# 启动
# 注意: CMD最后的命令必须是一个阻塞控制台程序, 这样能保持应用的持续存活运行的状态, 如: npx pm2 log
# 因为在Docker中，容器的生命周期是由其主进程的生命周期决定的, 若不阻塞式运行, 命令运行结束容器也会随着终止
CMD echo $SERVER_NAME && echo $AUTHOR_NAME && npm run start && npx pm2 log

# 环境变量
# usage: process.env.SERVER_NAME
ENV SERVER_NAME="editor-server"
ENV AUTHOR_NAME="zhelingwang"