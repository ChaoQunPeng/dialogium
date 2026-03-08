# Electron 打包指南

## 📋 目录

1. [快速开始](#快速开始)
2. [图标准备](#图标准备)
3. [开发模式](#开发模式)
4. [打包流程](#打包流程)
5. [故障排查](#故障排查)

## 🚀 快速开始

### 1. 安装依赖（如果还未安装）

```bash
pnpm install
```

### 2. 准备图标文件（可选但推荐）

项目已包含一个 `src/assets/avatar.png` 文件，你可以：

**选项 A**: 直接使用现有 avatar.png（需要手动重命名和转换格式）
```bash
# 复制为 icon.png
cp src/assets/avatar.png src/assets/icon.png
```

**选项 B**: 使用在线工具生成所有格式的图标
1. 访问 https://icon.kitchen/
2. 上传你的 logo 图片
3. 下载生成的图标包
4. 将图标文件放入 `src/assets/` 目录

**必需图标文件**:
- ✅ `src/assets/icon.png` - 512x512px (已有 avatar.png 可重命名)
- ⚠️ `src/assets/icon.icns` - macOS 专用（可选，没有则使用默认图标）
- ⚠️ `src/assets/icon.ico` - Windows 专用（可选，electron-builder 可从 PNG 生成）

> **提示**: 如果不提供特定格式图标，electron-builder 会使用默认图标或从 PNG 自动生成。

### 3. 启动开发环境

#### Web 开发模式
```bash
pnpm dev
```
访问 http://localhost:5173

#### Electron 桌面开发模式
```bash
pnpm dev:electron
```
这将自动打开 Electron 窗口，支持热更新。

## 📦 打包流程

### 方式一：自动打包（推荐）

```bash
# 根据当前操作系统自动选择目标格式
pnpm build:electron
```

### 方式二：指定平台打包

```bash
# macOS
pnpm build:electron:mac
# 输出：dist/electron/mac/

# Windows（需要在 Windows 系统上运行）
pnpm build:electron:win
# 输出：dist/electron/win/

# Linux
pnpm build:electron:linux
# 输出：dist/electron/linux/
```

### 打包产物说明

| 平台 | 文件格式 | 说明 |
|------|---------|------|
| macOS | `.dmg` | 安装包（推荐分发） |
| macOS | `.zip` | 压缩包（可直接运行） |
| Windows | `.exe` | 安装程序 |
| Windows | `.exe (portable)` | 便携版，无需安装 |
| Linux | `.AppImage` | 通用格式，直接运行 |
| Linux | `.deb` | Debian/Ubuntu 安装包 |

## 🔧 故障排查

### 问题 1: Electron 无法启动

**症状**: 运行 `pnpm dev:electron` 后没有任何反应

**解决方案**:
```bash
# 1. 检查 Vite 是否正常启动
pnpm dev

# 2. 手动启动 Electron（在另一个终端）
npx electron .
```

### 问题 2: 打包失败或图标错误

**症状**: 构建过程中出现图标相关错误

**解决方案**:
```bash
# 临时移除图标配置（使用默认图标）
# 编辑 package.json，注释掉 mac/win/linux 的 icon 配置
```

或在 package.json 中简化图标配置：
```json
"build": {
  "appId": "com.dialogium.app",
  "productName": "飘邈之旅",
  "files": [
    "dist/**/*",
    "electron/**/*"
  ]
}
```

### 问题 3: 生产环境白屏

**症状**: 打包后的应用显示白屏，无法加载页面

**检查清单**:
1. ✅ 确认 `vite.config.ts` 中配置了 `base: './'`
2. ✅ 确认 `electron/main.js` 中生产环境加载正确的 HTML 路径
3. ✅ 检查浏览器开发者工具中的控制台错误

### 问题 4: localStorage 数据丢失

**症状**: 重启应用后游戏进度丢失

**原因**: Electron 的 localStorage 存储在用户数据目录，不同版本可能不兼容

**解决方案**: 实现数据持久化到文件系统（高级用法）

## 🎯 最佳实践

### 开发阶段
- 使用 `pnpm dev:electron` 进行桌面端开发
- 利用 Chrome DevTools 调试（Electron 会自动打开）
- 定期在 Web 模式 (`pnpm dev`) 下测试兼容性

### 发布阶段
- 在所有目标平台上测试构建结果
- 使用语义化版本号（修改 package.json 中的 version）
- 提供更新日志和安装说明

### 性能优化
- 启用代码分割和懒加载
- 压缩图片和资源文件
- 考虑使用原生模块替代部分 JS 功能

## 📚 参考资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 配置指南](https://www.electron.build/configuration)
- [Vite 生产构建优化](https://vitejs.dev/guide/build.html)

---

**最后更新**: 2026-03-08  
**维护者**: Dialogium Team
