# 图标文件说明

本目录包含游戏资源文件，其中一些文件可用于 Electron 打包的图标。

## 现有资源

- **avatar.png** - 3.6MB，高分辨率图片，可作为 Electron 应用图标的基础素材

## Electron 图标准备

### 快速方案（推荐）

1. **复制并重命名图标文件**:
   ```bash
   cp src/assets/avatar.png src/assets/icon.png
   ```

2. **裁剪为正方形** (如果需要):
   使用在线工具如 https://www.iloveimg.com/zh-cn/crop-image 将图片裁剪为正方形

3. **调整尺寸为 512x512**:
   使用 https://www.iloveimg.com/zh-cn/resize-image 或其他工具调整尺寸

### 完整方案（生产环境推荐）

生成所有平台所需的图标格式：

#### macOS (.icns)
```bash
# 方法 1: 使用在线转换
访问：https://cloudconvert.com/png-to-icns
上传 icon.png，下载 .icns 文件

# 方法 2: 使用命令行工具（需要安装 ImageMagick）
mkdir icon.iconset
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
iconutil -c icns icon.iconset -o icon.icns
```

#### Windows (.ico)
```bash
# 方法 1: 使用在线转换
访问：https://convertio.co/zh/png-ico/

# 方法 2: 使用 GIMP 或其他图像编辑软件导出
```

#### Linux (.png)
直接使用 512x512 的 PNG 文件即可

### 一键生成工具

使用 `electron-icon-builder` 自动生成所有格式：

```bash
# 1. 准备一个 1024x1024 的源文件
cp src/assets/avatar.png src/assets/icon-source.png
# 然后手动调整为 1024x1024

# 2. 安装工具
pnpm add -D electron-icon-builder

# 3. 生成所有图标
npx electron-icon-builder --input=./src/assets/icon-source.png --output=./src/assets --flatten
```

## 图标要求

| 平台 | 格式 | 尺寸 | 必需性 |
|------|------|------|--------|
| macOS | .icns | 多分辨率集合 | 可选（无则使用默认） |
| Windows | .ico | 多分辨率集合 | 可选（electron-builder 可生成） |
| Linux | .png | 512x512 | 推荐 |

## 注意事项

1. **图标设计建议**:
   - 使用与游戏主题相符的元素
   - 背景建议使用深色或透明
   - 避免过于复杂的细节（小尺寸时可能看不清）

2. **版权注意**:
   - 确保使用的图标素材不侵犯他人版权
   - 如果使用小说相关元素，请注意版权合规性

3. **测试**:
   - 在不同平台上验证图标显示效果
   - 检查桌面、任务栏、应用切换器等位置的图标清晰度

---

**提示**: 如果暂时不需要自定义图标，可以删除 package.json 中的 `icon` 配置项，electron-builder 会使用默认图标。
