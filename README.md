# T.E.C-OS v5.0.0 更新记录

## 📁 当前目录结构

```
tecats.github.io/
├── index.html              # ✅ 新网站入口（原 welcome.html）
├── cases.html             # ✅ 案件档案库页面
├── garden.html            # ✅ A-001 游戏页面
├── unknown.html           # ✅ A-002 游戏页面
├── README.md               # ✅ 本文档
│
├── css/                    # ✅ CSS目录
│   └── main.css            # ✅ 抽取的样式文件
│
├── js/                     # ✅ JavaScript目录
│   ├── config.js           # ✅ 配置常量
│   ├── utils.js           # ✅ 工具函数
│   ├── gameplay.js         # ✅ 玩法管理器
│   ├── engine.js           # ✅ 核心引擎
│   └── main.js             # ✅ 主入口
│
├── data/                   # ⚠️ 游戏数据目录
│   ├── game.json           # ⚠️ A-001 游戏数据
│   └── game01.json         # ⚠️ A-002 游戏数据
│
├── images/                  # ✅ 游戏图片目录
│   ├── scenes/             # ✅ 场景图片
│   ├── clues/              # ✅ 线索图片
│   └── chars/              # ✅ 角色图片
│
├── server.js               # ✅ 本地服务器脚本
│
└── scripts/                # ✅ 辅助脚本目录
    └── extract-data.js     # ✅ 数据提取脚本
```

## 🖼️ 图片管理

### 图片分离架构

为了优化性能和可维护性，游戏图片不再嵌入JSON数据中，而是存储在独立的 `images/` 文件夹中。

**JSON数据格式**：
```json
{
  "scenes": {
    "S_ENTRANCE": {
      "title": "入口",
      "image": "images/scenes/entrance.png",
      "content": "..."
    }
  },
  "clues": {
    "CLUE_001": {
      "name": "神秘钥匙",
      "image": "images/clues/key.png"
    }
  }
}
```

### 目录结构建议

```
images/
├── scenes/
│   ├── entrance.png
│   ├── corridor.png
│   └── ...
├── clues/
│   ├── key.png
│   ├── note.png
│   └── ...
└── chars/
    ├── character_1.png
    └── ...
```

### 优势

| 方面 | 内嵌Base64 | 独立图片文件 |
|------|-----------|-------------|
| JSON文件大小 | 很大 | 小很多 |
| 浏览器缓存 | ❌ 无效 | ✅ 可独立缓存 |
| 按需加载 | ❌ 一次性加载 | ✅ 可按需加载 |
| 可维护性 | ❌ 难以管理 | ✅ 易于管理 |
| CDN支持 | ❌ 不支持 | ✅ 可使用CDN |

### 编辑工具使用

在剧情编辑工具中配置图片：
1. 将图片文件放入 `images/` 文件夹
2. 在编辑工具中填写图片路径（如 `images/scenes/entrance.png`）
3. 保存后导出JSON

## 🚀 使用方法

### 快速启动

1. 启动本地服务器：
```bash
node server.js
```

2. 访问：`http://127.0.0.1:3000/index.html`

### 游戏流程

```
index.html (欢迎页)
  ↓
cases.html (案件档案库 - 选择案件)
  ↓
garden.html (游戏页面 - A-001)
```

### 多案件架构

每个案件都是独立的 HTML 页面，通过 `caseId` 参数区分存档：
- `A-001` → garden.html
- `A-002` → （待创建）
- 存档键格式：`causal_os_case_{caseId}`

### 启动本地服务器

```bash
# Node.js (推荐)
node server.js

# Python 3
python -m http.server 3000

# PHP
php -S localhost:3000
```

然后访问 `http://localhost:3000/index.html`

## 📝 手动提取命令 (PowerShell)

```powershell
# 复制以下代码到 PowerShell

$html = Get-Content "index.html" -Raw -Encoding UTF8
$start = $html.IndexOf("const initialProjectData = {")
$end = $html.LastIndexOf("};")
$start = $start + "const initialProjectData = ".Length - 1
$data = $html.Substring($start, $end - $start + 1)
$data = $data -replace '\/\*[\s\S]*?\*\/', ''
$data = $data -replace '\/\/.*$', ''
$data = $data.Trim()
$data = '{' + $data
Set-Content "data\game.json" -Value $data -Encoding UTF8
Write-Host "完成！"
```

## 🎯 模块化优势

| 原始 (index.html) | 模块化 (index.modular.html) |
|-------------------|---------------------------|
| ~10 MB 单文件 | CSS/JS 分开加载 |
| 修改需搜索整个文件 | 模块化编辑 |
| 无法共享数据 | JSON 数据可被多个页面使用 |
| 难以自动化构建 | 支持构建工具集成 |

## 🔧 扩展游戏内容

### 添加新场景
在 `data/game.json` 的 `scenes` 对象中添加：

```json
"SCENE_NEW": {
    "title": "场景名称",
    "content": "场景内容 [item:ITEM_id]...",
    "desc": "简短描述",
    "hiddenClue": {
        "text": "隐藏线索 [clue:CLUE_id]",
        "ids": ["CLUE_id"]
    }
}
```

### 添加新结局
在 `data/game.json` 的 `endings` 数组中添加：

```json
{
    "id": "END_EXAMPLE",
    "name": "结局名称",
    "recipe": ["CLUE_ID_1", "CLUE_ID_2"],
    "isTrueCapture": false,
    "message": "结局剧情描述..."
}
```

