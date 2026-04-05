# DTAI Gallery · 产品展示页

## 2026-04-06 最终版

---

## 架构概览

```
dtai-gallery/
├── index.html          # 主页面（无需改动）
├── data/
│   └── projects.json    # 所有数据放这里，直接在 GitHub 上编辑即可更新
└── SPEC.md
```

**维护方式**：在 GitHub 上直接编辑 `data/projects.json`，改完 commit 就自动上线。

---

## 数据结构

每个项目字段说明：

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 唯一标识，英文缩写 |
| `name` | ✅ | 显示名称 |
| `type` | ✅ | `Skill` / `插件` / `服务` |
| `scopes` | ✅ | 数组，如 `["Content", "Social Media"]` |
| `highlights` | ✅ | 功能亮点 |
| `version` | 已上线 | 版本号，如 `1.1` |
| `updateDate` | 已上线 | 日期，如 `2026-04-03` |
| `changelog` | 已上线 | 更新日志数组 |
| `qr` | 已上线 | 二维码，`[]` 空数组显示占位符 |

### `_meta.scopes` 筛选项配置

定义「适用于」筛选栏的选项顺序和内容，修改后自动同步。

---

## 三大分类

- **已上线** — 丰富卡片，含版本+日期+更新日志+弹窗二维码
- **开发中** — 简洁卡片，仅名称+亮点
- **个人** — 隐藏菜单，hover 时标签微微显现

---

## 弹窗二维码格式

```json
"qr": [
  { "url": "https://raw.githubusercontent.com/账号/仓库/main/qr.png", "label": "微信扫码" }
]
```

可填多个（如同时有微信和企业微信二维码），留空数组 `[]` 则显示占位符。
