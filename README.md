# T.E.C-OS v5.0.0

> **因果重构系统 | 异动区域锁定协议**

一个基于 Web 的交互式叙事游戏引擎，支持多案件架构、线索收集、真名捕获等核心玩法。

---

## 📖 项目简介

T.E.C-OS（Tactical Evidence Collection - Operating System）是一款沉浸式探案解谜游戏的运行时系统。玩家扮演调查员，通过指令交互、线索出示、矩阵归因等方式揭示真相，完成对"真名"的捕获。

### 核心特性

- 🎮 **指令驱动交互**：使用自然语言命令与游戏世界互动
- 🔍 **线索收集系统**：探索场景、发现隐藏线索
- 🧩 **矩阵归因玩法**：将线索按五感类型归类，解锁结局
- 🎭 **多案件架构**：支持独立案件页面和存档隔离
- 🖼️ **图片外置优化**：头像和场景图片独立存储，JSON 数据压缩率达 99.4%
- 💾 **本地存档**：基于 localStorage 的案件进度保存

---

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome、Firefox、Edge 等）
- 本地 HTTP 服务器（用于开发调试）

### 启动方式

#### 方法一：Node.js 服务器（推荐）

```bash
# 进入项目目录
cd /workspace

# 启动服务器
node server.js

# 访问游戏
# 打开浏览器访问 http://127.0.0.1:3000/index.html
```

#### 方法二：Python 内置服务器

```bash
# Python 3
python -m http.server 3000

# 访问 http://localhost:3000/index.html
```

#### 方法三：PHP 内置服务器

```bash
php -S localhost:3000

# 访问 http://localhost:3000/index.html
```

---

## 📁 项目结构

```
/workspace/
├── index.html                 # 网站入口（欢迎页）
├── cases.html                 # 案件档案库页面
├── garden.html                # A-001 案件游戏页面
├── unknown.html               # A-002 案件游戏页面
├── 剧情编辑工具 ver2.0.html   # 可视化剧情编辑器
│
├── css/
│   └── main.css               # 全局样式表
│
├── js/
│   ├── config.js              # 配置常量（版本号、颜色、延迟等）
│   ├── utils.js               # 工具函数（HTML 转义、正则处理等）
│   ├── gameplay.js            # 玩法管理器（密码锁、矩阵等）
│   ├── engine.js              # 核心引擎（状态管理、指令解析）
│   └── main.js                # 主入口初始化
│
├── data/
│   ├── game.json              # A-001 案件数据（场景、角色、线索等）
│   └── game01.json            # A-002 案件数据
│
├── images/
│   ├── avatar_CHARS_JS.png    # 角色头像：槿杉
│   ├── avatar_CHARS_TEC.png   # 角色头像：TEC
│   ├── avatar_CHARS_luhengs.png # 角色头像：陆珅松
│   └── avatar_CHARS_zs.png    # 角色头像：助手
│
├── scripts/
│   ├── extract-data.js        # 数据提取脚本
│   └── extract-avatars.js     # 头像提取脚本
│
├── 游戏数据总览.md             # 游戏数据文档
└── README.md                  # 本文档
```

---

## 🎮 游戏玩法

### 基础指令

| 指令格式 | 说明 | 示例 |
|---------|------|------|
| `查询 <对象>` | 查看对象信息 | `查询 真名` |
| `捕获 <线索>` | 收集线索到矩阵 | `捕获 初级调查员证` |
| `出示 <物品> <目标>` | 向目标出示物品 | `出示 手电筒 黑影` |
| `前往 <地点>` | 移动到指定场景 | `前往 植物学家的花园` |
| `查询 cmd` | 查看帮助信息 | `查询 cmd` |

### 高级功能

#### 双向出示支持
```
出示 手电筒 黑影   ✅
出示 黑影 手电筒   ✅ （效果相同）
```

#### 矩阵归因
将捕获的线索按五感类型（视觉、听觉、触觉、嗅觉、味觉）归类，完成归因后可解锁不同结局。

#### 真名捕获
通过线索组合揭示事件真相，完成真名捕获（True Capture）。

---

## 🛠️ 开发指南

### 创建新案件

#### 步骤 1：准备游戏数据

使用**剧情编辑工具**（`剧情编辑工具 ver2.0.html`）：
1. 在浏览器中打开编辑工具
2. 读取现有 JSON 或从头创建
3. 添加场景、角色、物品、线索、结局
4. 导出为新的 JSON 文件（如 `data/game-a002.json`）

#### 步骤 2：创建案件页面

复制 `garden.html` 并重命名（如 `case-a002.html`），修改数据加载：

