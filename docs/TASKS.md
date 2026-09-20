# 分工与任务清单

> 本文件是项目进度的**唯一事实来源**。Codex 每个 PR 必须同步更新下面的状态表。
> 状态：`todo` 未开始 · `doing` 进行中 · `review` 待验收 · `done` 已合并 · `blocked` 被依赖卡住

## 0. 三方分工

| 角色 | 职责 | 不做什么 |
|---|---|---|
| **Claude（架构 / 制片）** | 参考站拆解；技术选型与架构；可运行骨架；任务卡与验收标准；素材规范；里程碑节点的代码审查；应要求起草英文文案初稿、给动效调参意见 | 不做逐任务的细节实现 |
| **Codex（实现工程师）** | 按任务卡逐个实现；写/补单测；每个 PR 跑通 `npm run check`；更新状态表 | 不改架构契约；不编造产品文案/功效；不擅自加依赖和第三方请求 |
| **Alan 团队（甲方 / 素材 / 验收）** | 标签平铺图、包装尺寸、品牌资产、定稿文案（含合规审核）、域名与账号、每个 PR 的预览验收 | 不需要写代码 |

### 给 Codex 派活的指令模板

```
Read AGENTS.md and docs/ARCHITECTURE.md first.
Then implement task T## from docs/TASKS.md exactly as specified.
Stay within the card's Scope. Run `npm run check` before finishing.
Open a PR titled "T##: <card title>", paste the acceptance list into the PR body with every
item ticked or explained, and update the status table in docs/TASKS.md.
```

一次只派一张卡。有依赖的卡，等依赖 `done` 再派。

## 1. 状态表

| ID | 任务 | 负责人 | 里程碑 | 依赖 | 状态 |
|---|---|---|---|---|---|
| C01 | 参考站逐幕拆解 | Claude | M0 | — | done |
| C02 | 架构设计 + 可运行骨架（5 幕 + FAQ + Outro） | Claude | M0 | C01 | done |
| C03 | 任务卡 / 素材规范 / 验收清单 / AGENTS.md | Claude | M0 | C02 | done |
| A01 | 标签平铺图（每 SKU 一张） | Alan 团队 | M1 | — | todo |
| A02 | 包装实测尺寸表 + 包装形态确认 | Alan 团队 | M1 | — | todo |
| A03 | 品牌资产：Logo / 品牌色 / 字体授权 | Alan 团队 | M1 | — | todo |
| A04 | 英文文案定稿（含合规审核） | Alan 团队 | M1 | — | todo |
| A05 | 域名、托管账号、法律主体与法务页面文本 | Alan 团队 | M5 | — | todo |
| A06 | 音效素材（可选） | Alan 团队 | M3 | — | todo |
| A07 | 每个 PR 的预览验收 | Alan 团队 | 持续 | T01 | todo |
| T01 | 工程基建：Lint / 格式化 / CI / 预览部署 | Codex | M1 | — | todo |
| T02 | 接入真实标签与包装尺寸 | Codex | M1 | A01 A02 | todo |
| T03 | 接入定稿文案 + 占位内容守卫 | Codex | M1 | A04 | todo |
| T04 | 字体、Logo 与品牌令牌 | Codex | M1 | A03 | todo |
| T05 | 包装模型与材质精修 | Codex | M2 | T02 | todo |
| T06 | WebGL 背景着色器 | Codex | M2 | T01 | todo |
| T07 | 文字动效 | Codex | M2 | T04 | todo |
| T08 | 首屏选品环打磨 | Codex | M2 | T01 | todo |
| T09 | 卖点标签高亮 | Codex | M2 | T02 | todo |
| T10 | 全家福打磨 | Codex | M2 | T01 | todo |
| T11 | Loader 与开场 | Codex | M3 | T04 | todo |
| T12 | 音效系统 | Codex | M3 | T01 | todo |
| T13 | 移动端适配 | Codex | M3 | T05 T08 T10 | todo |
| T14 | 全屏菜单与导航 | Codex | M3 | T04 | todo |
| T15 | 性能分级与预算 | Codex | M4 | T05 T06 | todo |
| T16 | 无障碍 | Codex | M4 | T07 T14 | todo |
| T17 | WebGL 降级与错误边界 | Codex | M4 | T02 | todo |
| T18 | 视觉回归进 CI | Codex | M4 | T01 | todo |
| T19 | SEO、社交分享与预渲染 | Codex | M5 | T03 A05 | todo |
| T20 | 法务页面、Cookie 与统计 | Codex | M5 | A05 | todo |
| T21 | 部署上线 | Codex | M5 | T15 T16 T17 T19 T20 | todo |
| T22 | （可选）无缝循环回首屏 | Codex | M5+ | T08 | todo |
| C04 | （按需）英文文案初稿，交 Alan 团队过合规 | Claude | M1 | — | todo |
| C05 | （按需）M2 / M4 结束时的架构审查 | Claude | M2 M4 | — | todo |
| C06 | （按需）逐幕动效调参意见 | Claude | M2 | T05–T10 | todo |

