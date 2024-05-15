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
3. 每当创建一个 v*.*.* 格式的 release 或 tag 版本时, 自动部署应用, 支持回滚

### 基本概念
- workflows: 包含若干个任务且可配置的自动化流程, 通过一个 yaml 文件来定义配置
	- 构成workflow几个基本组件以及流程: events -> runner to run jobs -> several steps
	- 上述流程都是多对一关系

基本配置:
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



## 搭建测试环境