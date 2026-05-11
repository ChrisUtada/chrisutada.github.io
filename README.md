# T.E.C-OS 模块化重构完成

## 📁 当前目录结构

```
tecats.github.io/
├── index.html                  # ✅ 主入口文件
├── README.md                   # ✅ 本文档
│
├── assets/                     # ✅ 资源目录（图片/音频等）
│
├── css/                        # ✅ CSS目录
│   └── main.css               # ✅ 样式文件
│
├── js/                         # ✅ JavaScript目录
│   ├── config.js              # ✅ 配置常量
│   ├── utils.js              # ✅ 工具函数
│   ├── gameplay.js           # ✅ 玩法管理器
│   ├── engine.js             # ✅ 核心引擎
│   └── main.js               # ✅ 主入口
│
├── data/                       # ✅ 游戏数据目录
│   └── game.json             # ✅ 游戏数据
│
└── scripts/                   # ✅ 辅助脚本目录
    └── extract-data.js        # ✅ 数据提取脚本
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

然后访问 `http://localhost:8000/index.html` 

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

## 🎮 命令行系统

### 支持的命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `查询 [关键字]` | 搜索线索/物品/场景/角色 | `查询 手电筒` |
| `查询 物品档案` | 查看当前背包物品 | `查询 物品档案` |
| `前往 [场景名]` | 切换到指定场景 | `前往 便利店` |
| `捕获 [目标]` | 捕获场景/物品/角色的隐藏线索 | `捕获 黑影` |
| `出示 [物品] [目标]` | 向角色或场景物品出示物品 | `出示 手电筒 黑影` |
| `检查更新` / `更新` | 手动检查编辑器更新 | `检查更新` |

### 出示物品功能

**格式**: `出示 [物品名] [目标名]`

**支持的出示组合**:
1. **向角色出示** - 背包物品 + 场景中的角色
2. **向场景物品出示** - 背包物品 + 场景中的物品

**示例**:
```
出示 手电筒 黑影      # 向"黑影"这个角色出示手电筒
出示 钥匙 保险箱      # 向"保险箱"这个场景物品出示钥匙
```

**故障排查**:
- 确保物品已在背包中（需要先"记录"物品）
- 确保目标在当前场景中
- 确保目标配置了对应的反应

## 👤 角色系统

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
| `itemReactions` | 物品反应配置（key: 物品ID, value: 反应对象） |
| `reactions` | 线索/通用反应配置 |

### 物品反应配置

```json
"itemReactions": {
    "ITEM_id": {
        "text": "对该物品的反应文本...",
        "image": "可选的图片URL",
        "audio": "可选的音频URL",
        "results": {
            "flags": ["FLAG_ID"],
            "scene": "SCENE_ID",
            "items": ["ITEM_ID"],
            "message": "可选的提示消息"
        }
    }
}
```

### 已配置角色

| 角色 | ID | 支持物品交互 | 支持线索交互 |
|------|-----|------------|------------|
| 槿杉 | CHARS_JS | ❌ | ✅ |
| 陆珩松 | CHARS_luhengs | ✅ | ✅ |
| 傅柏 | NPC_FB | ❌ | ✅ |
| 朱穗 | CHARS_zs | ✅ | ✅ |
| TEC | CHARS_TEC | ✅ | ❌ |

## 📦 场景物品系统

### 场景物品反应

场景物品也可以配置 `presentReactions` 来响应出示的物品：

```json
"ITEM_safe": {
    "label": "保险箱",
    "desc": "一个老旧的保险箱",
    "presentReactions": {
        "ITEM_key": {
            "text": "钥匙插入锁孔，发出咔嗒声...",
            "results": {
                "flags": ["safe_opened"],
                "items": ["ITEM_document"]
            }
        }
    }
}
```

## 🔄 编辑器同步

游戏支持与外部编辑器实时同步数据：

- 使用 `BroadcastChannel` 实时推送更新
- 降级支持 `localStorage` 检查更新
- 检测到更新后会提示用户是否加载
- 命令行输入 `检查更新` 可手动检查

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
    "content": "场景内容 [item:ITEM_id] [char:CHARS_xxx] [loc:LOC_id]...",
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
        "ITEM_id": {
            "text": "对该物品的反应...",
            "results": {}
        }
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

### 添加真结局
设置 `isTrueCapture: true`，并添加 `lines` 数组：

```json
{
    "id": "END_TRUE",
    "name": "真相",
    "recipe": ["CLUE_TRUE_1", "CLUE_TRUE_2"],
    "isTrueCapture": true,
    "lines": [
        { "text": "第一行文字", "delay": 0 },
        { "text": "第二行文字", "delay": 2000 }
    ],
    "message": "结局结语..."
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
