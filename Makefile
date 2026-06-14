.PHONY: install dev dev-minimized build build-main build-renderer start start-debug \
       format lint typecheck check package package-mac package-win package-linux package-all \
       clean help

help: ## 显示所有可用命令
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Install

install: ## 安装依赖（使用国内镜像）
	ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install --registry=https://registry.npmmirror.com

# Development

dev: ## 启动开发服务器（热重载）
	npm run dev

dev-minimized: ## 启动开发服务器（不自动聚焦窗口）
	START_MINIMIZED=true npm run dev

# Build

build: ## 构建主进程和渲染进程
	npm run build

build-main: ## 仅构建主进程
	npm run build-main

build-renderer: ## 仅构建渲染进程
	npm run build-renderer

# Production

start: build ## 构建并启动生产模式
	npm run start

start-debug: build ## 构建并启动生产模式（带 DevTools）
	DEBUG_PROD=true npm run start

# Code Quality

format: ## 格式化代码
	npm run format

lint: ## 运行 ESLint 检查
	npm run lint

typecheck: ## 运行 TypeScript 类型检查
	npm run typecheck

check: format lint typecheck ## 格式化 + Lint + 类型检查（建议每次改动后运行）

# Packaging

package: build ## 打包当前平台
	npm run package

package-mac: build ## 打包 macOS
	npm run package-mac

package-win: build ## 打包 Windows
	npm run package-win

package-linux: build ## 打包 Linux
	npm run package-linux

package-all: build ## 打包所有平台
	npm run package-all

# Cleanup

clean: ## 清理构建产物
	rm -rf app/main/dist app/renderer/dist release