### 创建新案件

#### 步骤1：准备数据
```
1. 使用剧情编辑工具读取现有的 data/game.json
2. 修改或添加新的场景、物品、角色、线索、结局
3. 导出为新的 JSON 文件（如 data/game-a002.json）
```

#### 步骤2：创建案件页面
复制 `garden.html` 并重命名为 `case-a002.html`，修改数据加载部分：

```html
<script type="module">
import { Engine } from './js/engine.js';

// 修改数据路径
const data = await fetch('./data/game-a002.json').then(r => r.json());

// 修改案件ID
const game = new Engine(data, { caseId: 'A-002' });
</script>
```

#### 步骤3：更新案件档案库
在 `cases.html` 中添加新案件入口：

```html
<div class="case-item" onclick="selectCase('A-002')">
    <div class="case-id">A-002</div>
    <div class="case-title">新案件名称</div>
    <div class="case-status unlocked">已解密</div>
</div>
```

#### 数据关联流程
```
剧情编辑工具 → 导出 JSON → data/game-a002.json → case-a002.html → cases.html
```

## 📋 版本信息

- **游戏版本**: v5.1.0
- **更新日期**: 2026年5月19日
- **前版本**: v5.0.0
- **重构日期**: 2026年5月11日

## 🆕 v5.1.0 更新内容 (2026-05-19)

### 玩法系统优化

#### 密码/组合解锁合并
- ✅ 将 `password`（密码解锁）和 `comboLock`（组合锁）合并为统一的 `password` 玩法
- ✅ 通过 `digits` 参数自动区分显示样式：
  - 不设置位数 → "加密锁定" + "输入授权密钥进行逻辑解构"
  - 设置位数 → "组合锁" + "输入X位组合码"
- ✅ 保留旧数据兼容性：`comboLock` 类型自动使用新逻辑
- ✅ 编辑工具中整合为"密码/组合解锁"选项

#### 条件触发跳转场景
- ✅ 在物品的"出示反应"条件触发配置中添加了"跳转场景"功能
- ✅ 支持在条件满足时自动跳转到指定场景
- ✅ 与触发标记、特殊文本组合使用

**条件触发配置示例**：
```json
{
  "conditionFlags": {
    "ITEM_KEY": {
      "flag": "door_tie",
      "text": "太亮了！！！",
      "scene": "SCENE_SECRET"
    }
  }
}
```

### 数据文件自动加载
- ✅ 根据HTML文件名自动加载对应的游戏数据
- ✅ `garden.html` → `data/game.json`
- ✅ `unknown.html` → `data/game01.json`
- ✅ 其他文件 → 默认加载 `data/game.json`

### 服务器优化
- ✅ 修复URL查询参数处理问题（?case=xxx&fresh=1）
- ✅ 添加路径安全检查，防止路径遍历攻击

### 案件链接优化
- ✅ 修复案件档案库中的跳转问题
- ✅ 每个案件可指定不同的HTML文件和数据

## 🆕 v5.0.0 更新内容 (2026-05-13)

### 文件结构重构
| 原文件名 | 新文件名 | 说明 |
|---------|---------|------|
| welcome.html | index.html | 新网站入口 |
| index.html | garden.html | A-001 游戏页面 |

### 页面优化
- ✅ 按钮中文化："CONNECT_CORE" → "接入因果核心"
- ✅ 按钮样式统一：移除加粗、统一间距
- ✅ 新增"返回档案库"按钮
- ✅ 案件档案库：保留前2个案件，其他显示"档案未解密"
- ✅ 标签颜色优化：初级标签改为绿色 (#669933)

### 游戏内容优化
- ✅ 真名捕获提示：`[ ! FATAL_ERROR: GHOST_SHELL_DECOUPLING ! ]` → `[ ! 因果已锚定：主体正在解离 ! ]`

### 多案件架构
- ✅ 支持多案件独立页面
- ✅ 存档通过 `caseId` 区分，互不干扰
- ✅ URL 参数：`?case=A-001&fresh=1`

### 矩阵状态提示优化
- ✅ 新增 `analyzeMatrixState()` 方法，实时分析矩阵状态
- ✅ 线索放入/移除时自动显示进度提示
- ✅ 显示各结局的匹配进度和未归因类型
- ✅ 真名捕获始终显示在第一位
- ✅ 支持重复类型提示（如"未归因类型：视觉、视觉"）
- ✅ 文案优化："五感已完全归因" → "已完全归因"

**提示格式示例**：
```
[逻辑节点同步完成]
→ 真名捕获：2/5，未归因类型：触觉、嗅觉、味觉
→ 因果链#1：1/3，未归因类型：视觉
→ 因果链#2：2/5，未归因类型：听觉、触觉、嗅觉
```

## ⚠️ 已知问题

1. **数据提取**: Base64 图片数据导致自动提取脚本失败，需要手动提取
2. **CORS 限制**: 本地直接打开 `index.modular.html` 会因 ES Modules 跨域限制失败，需要本地服务器

## 🔄 后续优化方向

- [ ] 添加构建工具 (Vite)
- [ ] 数据拆分为多个 JSON 文件
- [ ] TypeScript 支持
- [ ] 开发专用编辑器
- [ ] 添加单元测试

---

*重构完成！如有问题请提交 Issue。*
