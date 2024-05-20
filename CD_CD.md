# 服务端CD/CD: github 自动化
learn for using Github Actions
- copy from [gitee repo: editor-server](https://gitee.com/zhelingwang/editor-server.git)
- copy at commit message: refactor: add comment and adjust commitlint cmd

## 主要内容
- 使用 giub actions 进行CI/CD
- 使用 Docker 在 nodejs 项目中的应用
- 搭建测试环境, 自动发布到测试机


## Github Actions
github提供的CI/CD平台工具, 创建工作流程，当你执行 push 或 merge 操作时自动执行任务, 如: 构建, 测试或部署

划分两个workflows:
1. test.yml: dev分支, 自动构建, 部署到测试机器
2. deploy.yml: master分支, 自动化测试
3. 每当创建一个 v*.x.* 格式的 release 或 tag 版本时, 自动部署应用, 支持回滚

### 基本概念
- workflows: 包含若干个任务且可配置的自动化流程, 通过一个 yaml 文件来定义配置
	- 构成workflow几个基本组件以及流程: events -> runner to run jobs -> several steps
	- 上述流程都是多对一关系

### 基本配置
```yaml
# workflow display names
name: test dev server
run-name: ${{ github.actor }} start dev server

# define trigger events
on: 
  push:
    branches:
      - main

# define jobs and steps
jobs:
	# 第一个任务
  startup:
		# 安装虚拟机系统
    runs-on: ubuntu-latest
		# 一个 - 就是一个step
    steps:
			# 第三方action: git pull repo code on virtual runner server
      - uses: actions/checkout@v4
			# 第三方action: 安装nodejs
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: install dependencies
        run: npm install
			# 省略 step name, 多行写法 | 开头
      - run: |
				npm run lint
				npm run start
```

> docs: [Github Actions](https://docs.github.com/en/actions/quickstart)


## Docker
使用 Docker 来完成自动部署操作, 运维领域用得比较多.

### 什么是 docker?
相较于传统的虚拟机技术(vmware, virtualBox), docker是一种更加简单轻量的虚拟机技术.
Docker是一种应用容器引擎，允许开发者将应用及其依赖打包到一个可移植的容器中，然后发布到任何流行的Linux机器或Windows机器上，也可以实现虚拟化.

docker解决了什么问题?
为应用复制完全一样的运行环境, 以此来简化运行环境的搭建和应用部署, 还能避免由于运行环境差异所带来的潜在问题;

重要概念:
1. 容器: "微型计算机", 用于运行镜像
2. 镜像: 操作系统 + 应用程序以及运行应用所需的所有依赖

docker应用容器引擎 -> 容器 -> 镜像

_总结:
Docker容器就像是虚拟的硬件环境，它使用宿主机的硬件资源（如CPU、内存等），而Docker镜像则是包含了运行应用所需的所有软件依赖的全功能“软件包”。_

### 基本使用
1. 安装 Docker Desktop
2. 在项目根目录创建并配置你的 Dockerfile
3. 构建 image 镜像
4. 在容器上运行 image

```bash
# 构建镜像
cd yourProjectRootDir
docker build -t my-image-name .

# get image
docker pull <image-name>:<tag>

# list image
docker images

# remove image
docker rmi <image-id>

# start container
docker run -p xxx:xxx -d --name containerName imageName
docker ps
docker stop cid
docker rm cid
docker logs cid

# 进入容器应用的终端命令行
docker exec -it containerId /bin/sh
```

> tip: 启用镜像加速, 否则pull image会很慢

### Dockerfile vs compose.yml
- Dockerfile 描述如何构建一个容器镜像, 配置一系列构建相关的指令
- Compose 文件定义多容器应用, 本质充当了分组的作用, 便于将多个互相依赖的容器应用整合起来构成一个完整的服务

```txt
Compose.yml文件中，每个定义的容器实际上可看作是一个单独的应用或服务。这些服务可以是数据库、后端应用程序、前端应用程序等，他们各自可以独立地运行。

当这些容器（应用）被组合在一起时，它们就构成了一个完整的多容器应用。
这些容器之间通过网络进行相互通信，就像它们是在同一个本地网络中一样。

这样，你就可以用一种微服务的方式来构建你的应用，每个服务都在自己的容器中运行，彼此之间通过网络服务进行通信，但是又可以被统一地管理和调度。
```

> _warn: 在Docker中，容器的生命周期是由其主进程的生命周期决定的。即当主进程结束时，容器也就结束了。即 Dockerfile 中的CMD命令必须是一个阻塞控制台的程序，以保持容器的运行状态._


## 自动部署到测试机
- github actions 监听 git 提交, 触发执行自定义命令
- docker 一键部署开发环境
- 两者结合即可自动发布到测试环境

### 配置测试机