**里程碑**：M0 骨架 ✅ → M1 真内容进站 → M2 视觉与动效 → M3 体验完整 → M4 质量 → M5 上线。
**关键路径**：A01/A02 → T02 → T05/T09 → T13 → T15 → T21。**素材（A01–A04）是全项目最大的阻塞项，建议本周就启动。** T01、T06、T08、T10 不依赖素材，可以立刻并行开工。

---

## 2. Alan 团队任务

### A01 · 标签平铺图
- **交付**：每个 SKU 一张完整一圈的标签展开图，规格见 `docs/ASSETS.md` §1。
- **验收**：正面居中、无出血/刀线、宽 ≥ 2048px、sRGB；背标小字清晰。

### A02 · 包装实测尺寸表 + 包装形态确认
- **交付**：`docs/ASSETS.md` §2 的表格 + 实物照片。
- **特别确认**：4X 精氨酸是否罐装；全线有没有袋装/盒装/异形（有 → 需要 GLB 或改方案，越早说越好）。

### A03 · 品牌资产
- **交付**：Logo SVG、品牌色、每 SKU 主题色、字体 WOFF2 + 网页授权证明；规格见 `docs/ASSETS.md` §3。

### A04 · 英文文案定稿
- **交付**：按 `docs/ASSETS.md` §4 的字段清单给定稿；**每一句都过合规**（见 `docs/CHECKLIST.md` §5）。
- **可选**：先让 Claude 出初稿（C04），团队再审改。

### A05 · 域名、账号、法务
- **交付**：正式域名（⚠️ 之前品牌审计里 auravigor.com 不在我们手上，上线前必须定下来用哪个域名）；Cloudflare / Vercel 账号；页脚法律主体；Privacy / Terms 文本；目标市场清单（决定免责声明版本）。

### A06 · 音效素材（可选）
- **交付**：见 `docs/ASSETS.md` §5。不给则 T12 只做开关逻辑 + 静音占位。

### A07 · PR 预览验收
- **做法**：T01 完成后每个 PR 会自动生成预览链接。打开链接，对照任务卡的"验收"逐条看，桌面 + 手机各过一遍，在 PR 里回复通过/问题。

---

## 3. Codex 任务卡

### T01 · 工程基建：Lint / 格式化 / CI / 预览部署
- **目标**：让之后每个 PR 都有自动检查和可点开的预览链接。
- **范围**：`eslint.config.js` `.prettierrc` `.github/workflows/ci.yml` `package.json` `README.md`；部署配置文件。
- **需求**：
  1. ESLint（typescript-eslint + react-hooks + jsx-a11y）+ Prettier；新增 `npm run lint`，并入 `npm run check`。
  2. 对现有代码只做格式化，不改逻辑；如 lint 报真实问题，单独列在 PR 描述里。
  3. GitHub Actions：push / PR 时 `npm ci && npm run check`，Node 20。
  4. 预览部署：Cloudflare Pages（首选）或 Vercel，PR 自动出预览 URL；构建命令 `npm run build`，产物 `dist/`。
- **验收**：
  - [ ] `npm run check` 包含 lint 且通过
  - [ ] PR 上能看到 CI 结果和预览链接
  - [ ] README 写明如何本地运行、如何看预览
- **不做**：不引入 Husky / commitlint 等提交钩子。

