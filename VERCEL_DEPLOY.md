# Vercel + Coze 接入说明

这个项目现在已经改成：

- 前端浮窗：`index.html`
- 后端代理：`api/coze-chat.js`
- 部署平台：Vercel

## 1. 先处理 Coze Token

不要继续使用之前发在聊天里的那枚 PAT。

请在 Coze 后台重新生成一枚新的 PAT，并只放到 Vercel 环境变量里，不要写进代码。

## 2. 在 Vercel 导入这个 GitHub 仓库

导入后，不需要额外配置构建框架。

Vercel 会同时托管：

- 静态页面 `index.html`
- 服务端接口 `/api/coze-chat`

## 3. 在 Vercel 里配置环境变量

需要这 3 个：

- `COZE_API_TOKEN`
- `COZE_BOT_ID`
- `COZE_ALLOWED_ORIGIN`

示例：

- `COZE_API_TOKEN=你的新PAT`
- `COZE_BOT_ID=你的Coze Bot ID`
- `COZE_ALLOWED_ORIGIN=https://你的-vercel-域名.vercel.app`

## 4. 重新部署

环境变量保存后，点击 Redeploy。

## 5. 如果你还想继续保留 GitHub Pages

默认代码会请求同域名下的 `/api/coze-chat`，所以最省事的方法是直接把整站切到 Vercel。

如果你坚持前端继续放在 GitHub Pages，那么需要在页面里额外配置：

```html
<script>
  window.__DTAI_COZE_PROXY_ENDPOINT__ = 'https://你的-vercel-域名.vercel.app/api/coze-chat';
</script>
```

并把这段放到主脚本执行之前。
