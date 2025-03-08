#!/bin/bash

# 设置日志函数
log_info() {
  echo -e "\e[34m[INFO]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
  echo -e "\e[32m[SUCCESS]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
  echo -e "\e[33m[WARNING]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
  echo -e "\e[31m[ERROR]\e[0m $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 记录启动信息
log_info "Starting deployment process..."
log_info "Current directory: $(pwd)"

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed. Installing Node.js..."
  
  # 检测操作系统类型
  if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    log_info "Detected Debian/Ubuntu system"
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [ -f /etc/redhat-release ]; then
    # CentOS/RHEL
    log_info "Detected CentOS/RHEL system"
    curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
  else
    log_error "Unsupported operating system. Please install Node.js manually."
    exit 1
  fi
  
  log_success "Node.js installed successfully"
else
  log_success "Node.js is already installed: $(node -v)"
fi

# 检查 npm 是否已安装
if ! command -v npm &> /dev/null; then
  log_error "npm is not installed. Please install npm."
  exit 1
else
  log_success "npm is already installed: $(npm -v)"
fi

# 安装 http-server - 使用 -g 全局安装并使用 sudo
log_info "Installing http-server globally..."
sudo npm install -g http-server
if [ $? -eq 0 ]; then
  log_success "http-server installed successfully"
else
  log_error "Failed to install http-server with sudo. Trying without sudo..."
  npm install -g http-server
  if [ $? -eq 0 ]; then
    log_success "http-server installed successfully without sudo"
  else
    log_error "Failed to install http-server globally. Trying local installation..."
    npm install http-server
    if [ $? -eq 0 ]; then
      log_success "http-server installed locally"
      # 设置 PATH 以包含本地 node_modules/.bin 目录
      export PATH="$PATH:$(pwd)/node_modules/.bin"
      log_info "PATH updated to include local node_modules/.bin"
    else
      log_error "All attempts to install http-server failed"
      exit 1
    fi
  fi
fi

# 验证 http-server 是否可用
if command -v http-server &> /dev/null; then
  log_success "http-server is available in PATH: $(which http-server)"
else
  log_warning "http-server not found in PATH. Checking in local node_modules..."
  if [ -f "./node_modules/.bin/http-server" ]; then
    log_success "Found http-server in local node_modules"
    export PATH="$PATH:$(pwd)/node_modules/.bin"
    log_info "PATH updated to include local node_modules/.bin"
  else
    log_error "http-server not found in PATH or local node_modules"
    exit 1
  fi
fi

# 安装项目依赖
log_info "Installing project dependencies..."
npm install
if [ $? -eq 0 ]; then
  log_success "Project dependencies installed successfully"
else
  log_warning "Some dependencies might not have been installed correctly"
fi

# 检查关键文件是否存在
if [ -f "index.html" ]; then
  log_success "Found index.html"
else
  log_error "index.html not found! This is required for the application."
  exit 1
fi

# 检查js目录
if [ -d "js" ]; then
  log_success "Found js directory"
  log_info "JS files: $(ls -la js/ | wc -l) files"
else
  log_error "js directory not found! This is required for the application."
  exit 1
fi

# 检查css目录
if [ -d "css" ]; then
  log_success "Found css directory"
  log_info "CSS files: $(ls -la css/ | wc -l) files"
else
  log_error "css directory not found! This is required for the application."
  exit 1
fi

# 检查assets目录
if [ -d "assets" ]; then
  log_success "Found assets directory"
  log_info "Asset directories: $(ls -la assets/ | wc -l) items"
else
  log_warning "assets directory not found! Some images may not load correctly."
fi

# 启动服务器
log_info "Starting web server..."
log_info "The application will be available at http://localhost:80"

# 检查是否有已运行的 http-server 进程
RUNNING_SERVER=$(pgrep -f "http-server -p 80")
if [ ! -z "$RUNNING_SERVER" ]; then
  log_warning "Found existing http-server process (PID: $RUNNING_SERVER). Stopping it..."
  kill $RUNNING_SERVER
  sleep 2
fi

# 使用 nohup 在后台运行 http-server
log_info "Starting http-server with command: http-server -p 80 -a 0.0.0.0 --cors"
nohup http-server -p 80 -a 0.0.0.0 --cors > server.log 2>&1 &
SERVER_PID=$!

if [ $? -eq 0 ]; then
  log_success "http-server started with PID: $SERVER_PID"
  log_info "Server logs are being written to server.log"
  log_info "To stop the server, run: kill $SERVER_PID"
else
  log_error "Failed to start http-server. Checking server.log for errors..."
  cat server.log
  exit 1
fi

# 监控服务器进程
log_info "Monitoring server process for 10 seconds to ensure stability..."
for i in {1..10}; do
  if ps -p $SERVER_PID > /dev/null; then
    sleep 1
  else
    log_error "Server process died within 10 seconds of starting! Checking server.log for errors..."
    cat server.log
    exit 1
  fi
done

log_success "Deployment completed successfully!"
log_info "The application is now running at http://YOUR_SERVER_IP:80" 