### T02 · 接入真实标签与包装尺寸
- **目标**：3D 产品从占位变成真实包装。
- **范围**：`public/labels/*` `src/content/products.ts` `src/experience/product/packaging.ts`（仅当需要新的形态参数）及其测试。
- **需求**：
  1. 把 `assets-inbox/labels/*.png` 转为 WebP（宽 4096 与 2048 两档），放入 `public/labels/`；为每个产品设置 `labelSrc`。
  2. 用 A02 的实测值更新每个产品的 `packaging`；`bodyColor` / `lidColor` 取自实物照片。
  3. 用 `theme.primary / secondary` 替换为 A03 给的每 SKU 主题色。
  4. 逐个产品校准 `features[].faceAngle`，让每条卖点对准背标上对应的区域。
  5. 若某 SKU 不是旋转体：不要硬凑，设置 `modelSrc` 并在 PR 里说明需要 GLB；`GlbPack` 要求模型居中、Y 轴向上、高度按 1 单位 = 100mm。
- **验收**：
  - [ ] 每个产品正面标签朝向镜头、无镜像、无拉伸（与实物照片比对）
  - [ ] 标签上下沿与实物位置一致，未盖到瓶肩/瓶底倒角
  - [ ] 第 3 幕每条卖点出现时，镜头前是对应的标签区域
  - [ ] `packaging.test.ts` 通过；dev 角标的占位计数相应减少
- **不做**：不调材质和灯光（T05）。

### T03 · 接入定稿文案 + 占位内容守卫
- **目标**：全站文案换成合规定稿，并保证占位内容永远上不了线。
- **范围**：`src/content/*` `scripts/check-content.mjs` `package.json` `index.html`。
- **需求**：
  1. 按 A04 替换 `products.ts` / `site.ts` 全部文案，逐字照录，不润色、不增删。
  2. 产品文案齐全后把该产品 `placeholder` 置为 `false`。
  3. 新增 `npm run check:content`：扫描 `src/content/` 与 `index.html`，发现 `[Placeholder]` / `PLACEHOLDER` 或 `placeholder: true` 即失败并列出位置。**不要**并入 `npm run check`（开发期需要占位），只在 T21 的发布流程里强制。
- **验收**：
  - [ ] 页面上看不到任何 `[Placeholder]`
  - [ ] `npm run check:content` 通过；人为加回一个占位能让它失败
  - [ ] 文案与 A04 定稿逐字一致（PR 里附对照）
- **不做**：不自己写或改任何营销/功效表述。

### T04 · 字体、Logo 与品牌令牌
- **目标**：视觉从"系统字体占位"变成品牌自己的样子。
- **范围**：`public/fonts/*` `src/styles/tokens.css` `src/styles/global.css` `src/ui/Header.tsx` `src/ui/Loader.tsx` `index.html` `public/`（favicon）。
- **需求**：
  1. 自托管 WOFF2，`@font-face` + `font-display: swap`，首屏标题字体 `preload`；只打包用到的字重，做 Latin 子集。
  2. 无授权字体时用 OFL 开源替代并在 PR 里注明；更新 `--font-display` / `--font-body`。
  3. Header 和 Loader 的文字 Logo 换成 SVG（内联，`currentColor`）。
  4. Favicon、`theme-color`、Apple touch icon。
  5. 占位标签画布（`labelTexture.ts`）里的字体同步换成品牌标题字体（等字体加载完成再绘制）。
- **验收**：
  - [ ] 无任何第三方字体请求（Network 面板只有本域）
  - [ ] 字体加载前后无明显版式跳动（CLS < 0.05）
  - [ ] Logo 在深/浅背景上都清晰
- **不做**：不做文字动效（T07）。

### T05 · 包装模型与材质精修
- **目标**：产品近景（占半屏）经得起看。
- **范围**：`src/experience/product/*` `src/experience/Experience.tsx`（灯光/环境）。
- **需求**：
  1. 瓶盖：竖纹/防滑纹（法线贴图或几何）、顶面微倒角；罐口与盖之间的缝隙阴影。
  2. 瓶身材质按 A02 质感区分：哑光塑料 / 亮面塑料 / 透明（transmission，仅高画质档）。
  3. 标签材质：基础 roughness + 可选 `<id>-foil.png` 蒙版驱动的金属/高光区。
  4. 标签贴图开启 mipmap + 各向异性；远景用 2048 档、近景用 4096 档（按画质档切换即可，不必动态）。
  5. 接触感：首屏与全家福下方的柔和落影（`ContactShadows` 或假阴影贴片，二选一，注明性能开销）。
  6. 影棚光：调整 Lightformer 让瓶身有一条清晰的竖向高光带（参考站罐身那种）。
