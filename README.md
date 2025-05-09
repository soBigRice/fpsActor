# FPS Actor Game

一个基于 Three.js 和 Cannon.js 的第一人称射击游戏。

## 功能特点

- 第一人称视角控制
- 物理引擎支持
- 随机生成的障碍物
- 计分系统
- 准星显示
- 帧率显示
- 障碍物生命值显示

## 技术栈

- Three.js - 3D 渲染引擎
- Cannon.js - 物理引擎
- TypeScript - 编程语言
- Vite - 构建工具

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/soBigRice/fpsActor.git
cd fpsActor
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 游戏控制

- 点击游戏窗口锁定鼠标
- WASD - 移动
- 鼠标 - 视角控制
- 左键点击 - 射击
- ESC - 解锁鼠标

## 游戏玩法

- 射击障碍物获得分数
- 每个障碍物需要击中三次才会消失
- 击中障碍物获得 10 分
- 摧毁障碍物获得 100 分

## 开发说明

### 项目结构

```
src/
├── core/           # 核心游戏逻辑
├── entities/       # 游戏实体
├── physics/        # 物理引擎相关
└── world/          # 游戏世界
```

### 主要类

- `Game` - 游戏主类
- `Player` - 玩家控制
- `Bullet` - 子弹系统
- `Obstacle` - 障碍物
- `World` - 游戏世界管理
- `PhysicsWorld` - 物理世界管理

---

# FPS Actor Game

A first-person shooter game based on Three.js and Cannon.js.

## Features

- First-person perspective control
- Physics engine support
- Randomly generated obstacles
- Scoring system
- Crosshair display
- FPS counter
- Obstacle health display

## Tech Stack

- Three.js - 3D rendering engine
- Cannon.js - Physics engine
- TypeScript - Programming language
- Vite - Build tool

## Installation

1. Clone the repository
```bash
git clone https://github.com/soBigRice/fpsActor.git
cd fpsActor
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Game Controls

- Click game window to lock mouse
- WASD - Movement
- Mouse - Camera control
- Left click - Shoot
- ESC - Unlock mouse

## Gameplay

- Shoot obstacles to earn points
- Each obstacle requires three hits to be destroyed
- Hit obstacle: 10 points
- Destroy obstacle: 100 points

## Development

### Project Structure

```
src/
├── core/           # Core game logic
├── entities/       # Game entities
├── physics/        # Physics engine related
└── world/          # Game world
```

### Main Classes

- `Game` - Main game class
- `Player` - Player control
- `Bullet` - Bullet system
- `Obstacle` - Obstacles
- `World` - Game world management
- `PhysicsWorld` - Physics world management

## 项目结构

```
src/
├── core/           # 核心游戏逻辑
├── entities/       # 游戏实体（玩家、子弹等）
├── input/          # 输入处理
├── physics/        # 物理引擎相关
└── world/          # 游戏世界管理
```

## 开发

### 添加新功能

1. 在相应的目录下创建新的类或组件
2. 在`Game`类中集成新功能
3. 确保正确处理物理和渲染更新

### 调试

- 使用FPS显示器监控性能
- 检查控制台输出的调试信息
- 使用浏览器开发工具进行性能分析

## 贡献

欢迎提交问题和功能请求！如果你想贡献代码：

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 致谢

- Three.js 团队
- Cannon.js 团队
- 所有贡献者 