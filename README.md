# SBIT.bad — 恶臭程序员人格测试

一个纯前端、娱乐向、抽象吐槽风格的「恶臭程序员人格测试」网页。项目围绕程序员/研发日常中的摸鱼、装忙、带薪拉屎、周五发版、Jira 工单、会议空转、PPT 汇报、线上事故、咖啡续命等场景，生成 16 种原创恶臭程序员人格结果。

> 本项目仅供娱乐与前端交互实验，不是心理测评、职业诊断或严肃人格分类。

## 在线内容

- 30 道恶臭采样题库，每次随机抽 12 题
- 16 种原创程序员人格结果
- 每种人格对应 1 张生成式抽象图片
- 1000 条程序员风格个性签名
- 测试完成后自动展示结果弹窗
- 支持分享结果链接：`?result=RAGE#sharedView`
- 分享链接进入后展示单独的结果查看页，并引导访客重新采样
- 支持暗黑/明亮模式
- 支持 3D 今日上班情绪环形转盘
- 支持代码雨、终端采样日志、人格预判、结果 glitch reveal、粒子爆炸、3D 结果卡翻转等交互效果

## 项目结构

```text
.
├── index.html          # 主页面，包含 HTML/CSS/JS 交互逻辑
├── data/               # 可编辑题库和个性签名配置
│   ├── questions.js    # 30 题题库，每次随机抽 12 题
│   └── signatures.js   # 个性签名种子和生成配置
├── sbit-assets/        # 16 张人格结果图片
├── start.command       # macOS 本地启动脚本
└── README.md           # 项目说明
```


## 原创仓库

原创仓库地址：<https://github.com/scarea/sbti>

如果你要二次开发、魔改题库或部署自己的版本，建议先 Fork 原仓库，再在自己的仓库中修改。

## Fork 与二次开发

### 1. Fork 仓库

打开原创仓库：

```text
https://github.com/scarea/sbti
```

点击右上角 `Fork`，复制到你自己的 GitHub 账号下。

### 2. 克隆到本地

```bash
git clone https://github.com/你的用户名/sbti.git
cd sbti
```

### 3. 新增题目

编辑：

```text
data/questions.js
```

复制一个已有题目对象，修改 `text` 和 4 个 `choices` 即可。每个选项结构如下：

```js
{
  title: "选项标题",
  note: "选项吐槽说明",
  score: { M: 2, F: 1 }
}
```

可用分数维度：

| Key | 含义 |
| --- | --- |
| M | 摸鱼 |
| L | 劳模/执行 |
| Z | 装忙/汇报 |
| S | 清醒/理性 |
| D | 躲避/厕所/离席 |
| J | 工单/流程/假性卷 |
| F | 反骨/反抗 |
| R | 认命/顺从 |

题库可以继续扩展，不需要改页面逻辑；页面会自动从题库中随机抽 12 题。

### 4. 新增个性签名

编辑：

```text
data/signatures.js
```

常用改法：

- 给某个人格的 `signatureSeeds.CODE` 增加短句。
- 给 `globalSignatureSeeds` 增加全局签名。
- 高阶改法：调整 `signatureProfiles` 中的 `subject / verb / tail`，让系统自动组合更多句子。

示例：

```js
IMFW: [
  "今天不是我在写代码，是键盘拖着尸体走。",
  "新增一句你自己的抽象签名。"
]
```

### 5. 提交修改

```bash
git add .
git commit -m "Customize SBIT content"
git push
```

## 一键托管

你可以直接把原创仓库一键部署到免费平台，也可以先 Fork 后部署自己的版本。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/scarea/sbti)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scarea/sbti)

如果你已经 Fork 到自己的账号，部署时把 `repository-url` 换成自己的仓库地址即可。

## 本地运行

### 方式一：直接打开

双击打开：

```text
index.html
```

### 方式二：启动本地静态服务

```bash
cd /Users/awen/code/sbti
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

也可以双击：

```text
start.command
```

## 部署方式

这是一个纯静态站点，不需要后端、不需要数据库、不需要构建步骤。把仓库中的以下内容部署到任意静态托管平台即可：

```text
index.html
data/
sbit-assets/
README.md
start.command
```

### 推荐平台

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
- Nginx 静态目录
- 任意对象存储 + CDN

### GitHub Pages 部署

1. 将本项目提交到 GitHub 仓库，或 Fork 原创仓库。
2. 打开仓库 `Settings` → `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待部署完成。
6. 获得类似下面的访问地址：

```text
https://你的用户名.github.io/sbti/
```