- **验收**：
  - [ ] 第 2/3 幕近景下盖、肩、标签边缘无锯齿、无 z-fighting、无接缝漏光
  - [ ] 深色罐与白色瓶同台时曝光都正常
  - [ ] 桌面中端机 60fps（与改动前对比，帧时间增加 < 2ms）
- **不做**：不引入后期处理管线（Bloom 等留给 T15 评估）。

### T06 · WebGL 背景着色器
- **目标**：把 CSS 渐变占位换成参考站那种有流动感的主题色铺屏 + 能量爆发。
- **范围**：`src/ui/Backdrop.tsx`（可新增 `src/ui/backdrop/*`）`src/styles/global.css` 中 backdrop 部分。
- **需求**：
  1. 在 **z0 层**实现（独立的轻量全屏着色器画布，不依赖 R3F；或同等方案），**不得**改变图层契约：口号仍在背景与产品之间。
  2. 输入只读 CSS 变量契约：`--theme-a` `--theme-b` `--theme-mix` `--burst`（用 `getComputedStyle` 每帧读，或订阅 `scrollState`，二选一并说明）。
  3. 三种状态平滑过渡：中性影棚（上黑下灰、地面感）→ 主题色从中心向外铺开（带低频噪声流动）→ 放射状爆发（第 4 幕）。
  4. 切换产品时主题色 0.6s 内平滑过渡，不跳变。
  5. `prefers-reduced-motion` 或 WebGL 不可用时回退到现有 CSS 版本（保留现有 CSS 作为 fallback）。
  6. 页面不可见 / 滚过 Stage 后暂停渲染。
- **验收**：
  - [ ] 逐幕观感接近 `docs/REFERENCE.md` 描述；无色带（banding）——需要抖动
  - [ ] 口号仍被产品遮挡（层级正确）
  - [ ] GPU 帧时间 < 2ms（1080p，中端集显）
  - [ ] reduced-motion 下为静态渐变
- **不做**：不改产品画布，不加后期。

### T07 · 文字动效
- **目标**：文案的出场和退场有节奏，而不是整块淡入。
- **范围**：`src/sections/*` `src/ui/SloganLayer.tsx` `src/styles/global.css`；可新增 `src/ui/RevealText.tsx`。
- **需求**：
  1. 标题逐行/逐词上滑遮罩入场，正文整体延迟淡入；退场反向。用 GSAP，时间线由 `--vis-<act>` / `scrollState` 驱动（可擦洗、可倒放），不是一次性播放。
  2. 卖点切换：旧条目上移淡出，新条目下方进入，方向随滚动方向翻转。
  3. 口号：随 `--p-slogan` 轻微放大 + 字距收紧；两行可有相反方向的水平视差。
  4. FAQ 手风琴展开/收起的高度动画（保留原生 `<details>` 语义）。
  5. 拆分文字时保留可访问文本（`aria-label` 放整句，拆分节点 `aria-hidden`）。
- **验收**：
  - [ ] 快速来回滚动不出现文字重叠、卡在半透明、或动画排队
  - [ ] 读屏读到的是完整句子
  - [ ] reduced-motion 下只有淡入淡出
- **不做**：不引入付费字体动效库。

### T08 · 首屏选品环打磨
- **目标**：首屏的"玩具感"——想让人多拨几下。
- **范围**：`src/sections/HeroOverlay.tsx` `src/experience/Cast.tsx` `src/experience/choreography.ts`（ring 部分）`src/director/scrollState.ts` 及测试。
- **需求**：
  1. 拖拽带惯性（按释放速度多滑 0–2 格）后吸附；触控板横向滚动也能拨动。
  2. 指针悬停时当前产品朝指针轻微倾斜（±6°），其余产品有更慢的待机漂浮。
  3. 点击两侧产品 = 选中它（DOM 热区实现，保持画布不接事件）。
  4. 底部基座与顶部环形灯的造型（3D 或 DOM 均可），基座文字随切换翻动。
  5. 位置指示器（类似参考站的滑条/分段条），可点击跳转。
  6. 产品 ≥ 7 个时弧形自动收紧间距（为将来扩 SKU 留余量），加单测。
