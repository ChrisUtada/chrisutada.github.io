# T.E.C-OS 模块化重构完成

## 📁 当前目录结构

```
tecats.github.io/
├── index.html              # ✅ 原始文件（未修改）
├── index.modular.html      # ✅ 新模块化入口
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
│   └── game.json           # ⚠️ 待填充的游戏数据
│
└── scripts/                # ✅ 辅助脚本目录
    └── extract-data.js     # ✅ 数据提取脚本（需要手动修复）
```

## 🚀 使用方法

### 步骤 1: 提取游戏数据（重要）

由于原始数据包含 Base64 图片，需要手动提取：

1. 用文本编辑器打开 `index.html`
2. 搜索 `const initialProjectData = {` (约第 2413 行)
3. 选中从 `{` 到最后一个 `};` 的所有内容
4. 复制并保存为 `data/game.json`

**提示**: 如果编辑器卡顿，可以：
- 使用 VS Code 的 "折叠所有区域" 功能快速定位
- 使用 Sublime Text 的多选功能
- 直接用命令行提取（见下方）

### 步骤 2: 启动本地服务器

```bash
# Python 3
python -m http.server 8000

# Node.js (需要 npx)
npx serve .

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000/index.modular.html`

### 备用方案: 继续使用原始文件

直接使用 `index.html`，无需任何更改！

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

## 🎮 角色系统

### 角色标签引用

在场景内容中使用 `[char:XXX]` 标签引用场景中的角色：

```
content: "你看到了槿杉和陆珩松在交谈。[char:CHARS_JS] [char:CHARS_luhengs]"
```

### 角色配置

角色配置存储在 `data/game.json` 的 `chars` 对象中：

```json
"CHARS_JS": {
    "name": "槿杉",
    "sceneRef": "[char:CHARS_JS]",
    "itemReactions": {},
    "reactions": {
        "CLUE_js_m1": {
            "text": "线索文本..."
        }
    }
}
```

| 属性 | 说明 |
|------|------|
| `name` | 角色显示名称 |
| `sceneRef` | 场景中引用该角色的标签格式 |
| `itemReactions` | 物品反应配置（key: 物品ID, value: 反应文本/函数） |
| `reactions` | 线索反应配置（key: 线索ID, value: 反应文本/函数） |

### 已配置角色

| 角色 | ID | 支持物品交互 | 支持线索交互 |
|------|-----|------------|------------|
| 槿杉 | CHARS_JS | ❌ | ✅ |
| 陆珩松 | CHARS_luhengs | ✅ | ✅ |
| 傅柏 | NPC_FB | ❌ | ✅ |
| 朱穗 | CHARS_zs | ✅ | ✅ |
| TEC | CHARS_TEC | ✅ | ❌ |

### 向角色出示物品

功能：`executePresentToChar(charId, itemId)`

**工作条件**：
1. 物品已在背包中（已记录）
2. 角色在当前场景中被 `[char:XXX]` 引用
3. 该角色配置了对应的 `itemReactions`

**故障排查**：如果某角色无法响应，检查：
- 该角色在该场景中是否被正确引用
- 是否配置了相应的 `itemReactions`

### 在场景中查找角色

功能：`findCharInScene(charId)`

在当前场景内容中查找是否有对应角色的 `[char:XXX]` 标签，返回布尔值。

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
    "content": "场景内容 [item:ITEM_id] [char:CHARS_xxx]...",
    "desc": "简短描述",
    "hiddenClue": {
        "text": "隐藏线索 [clue:CLUE_id]",
        "ids": ["CLUE_id"]
    }
}
```

### 添加新角色
在 `data/game.json` 的 `chars` 对象中添加：

```json
"CHARS_NEW": {
    "name": "新角色名称",
    "sceneRef": "[char:CHARS_NEW]",
    "itemReactions": {
        "ITEM_id": "对该物品的反应..."
    },
    "reactions": {
        "CLUE_id": {
            "text": "对线索的反应..."
        }
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

## 📋 版本信息

- **游戏版本**: v4.11.0
- **重构日期**: 2026年5月11日
- **模块化后 CSS**: ~15 KB
- **模块化后 JS**: ~25 KB

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