```html
<script type="module">
import { Engine } from './js/engine.js';

// 加载对应数据文件
const data = await fetch('./data/game-a002.json').then(r => r.json());

// 初始化引擎，指定案件 ID
const game = new Engine(data, { caseId: 'A-002' });
game.init();
</script>
```

#### 步骤 3：更新案件档案库

在 `cases.html` 中添加新案件入口：

```html
<div class="case-item" onclick="selectCase('A-002')">
    <div class="case-id">A-002</div>
    <div class="case-title">新案件名称</div>
    <div class="case-status unlocked">已解密</div>
</div>
```

### 添加新场景

在 `data/game.json` 的 `scenes` 对象中添加：

```json
"SCENE_NEW": {
    "title": "场景名称",
    "content": "场景描述内容 [item:ITEM_id][char:CHAR_id]...",
    "desc": "简短描述",
    "hiddenClue": {
        "text": "隐藏线索文本 [clue:CLUE_id]",
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

### 图片资源管理

#### 图片路径格式

```json
{
    "chars": {
        "CHARS_JS": {
            "name": "槿杉",
            "avatar": "images/avatar_CHARS_JS.png"
        }
    },
    "scenes": {
        "SCENE_START": {
            "image": "images/scenes/start.png"
        }
    }
}
```

#### 提取头像脚本

使用 `scripts/extract-avatars.js` 自动从 JSON 中提取 Base64 头像为独立文件。

---

## 📊 数据格式

### 场景数据结构

```json
{
    "scenes": {
        "SCENE_ID": {
            "title": "场景标题",
            "content": "场景内容（支持[item:]、[char:]、[loc:]标签）",
            "desc": "简短描述",
            "hiddenClue": {
                "text": "发现线索时的提示文本",
                "ids": ["CLUE_ID"]
            },
            "canBePicked": true
        }
    }
}
```

### 角色数据结构

```json
{
    "chars": {
        "CHAR_ID": {
            "name": "角色名称",
            "avatar": "images/avatar_CHAR_ID.png",
            "dialogues": [...],
            "itemReactions": {...}
        }
    }
}
```

### 线索数据结构

```json
{
    "clues": {
        "CLUE_ID": {
            "name": "线索名称",
            "type": "visual|hearing|touch|smell|taste",
            "description": "线索描述"
        }
    }
}
```

---

## 🔧 配置说明

### config.js 核心配置

```javascript
{
    VERSION: 'v5.0.0',           // 版本号
    SAVE_KEY: 'causal_os_save',  // 存档键前缀
    COLORS: {...},               // UI 颜色配置
    DELAYS: {...},               // 动画延迟（毫秒）
    LOG: {...},                  // 日志配置
    MENU: {...},                 // 菜单配置
    EDITOR_SYNC: {...}           // 编辑器同步配置
}
```

### 存档机制

- 存档键格式：`causal_os_case_{caseId}`
- 每个案件独立存档，互不干扰
- URL 参数支持：`?case=A-001&fresh=1`（强制新游戏）

---

## 🆕 版本历史

### v5.1.1 (2026-05-20)
- ✅ 头像图片外置，JSON 体积压缩 99.4%
- ✅ 出示命令支持双向匹配
- ✅ 修复角色反应字段兼容性问题

### v5.1.0 (2026-05-19)
- ✅ 密码/组合解锁玩法合并
- ✅ 条件触发跳转场景功能
- ✅ 数据文件自动加载（根据 HTML 文件名）
- ✅ 服务器 URL 参数处理优化

### v5.0.0 (2026-05-13)
- ✅ 文件结构重构（welcome.html → index.html）
- ✅ 多案件架构支持
- ✅ 矩阵状态实时提示
- ✅ UI 中文化优化

---

## ⚠️ 已知问题

1. **数据提取**：Base64 图片数据导致自动提取脚本可能失败，建议手动提取
2. **CORS 限制**：直接打开 HTML 文件会因 ES Modules 跨域限制失败，必须使用本地服务器

---

## 🔮 后续优化方向

- [ ] 引入构建工具（Vite/Webpack）
- [ ] 数据拆分为多个 JSON 文件按需加载
- [ ] TypeScript 类型支持
- [ ] 专用剧情编辑器 IDE
- [ ] 单元测试覆盖
- [ ] 移动端适配优化

---

## 📄 许可证

本项目仅供学习和研究使用。

---

## 👥 贡献指南

如有问题或建议，请提交 Issue 或 Pull Request。

---

*最后更新：2026 年 5 月 20 日 | 版本：v5.1.1*