- **验收**：
  - [ ] 鼠标、触屏、触控板、键盘（← →）四种方式都能切换
  - [ ] 无限循环时看不到产品"飞过屏幕"
  - [ ] 切换后立刻向下滚，第 2 幕出现的是新选中的产品且无跳变
- **不做**：不改第 2 幕之后的走位。

### T09 · 卖点标签高亮
- **目标**：第 3 幕讲到哪条，标签上哪块亮。
- **范围**：`src/content/types.ts` `src/content/products.ts` `src/experience/product/*` `src/sections/FeaturesOverlay.tsx` `src/styles/global.css`。
- **需求**：
  1. `ProductFeature` 增加可选 `labelRegion: { u0, u1, v0, v1 }`（标签 UV 矩形）。
  2. 标签材质用 `onBeforeCompile` 或自定义 shader：当前卖点区域保持原亮度并带柔边，其余区域压暗到 ~35%；强度由 features 幕可见度驱动，切换时 0.4s 过渡。
  3. 右侧圆点换成每条卖点的 SVG 图标（`icon` 字段；图标自绘或用 OFL/MIT 图标集），当前项放大；圆点可点击/键盘聚焦 → 平滑滚动到该卖点。
  4. 没有 `labelRegion` 的卖点不压暗。
- **验收**：
  - [ ] 每条卖点的高亮区与标签上的真实内容对齐
  - [ ] 离开第 3 幕后标签亮度完全恢复
  - [ ] 圆点可键盘操作，有 `aria-current`
- **不做**：不在标签上叠加新的文字或图形。

### T10 · 全家福打磨
- **目标**：第 5 幕像参考站一样"多米诺式"依次入列，并成为第二个选品入口。
- **范围**：`src/experience/choreography.ts`（lineup 部分）`src/sections/LineupOverlay.tsx` 及测试、样式。
- **需求**：
  1. 产品按索引错峰入列（每个延迟 ~6% 进度），带轻微过冲。
  2. 每个产品下方显示名称（DOM，按 3D 位置投影或等分布局）。
  3. 点击/回车某个产品 → 设为 active 并平滑滚回第 2 幕起点（用 `actStartVh('reveal')`）。
  4. 产品数量变化时自动调整间距与缩放，保证一屏放得下；补单测。
- **验收**：
  - [ ] 5 个产品在 1280–2560 宽度下均不重叠、不出屏
  - [ ] 从全家福点选产品后，看到的是该产品的第 2 幕
- **不做**：不做移动端布局（T13）。

### T11 · Loader 与开场
- **目标**：真实加载进度 + 品牌开场，交接到首屏无跳变。
- **范围**：`src/ui/Loader.tsx` `src/store/useAppStore.ts` `src/experience/Experience.tsx` `src/experience/product/labelTexture.ts` 样式。
- **需求**：
  1. 进度 = 3D chunk + 全部标签贴图 + 字体；用 `THREE.LoadingManager` 统一统计。
  2. 最短展示 1.2s，完成后 Logo 动画退场，产品从下方依次升入选品环。
  3. 加载超过 8s 给出"仍在加载"提示；失败走 T17 的降级。
- **验收**：
  - [ ] 限速 Fast 3G 下进度条单调递增、不回退、不卡 99%
  - [ ] 二次访问（有缓存）不闪 Loader 超过 1.2s

### T12 · 音效系统
- **目标**：左上角的音效开关真的有声音。素材（A06）到了就接入，没到也能先做完逻辑。
- **范围**：新增 `src/audio/*`；`src/ui/Header.tsx` `src/store/useAppStore.ts`。
- **需求**：
  1. WebAudio（或 Howler，二选一说明理由）；默认**关闭**，首次用户手势后才允许播放。
  2. 环境循环 + 切换产品音 + 幕切换 whoosh；音量随滚动速度轻微变化（可选）。
  3. 开关状态存 `localStorage`；页面不可见时静音。
  4. 无素材时保留完整逻辑 + 静音占位，接口不变。
- **验收**：
  - [ ] 未交互前无任何自动播放报错
  - [ ] iOS Safari 能正常开/关声音
  - [ ] 音频文件懒加载，不计入首屏体积