### Vercel / Netlify 部署

1. 新建项目。
2. 选择本仓库，或直接拖拽整个项目文件夹。
3. Framework 选择 `Other` / `Static`。
4. Build Command 留空。
5. Output Directory 留空或填写 `.`。
6. 部署完成后得到公网链接。

## 分享结果链接

部署到公网后，用户测试完成并点击「分享链接」，会生成类似下面的 URL：

```text
https://你的域名/index.html?result=RAGE#sharedView
```

朋友打开后会直接看到分享者的结果页，而不是重新进入弹窗；页面会引导朋友点击「我也要采样」。

> 注意：本地 `file:///Users/...` 链接不能作为公网分享链接。只有部署到 `http://` 或 `https://` 后，分享链接才适合发给朋友。

## 当前人格类型

| Code | 中文名 | 简述 |
| --- | --- | --- |
| IMFW | 我是废物 | 低功耗生存，TODO 像墓志铭 |
| TOIL | 带薪厕游者 | 把卫生间开发成第二办公区 |
| PPTX | 汇报幻术师 | 用 PPT 把空进度排版得很高级 |
| AFKW | 离席幽灵 | 头像在线，灵魂离席 |
| DEAD | 死线诈尸 | deadline 前自动复活 |
| DRNK | 咖啡酒鬼 | 靠咖啡因和报错维持人形 |
| JIRA | 工单囚徒 | 被泳道、标签、优先级驯化 |
| MEET | 会议浮尸 | 肉身点头，灵魂卸载 |
| CRUD | 增删改查牲口 | 被表格、字段和后台管理饲养 |
| HHHH | 傻乐者 | 用哈哈哈给崩溃打补丁 |
| BUGG | 虫洞守夜人 | 在异常栈里闻到腐味 |
| PUSH | 强推战士 | 相信 git push 能解决命运 |
| NULL | 空心打工人 | 情绪返回 null |
| RAGE | 静音反贼 | 嘴上好的，心里写满组织罪状 |
| OKOK | 好的呢奴隶 | 把拒绝编译成收到 |
| NORM | 正常人 | 极危稀有物种，建议保护 |

## 设计与交互参考

本项目是原创的程序员吐槽主题再创作，没有复制参考站点的源码、图片或文案。产品形态和交互灵感参考了以下方向：

- [SBTI 人格测试](https://www.sbti.ai/)：娱乐向人格测试、短代码人格结果、结果分享与隐私说明。
- [SBTI 人格测试 - 人格测试](https://www.sbtitest.com/)：中文互联网语境下的抽象人格标签、轻量测试体验。
- [SBTI人格测试 | 结构化人格娱乐测试](https://www.sbti-test.org/)：结构化题目、结果匹配、娱乐测评信息架构。
- [Apple 官网](https://www.apple.com/)：大标题、滚动叙事、产品展示式视觉节奏。
- [小米官网](https://www.mi.com/)：消费级产品页的卡片式展示、强视觉卖点排版。
- [Claude 官网](https://claude.ai/)：简洁信息架构、克制但有品牌感的落地页表达。
- 程序员社区与常见梗文化：Jira、CRUD、周五发版、线上事故、橡皮鸭调试、Stack Overflow、996、摸鱼、带薪拉屎等。

## AI 生成声明

- 原创仓库为 <https://github.com/scarea/sbti>。
- 本项目全部代码由 AI 生成并迭代完成，包括 HTML、CSS、JavaScript、交互逻辑、文案结构与 README。
- 项目中的人格图片为 AI 生成图片资产，用于本娱乐项目的视觉呈现。
- 文案为 AI 基于用户需求生成和改写，主题围绕「恶臭程序员」「年轻人丧感」「职场反讽」「研发热梗」。
- 本项目未接入后端服务，不收集、不上传、不存储用户答题数据。

## 隐私说明

- 答题结果在浏览器本地计算。
- 分享结果通过 URL 查询参数携带结果代码，例如 `?result=RAGE`。
- 页面没有登录、埋点、数据库或远程 API。
- 如果部署平台自带访问日志或统计能力，请以对应平台说明为准。

## 免责声明

- 本项目仅用于娱乐、前端交互展示和创意实验。
- 测试结果不具备心理学、医学、职业评估或管理学意义。
- 页面中对职场、程序员、研发流程的吐槽均为夸张化表达，请勿当作现实评价依据。

## License

未指定开源许可证前，默认保留所有权利。若需要开源发布，建议后续补充 MIT / Apache-2.0 / CC BY-NC 等许可证说明。
