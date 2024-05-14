# 服务端CD/CD: github 自动化
learn for using Github Actions

- copy from [gitee repo: editor-server](https://gitee.com/zhelingwang/editor-server.git)
- copy at commit message: refactor: add comment and adjust commitlint cmd

## 主要内容
- 使用 giub actions 进行CI/CD
- 使用 Docker 在 nodejs 项目中的应用
- 搭建测试环境, 自动发布到测试机


## Github Actions
github提供的CI/CD平台, 用于创建工作流程，当你执行 push 或 merge 到 master 时自动执行构建, 测试或部署到生产环境.

划分两个workflows:
1. test.yml: dev分支, 自动构建, 部署到测试机器
2. deploy.yml: master分支, 自动化测试
3. 每当创建一个 v*.*.* 格式的 release 或 tag 版本时, 自动部署应用, 支持回滚

### 基本概念
- workflows: 包含若干个任务且可配置的自动化流程, 通过一个 yaml 文件来定义配置
	- 构成workflow几个基本组件以及流程: events -> runner to run jobs -> several steps
	- 上述流程都是多对一关系




## Docker




## 搭建测试环境