### T13 · 移动端适配
- **目标**：手机上是"设计过的"，不是"缩小的桌面版"。
- **范围**：`src/experience/choreography.ts`（portrait 部分）`src/styles/global.css` `src/sections/*` 及测试。
- **需求**：
  1. 竖屏走位：首屏一次露出 3 个产品；第 2/3 幕产品居上、文案居下且不互相遮挡；全家福改两排或横向可滑。
  2. 触摸拖拽与纵向滚动不打架（横向位移 > 纵向才接管）。
  3. 使用 `svh/dvh` 处理地址栏伸缩；安全区 `env(safe-area-inset-*)`。
  4. DPR 上限 2，低端机降到 1.5（与 T15 的分级对接）。
  5. 横屏手机（高度 < 500px）有可用布局。
- **验收**：
  - [ ] iPhone SE / iPhone 15 Pro Max / 主流安卓（360×800）三档截图无遮挡、无出屏
  - [ ] iOS Safari 与 Android Chrome 真机滚动不卡顿、不回弹错位
  - [ ] `npm run shots` 的 phone 组截图附在 PR 里

### T14 · 全屏菜单与导航
- **目标**：MENU 变成完整的全屏导航。
- **范围**：`src/ui/Header.tsx`（可拆出 `src/ui/Menu.tsx`）`src/store/useAppStore.ts` 样式。
- **需求**：
  1. 全屏覆盖层：产品列表（点选 = 设为 active + 滚到第 2 幕）、FAQ、About；入场/退场动画。
  2. 打开时锁滚动（暂停 Lenis）、焦点陷阱、`Esc` 关闭、关闭后焦点回到按钮。
  3. 菜单内容来自 `src/content/`。
- **验收**：
  - [ ] 纯键盘可完成：打开 → 选产品 → 关闭
  - [ ] 打开菜单时背景不滚动，关闭后滚动位置不变

### T15 · 性能分级与预算
- **目标**：中端机 60fps，低端机不崩；首屏体积可控。
- **范围**：新增 `src/experience/quality.ts`；`Experience.tsx` `Cast.tsx` `product/*` `vite.config.ts`。
- **需求**：
  1. 画质三档（high / medium / low）：启动时按 GPU 信息 + 首 60 帧帧时间判定，运行中掉帧可自动降一档。影响：DPR、几何分段、环境贴图分辨率、贴图档位、阴影、透明材质。
  2. 画布滚出视口（FAQ 之后）或标签页不可见 → 停止渲染循环。
  3. 贴图压缩评估：WebP vs KTX2/Basis，给出体积与显存对比后选型。
  4. 包体预算：首屏（不含 3D chunk）JS gzip ≤ 130KB；3D chunk gzip ≤ 300KB；首屏贴图总量 ≤ 2.5MB。超了要在 PR 里解释。
  5. 是否值得加 Bloom 等后期：给出有/无的帧时间对比再决定。
- **验收**：
  - [ ] Lighthouse（移动端模拟）Performance ≥ 80，LCP < 2.5s，CLS < 0.05
  - [ ] Chrome Performance 面板：滚动全程无 > 50ms 长任务
  - [ ] 三档画质都有截图

### T16 · 无障碍
- **目标**：键盘、读屏、减少动态效果三类用户都能完整获取内容。
- **范围**：全站 DOM 与样式；`src/director/smoothScroll.ts`。
- **需求**：
  1. Skip link；合理的标题层级（全站一个 `h1`）；landmark 完整。
  2. reduced-motion 模式：无 Lenis、无爆发动画、产品只做淡入淡出式切换（走位直接到位）。
  3. 每个产品主题色上的文字对比度 ≥ 4.5:1（不够则自动切换 `theme.ink` 或加衬底），写成可运行的检查脚本。
  4. 所有可交互元素有可见焦点、可键盘操作、有可读名称。
  5. 用 axe 跑一遍，0 个 serious/critical。
- **验收**：
  - [ ] VoiceOver / NVDA 能按顺序读完：产品名 → 描述 → 各卖点 → FAQ → 页脚
  - [ ] 只用键盘能切换产品、打开菜单、展开 FAQ
  - [ ] axe 报告附在 PR

