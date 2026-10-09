# SBIT.bad — 恶臭程序员人格测试

一个纯前端、娱乐向、抽象吐槽风格的「恶臭程序员人格测试」网页。项目围绕程序员/研发日常中的摸鱼、装忙、带薪拉屎、周五发版、Jira 工单、会议空转、PPT 汇报、线上事故、咖啡续命等场景，生成 24 种原创程序员馊味人格结果，全站 3D 交互。

> 本项目仅供娱乐与前端交互实验，不是心理测评、职业诊断或严肃人格分类。

## 在线访问

- 在线体验：<https://scarea.github.io/sbti/>
- 原创仓库：<https://github.com/scarea/sbti>
- 示例分享页：<https://scarea.github.io/sbti/r/rage.html>

## 在线内容

- 66 道题库，每次随机抽 12 题，选项顺序也随机打乱；选完弹出一句即时吐槽
- 24 种原创程序员馊味人格，按出现率分 UR / SSR / SR / R / N 五档稀有度：口头禅、临床症状、隐藏天赋、致命 bug、适合岗位、本命 commit、生存指南、最佳搭档与天敌
- 余弦相似度计分 + 自动校准，出现率由模拟得出（不是手写的假数据）
- 1199 条手写个性签名（每种人格 40+ 条 + 182 条通用）
- 结果页：3D 收藏卡（飞入落地、拖动旋转、翻到背面看雷达）、Top 3 相似度、今日签名
- 一键生成 1080×1920 分享海报（手机长按保存）
- 挑战链接：朋友打开后能测自己，并看到两人的「馊味兼容度」
- 每种人格独立的分享页 `r/<code>.html`，带 Open Graph 预览图
- 全站 3D：合成波网格地面、可拖动的人格立方体、3D 标题、滚动翻入、卡片指针倾斜
- 3D 人格转盘：拖拽惯性、点击定位、抽今日人格
- 馊味盲盒：3D 卡包撕开、5 张卡飞出逐张翻牌，按出现率掉落，带保底；抽到的收进图鉴
- 图鉴：悬停 3D 翻面，记录收集进度（保存在本地浏览器）
- 彩蛋：秒答检测、全选同一项、按时段变化的文案、点 logo 5 次、键盘输入 sudo
- 暗黑/明亮模式，支持 prefers-reduced-motion，动画离屏自动暂停

## 项目结构

```text
.
├── index.html               # 页面骨架
├── css/app.css              # 基础样式
├── css/3d.css               # 3D 效果样式
├── js/
│   ├── engine.js            # 计分引擎（浏览器和 Node 共用）
│   ├── app.js               # 页面交互：答题、结果、分享、图鉴
│   ├── fx3d.js              # 3D 工具：倾斜、滚动翻入、立方体
│   ├── gacha.js             # 3D 盲盒抽卡
│   ├── ring.js              # 3D 人格转盘
│   └── poster.js            # canvas 分享海报
├── data/
│   ├── questions.js         # 题库
│   ├── types.js             # 24 种人格设定 + 组合文案
│   └── signatures.js        # 个性签名
├── assets/
│   ├── types/*.webp         # 人格图（页面用）
│   └── og/*.jpg             # 分享预览图
├── r/*.html                 # 每种人格的分享落地页（脚本生成）
├── scripts/
│   ├── calibrate.mjs        # 校准结果分布
│   └── build-share-pages.mjs# 生成 r/*.html
└── start.command            # macOS 本地启动脚本
```

## 计分原理

1. 每题每个维度先算出「随机作答」时的期望和方差，把你的得分换算成偏离随机的程度（类似 z 分数）。
2. 拿这 8 维向量和每种人格的倾向（`weights`，去中心化后）做余弦相似度。
3. 再加上每种人格的 `bias`，取最高分。`bias` 由 `scripts/calibrate.mjs` 自动调，让随机作答时的结果分布接近 `target`；校准后的实际出现率写进 `rarity`，页面直接读取，并据此划分稀有度档位和盲盒掉率。

**改了题库或人格权重之后，务必重新校准：**

```bash
node scripts/calibrate.mjs --write
```

不加 `--write` 只打印当前分布。改了人格名称或副标题，再跑一下 `node scripts/build-share-pages.mjs` 更新分享页（第一个参数可以传你自己的站点地址）。

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

编辑 `data/questions.js`，复制一个题目对象，修改 `text` 和 4 个 `choices`。每个选项：

```js
{ title: "选项标题", note: "选项副注", quip: "选中后的吐槽", score: { M: 2, F: 1 } }
```

建议每个选项分值总和为 3，同一题 4 个选项的主维度互不相同。可用维度：

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

加完题记得跑 `node scripts/calibrate.mjs --write`。

### 4. 新增个性签名

编辑 `data/signatures.js`，往对应人格的数组（或 `GLOBAL`）里加句子即可，页面直接读取，无需生成。

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
css/  js/  data/  assets/  r/
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
https://你的域名/r/rage.html
```

朋友打开后先看到分享者的结果，测完自己的会自动显示两人的馊味兼容度。旧格式 `?result=RAGE` 仍然兼容。

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
| LGTM | 盲审菩萨 | 几万行 diff 也是一句 LGTM |
| PRMT | 提示词巫师 | Prompt 念得比代码写得好 |
| ROLL | 回滚之神 | 先回滚再说 |
| LEET | 刷题隐士 | 工作窗口下藏着算法题 |
| LGCY | 屎山考古学家 | 能读懂 2009 年的注释 |
| FIRE | 救火队长 | 告警就是闹钟 |
| ARCH | 架构空谈家 | 白板满了，文件夹空了 |
| OVTM | 加班表演家 | 23:59 截图发给老板 |

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
- 项目中的人格图片为 AI 生成图片资产，用于本娱乐项目的视觉呈现（新增 8 种通过 Pollo 平台 gpt-image 生成）。
- 文案为 AI 基于用户需求生成和改写，主题围绕「恶臭程序员」「年轻人丧感」「职场反讽」「研发热梗」。
- 本项目未接入后端服务，不收集、不上传、不存储用户答题数据。

## 隐私说明

- 答题结果在浏览器本地计算。
- 分享结果通过 URL 携带结果代码，例如 `r/rage.html` 或 `?r=RAGE`。
- 主题偏好、上次结果代码和图鉴收集进度保存在浏览器 localStorage，不会上传。
- 页面没有登录、埋点、数据库或远程 API。
- 如果部署平台自带访问日志或统计能力，请以对应平台说明为准。

## 免责声明

- 本项目仅用于娱乐、前端交互展示和创意实验。
- 测试结果不具备心理学、医学、职业评估或管理学意义。
- 页面中对职场、程序员、研发流程的吐槽均为夸张化表达，请勿当作现实评价依据。

## License

未指定开源许可证前，默认保留所有权利。若需要开源发布，建议后续补充 MIT / Apache-2.0 / CC BY-NC 等许可证说明。
