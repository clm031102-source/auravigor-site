# 架构说明

> 读者：Codex（实现）、Alan（验收）。这份文档定义"不能被改坏的东西"。动效数值、视觉细节随便调，下面的契约不要动；要动先在 PR 里说明理由。

## 1. 一句话

一个**固定在屏幕上的透明 WebGL 画布** + **一条很长的滚动时间线**。滚动位置 → 导演层算出"现在是第几幕、演到百分之几" → 3D 产品和 DOM 文案各自按这个进度摆姿势。

## 2. 技术栈与选型理由

| 选择 | 理由 |
|---|---|
| Vite + React 19 + TypeScript (strict) | 纯静态产物，Cloudflare Pages / Vercel / 任意对象存储都能部署；Codex 迭代快；不引入 SSR 与 R3F 的水合问题 |
| three.js + @react-three/fiber + drei | 参考站同类方案；声明式场景，Codex 容易按组件拆任务 |
| GSAP + ScrollTrigger | 滚动进度与后续文字动效（T07）共用一个时钟；GSAP 现已全插件免费 |
| Lenis | 平滑滚动；由 GSAP ticker 驱动，保证三者同帧 |
| zustand | 仅存离散 UI 状态（当前产品 / 当前幕 / 当前卖点） |
| 原生 CSS + design tokens | 无构建期依赖，主题色靠 CSS 变量实时切换 |
| Vitest | 导演层、走位、包装建模都是纯函数，有单测兜底 |

不用 Next.js：本站是单页体验，SEO 靠 T19 的预渲染解决；SSR 对 WebGL 没有收益只有坑。

## 3. 图层（从后到前）

```
z0  Backdrop      fixed   CSS 渐变：中性影棚 → 产品主题色(--theme-mix) → 能量爆发(--burst)
z1  SloganLayer   fixed   巨型口号。夹在背景和产品之间，所以产品能"压"在字上（参考站效果）
z2  Experience    fixed   透明 WebGL 画布，pointer-events: none，永远不接收交互
z3  <main>        flow    Stage(钉住的 5 幕 DOM 文案) → FAQ → Outro，正常文档流，盖在画布上滚动
z10 Header        fixed   进度条 / 音效开关 / Logo / 菜单
z100 Loader
```

**为什么画布透明**：口号字必须在产品后面、背景前面。把背景和口号留在 DOM/CSS，画布只画产品，层级关系用 z-index 就能解决，也让 T06（背景着色器）可以独立替换 z0 而不碰产品画布。

**为什么画布不接事件**：所有交互（拖拽、箭头、键盘、菜单）都有 DOM 控件，键盘和读屏可达；WebGL 只负责"画"。

## 4. 数据流（最重要的一张图）

```
        wheel / touch
             │
        Lenis (平滑)  ──tick──  gsap.ticker
             │
   ScrollTrigger (Stage: top top → bottom bottom)
             │  progress 0..1
             ▼
   director/useScrollDirector.ts      ← 全站唯一读取滚动的地方
             │  resolveActs(progress × TOTAL_VH)      [纯函数, 有单测]
             ├──► scrollState (可变单例)  ──► experience/Cast.tsx 在 useFrame 里读
             │                                   └─ choreography.castPose() [纯函数, 有单测]
             ├──► <html> 上的 CSS 变量  ──► DOM 文案透明度 / 背景 / 进度条
             └──► zustand（仅当 act / featureIndex 变化时）──► React 重渲染文案
```

### CSS 变量契约（写在 `<html>` 上）

| 变量 | 含义 |
|---|---|
| `--p-hero` `--p-reveal` `--p-features` `--p-slogan` `--p-lineup` | 各幕内部进度 0..1（已过的幕 = 1，未到的 = 0） |
| `--vis-<act>` | 各幕 DOM 文案可见度 0..1（只有当前幕非 0，首尾自动淡入淡出） |
| `--theme-mix` | 产品主题色铺满背景的程度 |
| `--burst` | 口号幕的能量爆发强度 |
| `--progress` | 整条时间线进度（顶部进度条） |
| `--theme-a` `--theme-b` `--theme-ink` | 当前产品主题色（`App.tsx` 在切换产品时写入） |

### 三种状态，各归其位

| 类型 | 放哪 | 例子 |
|---|---|---|
| 每帧都变的连续值 | `director/scrollState.ts`（可变对象，**不进 React**） | 各幕进度、选品环位置 |
| 离散 UI 状态 | `store/useAppStore.ts`（zustand） | activeIndex、act、featureIndex、soundOn |
| 内容 | `src/content/*`（类型在 `types.ts`） | 产品、文案、FAQ、主题色、包装尺寸 |

## 5. 时间线（5 幕 + 2 段普通内容）