### T17 · WebGL 降级与错误边界
- **目标**：没有 WebGL、上下文丢失、chunk 加载失败时，用户仍能看到全部内容。
- **范围**：新增 `src/ui/StaticFallback.tsx` `src/ui/ExperienceBoundary.tsx`；`App.tsx`；`scripts/`（生成静态产品图）。
- **需求**：
  1. 启动检测 WebGL2/WebGL1 可用性；`webglcontextlost` 监听与恢复。
  2. 降级视图：每幕用预渲染的产品静态图（用 `scripts/` 从真实场景离线截取，保证与 3D 一致），文案与滚动结构不变。
  3. `Experience` 外包 React Error Boundary，出错即切到降级视图并上报（console 即可，统计接入见 T20）。
- **验收**：
  - [ ] Chrome `--disable-gpu --disable-software-rasterizer` 下页面内容完整可读
  - [ ] 手动触发 `WEBGL_lose_context` 后页面不白屏

### T18 · 视觉回归进 CI
- **目标**：每个 PR 自动产出逐幕截图，肉眼验收不用本地跑。
- **范围**：`scripts/screenshots.mjs` `.github/workflows/*`。
- **需求**：
  1. CI 里跑 `npm run shots`，截图作为 artifact 上传，并在 PR 评论里贴缩略拼图。
  2. 脚本的 `STOPS` 改为从 `src/director/acts.ts` 计算，避免两处不同步。
  3. 控制台 error 即失败（已实现，保持）。
- **验收**：
  - [ ] PR 页面能直接看到桌面 + 手机各 8 张截图

### T19 · SEO、社交分享与预渲染
- **目标**：搜索引擎和社交平台拿到的是完整内容，而不是空壳。
- **范围**：`index.html` `vite.config.ts` `public/`（robots、sitemap、OG 图）；预渲染脚本。
- **需求**：
  1. 构建期预渲染首页 HTML（文案进静态 HTML；3D 仍由客户端接管）。
  2. `title` / `description` / canonical / OG / Twitter Card；OG 图 1200×630。
  3. JSON-LD：`Organization` + 每个产品的 `Product`（**不含** offers/价格/评分——本站纯展示）。
  4. `robots.txt`、`sitemap.xml`；正式域名来自 A05。
- **验收**：
  - [ ] 禁用 JS 后仍能看到全部产品名、描述、卖点、FAQ
  - [ ] Rich Results Test 与社交平台调试器无报错

### T20 · 法务页面、Cookie 与统计
- **目标**：上线所需的合规外壳。
- **范围**：新增静态页 `privacy` `terms`；`src/content/site.ts`；统计接入。
- **需求**：
  1. Privacy / Terms 静态页（文本来自 A05），页脚链接接通。
  2. 统计用无 Cookie 方案（Cloudflare Web Analytics 或 Plausible）→ 不需要 Cookie 横幅。若品牌方坚持用 GA 等，则必须加同意管理，并在 PR 里说明。
  3. 页脚免责声明按 A05 的目标市场取用对应版本。
- **验收**：
  - [ ] 未经同意不写入任何非必要 Cookie / localStorage 标识
  - [ ] 法务文本与 A05 提供的逐字一致

### T21 · 部署上线
- **目标**：正式域名可访问，缓存与安全头正确。
- **范围**：部署配置（`_headers` / `_redirects` 或 `vercel.json`）`README.md` `docs/CHECKLIST.md`。
- **需求**：
  1. 发布流程强制 `npm run check && npm run check:content`。
  2. `assets/*`、`labels/*`、`fonts/*` 长缓存 + immutable；`index.html` 不缓存。
  3. 安全头：CSP（仅本域 + 统计域）、`X-Content-Type-Options`、`Referrer-Policy`、HSTS。
  4. 404 页；www / 裸域跳转；HTTPS。
  5. 按 `docs/CHECKLIST.md` §6 完成上线检查并勾选。
- **验收**：
  - [ ] securityheaders.com 评级 ≥ A
  - [ ] 正式域名首访与二访加载正常，CSP 无报错

### T22 · （可选）无缝循环回首屏
- **目标**：页脚之后继续下滚，无缝回到首屏选品环（参考站 13–15s）。
- **范围**：`src/director/*` `src/sections/*`。
- **需求**：页脚后追加一段转场区，滚到底时瞬时重置滚动到 0（Lenis `immediate`），视觉上连续。reduced-motion 下关闭。
- **验收**：
  - [ ] 连续循环 3 圈无闪烁、无滚动条跳动可感知
  - [ ] 浏览器后退/锚点/菜单跳转不受影响
