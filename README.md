# T.E.C-OS v5.0.0 更新记录

## 📁 当前目录结构

```
tecats.github.io/
├── index.html              # ✅ 新网站入口（原 welcome.html）
├── cases.html             # ✅ 案件档案库页面
├── garden.html            # ✅ A-001 游戏页面（原 index.html）
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
│   └── game.json           # ⚠️ 游戏数据
│
└── scripts/                # ✅ 辅助脚本目录
    └── extract-data.js     # ✅ 数据提取脚本
```

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

## 📋 版本信息

- **游戏版本**: v5.0.0
- **更新日期**: 2026年5月13日
- **前版本**: v4.11.0
- **重构日期**: 2026年5月11日

## 🆕 v5.0.0 更新内容

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