定义在 `src/director/acts.ts` 的 `ACTS`，单位是"滚动多少个视口高度"。**改节奏只改这个数组。**

| 幕 | id | 长度 | 3D | DOM |
|---|---|---|---|---|
| 1 选品环 | `hero` | 40vh | 全部产品排成弧形，可拖拽/箭头/键盘切换 | 底部产品名 + 箭头 + 提示 |
| 2 揭示 | `reveal` | 160vh | 选中产品上前放大，其余散开消失；背景染成主题色 | 产品名 + 品类 + 一句话 |
| 3 卖点 | `features` | 400vh | 产品转到背标，按卖点逐个转向 (`faceAngle`) | 卖点标题/正文 + 右侧圆点 |
| 4 口号 | `slogan` | 200vh | 产品回正居中 | 巨型口号（z1 层） |
| 5 全家福 | `lineup` | 200vh | 全部产品排成一排 | 标题 + 一句话 |
| — | FAQ / Outro | 自然高度 | 产品整体上移离场 (`scrollState.exit`) | 手风琴 / 品牌收尾 + 法务页脚 |

## 6. 3D 部分

- **一套演员走到底**：`Cast.tsx` 只挂载一次全部产品，每帧向 `castPose()` 要目标姿态再做阻尼。幕与幕之间不挂载/卸载任何东西 → 没有闪烁、没有重复显存。
- **走位是纯函数**：`choreography.ts` 的 `castPose(input) → Pose`。所有"手感"数值集中在 `TUNING`。竖屏适配也在这里（`aspect` 参数）。
- **包装是程序化生成的**：`product/packaging.ts` 把"高度/直径/标签带位置（毫米）"变成旋转体轮廓；`ProductModel.tsx` 用 Lathe 几何体 + 一个贴着瓶身的开口圆柱承载标签贴图。
  - 1 个世界单位 = 100mm，所有产品按真实比例同台。
  - 支持 `tub`（粉剂罐）和 `bottle`（胶囊瓶）。**袋装/盒装不是旋转体，必须走 `modelSrc` 提供 GLB。**
  - 标签图约定：平铺图恰好绕瓶身一圈，**正面居中（50% 处），接缝在背面（0%/100%）**。详见 `docs/ASSETS.md`。
  - 没给 `labelSrc` 时运行时自动画一张占位标签，所以**任何时候项目都能跑**。
- **灯光**：drei `<Environment>` + `<Lightformer>` 程序化影棚，不下载 HDRI，离线/CI 可跑。
- **代码分割**：`Experience` 是 `lazy()` 加载的独立 chunk（three.js 占包体 ~75%），外壳和 Loader 先出。

## 7. 目录

```
src/
  content/      内容与类型（品牌方改这里）
  director/     滚动 → 状态（acts / scrollState / useScrollDirector / smoothScroll / math）
  experience/   <Canvas> 里的一切（Experience / Cast / choreography / product/*）
  sections/     各幕 DOM 文案 + FAQ + Outro（Stage.tsx 是钉住的容器）
  store/        zustand
  ui/           Header / Loader / Backdrop / SloganLayer / PlaceholderBadge
  styles/       tokens.css（唯一允许出现裸色值/字号的地方）+ global.css
scripts/        screenshots.mjs（无头浏览器逐幕截图 + 控制台报错检查）
public/labels/  标签平铺图（T02 接入）
public/fonts/   自托管字体（T04 接入）
```

## 8. 常见改动怎么做

| 我想… | 改哪里 |
|---|---|
| 加/删一个产品 | `content/products.ts` 加一项即可，选品环、全家福、主题色自动适配 |
| 换真实标签 | 图放 `public/labels/<id>.webp`，产品上写 `labelSrc: '/labels/<id>.webp'` |
| 调某一幕的长短 | `director/acts.ts` → `ACTS[].lengthVh` |
| 调产品位置/大小/角度 | `experience/choreography.ts` → `TUNING` |
| 让某个卖点对准标签某一面 | 该卖点的 `faceAngle`（0 = 正面，π = 正背面） |
| 换口号 / FAQ / 页脚 | `content/site.ts` |
| 换字体/颜色/间距 | `styles/tokens.css` |

## 9. 已知取舍 / 骨架阶段刻意没做的事

- 背景目前是 CSS 渐变占位（T06 换着色器）。
- 文案只有淡入淡出（T07 做逐字/逐行动效）。
- 移动端只保证"能用不崩"，走位和排版未打磨（T13）。
- 没有音频、没有真实 Loader 进度、没有 WebGL 降级（T12 / T11 / T17）。
- 所有文案、颜色、包装尺寸都是占位（A01–A04 → T02/T03）。
