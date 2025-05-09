# FPS Actor

一个基于Three.js和Cannon.js的简单FPS射击游戏。这个项目展示了如何使用现代Web技术创建一个3D射击游戏。

## 功能特点

- 🎮 第一人称视角控制
- 🎯 鼠标瞄准系统
- 🔫 物理子弹系统
- 🎯 屏幕中央准星
- 📊 实时FPS显示
- 🎯 随机生成的障碍物
- 💯 计分系统
- 🎯 物理碰撞检测

## 技术栈

- Three.js - 3D图形渲染
- Cannon.js - 物理引擎
- TypeScript - 类型安全的JavaScript超集
- Vite - 现代前端构建工具

## 安装

1. 克隆仓库：
```bash
git clone [repository-url]
cd fps-actor
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 游戏控制

- 点击游戏窗口 - 锁定鼠标
- 鼠标移动 - 瞄准
- 左键点击 - 射击
- ESC键 - 解锁鼠标

## 游戏玩法

1. 点击游戏窗口开始
2. 使用鼠标瞄准
3. 点击左键射击
4. 击中障碍物获得分数
5. 每个障碍物需要3次击中才能被摧毁
6. 击中障碍物获得10分
7. 摧毁障碍物获得100分

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