#!/bin/bash

# 设置日志函数
log_info() {
  echo -e "\e[34m[INFO]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
  echo -e "\e[32m[SUCCESS]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
  echo -e "\e[31m[ERROR]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 记录启动信息
log_info "Starting deployment process..."

# 安装 http-server (本地安装，避免权限问题)
log_info "Installing http-server..."
npm install http-server --no-save
if [ $? -eq 0 ]; then
  log_success "http-server installed successfully"
else
  log_error "Failed to install http-server"
  exit 1
fi

# 设置端口
PORT=3000
log_info "Using port: $PORT"

# 启动服务器
log_info "Starting http-server..."
./node_modules/.bin/http-server -p $PORT -a 0.0.0.0 --cors > server.log 2>&1 &
SERVER_PID=$!

# 检查服务器是否成功启动
sleep 2
if ps -p $SERVER_PID > /dev/null; then
  log_success "http-server started with PID: $SERVER_PID"
  log_info "Server logs are being written to server.log"
  log_info "The application is available at:"
  log_info "  http://localhost:$PORT"
  log_info "  http://$(hostname -I | awk '{print $1}'):$PORT"
  
  # 监控服务器日志
  tail -f server.log
else
  log_error "Failed to start http-server. Check server.log for details:"
  cat server.log
  exit 1
fi