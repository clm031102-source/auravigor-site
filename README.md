# AuraVigor 品牌站

滚动驱动的 WebGL 3D 产品展示站（纯品牌展示 · 海外英文）。当前阶段：**M0 骨架** —— 5 幕滚动叙事 + FAQ + 收尾全部可运行，内容与视觉为占位。

## 跑起来

使用 **Node 20**（建议 20.20.2，至少 20.19）。根目录已有 `.nvmrc`，使用 nvm 的同事可运行 `nvm install`、`nvm use`。在项目根目录依次运行：

```bash
npm ci
npm run dev
```

打开终端显示的本地地址，默认是 <http://localhost:5173>。结束运行按 `Ctrl+C`。

提交前运行：

```bash
npm run check
```

检查顺序是 **ESLint → Prettier 格式检查 → TypeScript 类型检查 → 19 个单测 → 生产构建**。任何一步失败都会停止，不能以“构建成功”代替完整检查。

| 命令                   | 用途                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run lint`         | 检查 JS、TS、React Hooks 和 JSX 无障碍问题，不自动修复           |
| `npm run format`       | 统一源码、工具配置与本 README 的格式                             |
| `npm run format:check` | 只检查格式，不修改文件                                           |
| `npm run typecheck`    | 用骨架的 TypeScript 7 编译器检查类型                             |
| `npm run test`         | 运行单测                                                         |
| `npm run build`        | 检查类型并构建到 `dist/`                                         |
| `npm run preview`      | 查看已构建的 `dist/`，默认 <http://localhost:4173>               |
| `npm run shots`        | 可选的原有逐幕截图工具，需 Playwright Chromium；不属于 T01 的 CI |

本地查看生产产物时，先执行 `npm run build`，再执行 `npm run preview`。这些命令只在本地运行，不会上传或部署网站。

格式化命令明确列出文件范围，不会批量改写 `AGENTS.md` 和 `docs/`。既有代码的格式化必须单独提交，不混入逻辑修改。

### 工具兼容与已知 lint 问题

- 当前 typescript-eslint 8.70.0 需要 TypeScript `<6.1.0` 的编译器接口，无法使用骨架 TypeScript 7 的新接口。因此 `typescript` 6.0.3 仅供 lint 使用，原编译器以 `typescript-native`（`npm:typescript@^7.0.2`）保留；`typecheck` 显式调用它，`build` 和 `check` 复用同一类型检查。不要用裸 `tsc` 或 `npx tsc` 代替。依赖关系见 [typescript-eslint 官方说明](https://typescript-eslint.io/users/dependency-versions/)。
- ESLint 暂锁定 9.39.5：jsx-a11y 6.10.2 的 peer 范围最高到 ESLint 9。npm 会提示 ESLint 9 已停止支持；升级到 ESLint 10 需要等待插件兼容，不能用 `--force` 或 `--legacy-peer-deps` 隐藏冲突。
- 骨架已有的 `camera-controls@3.1.2`（要求 Node ≥22）和 `vitest@5.0.1`（要求 Node ^22.12 / ^24 / ≥26）在 Node 20 安装时会产生 `EBADENGINE` 警告。本地 Node 20.20.2 / npm 10.8.2 下安装及完整检查实际通过，但这不等于上游声明支持 Node 20；T01 保留用户指定的 Node 20 与原依赖版本，该兼容性风险需在 PR 中持续标明，线上结果以 CI 为准。
- `src/ui/Header.tsx` 的菜单 `<a>` 通过 `preventDefault()` 执行动作，触发 `jsx-a11y/anchor-is-valid`。T01 不修改现有逻辑，因此仅在该文件将该规则保留为警告，留给 T14/T16 处理。`npm run lint` 最多允许 **1 条**现有警告；新增错误或超过此数量的警告都会失败。后续修复时应同时移除此例外并将上限改为 0。
- 新增依赖均为开发工具；React / React DOM 继续保持 `~19.2.0`，没有新增运行时依赖或第三方网络请求。

## 自动检查与 PR 预览

**当前仓库只准备了 CI 和 Pages 配置，并不代表网站已经部署。** Alan 完成下方 GitHub / Cloudflare 连接后，才能在 PR 中看到真实的在线结果和预览链接。

### Alan 首次连接 Cloudflare Pages

1. 在 GitHub 确认项目仓库已有 `main` 分支、`t01-tooling` 分支和 T01 PR。仓库若尚为空，先让实现工程师上传 M0 基线及 T01 分支，不要通过“上传文件”覆盖整份工程。
2. 登录 Cloudflare 后台，进入 **Workers & Pages**，点击 **Create application**，选择 **Pages**，再选择 **Import from an existing Git repository / Connect to Git**。
3. 选择 **GitHub**。按页面提示连接账号，授权 **Cloudflare Workers & Pages** 访问此项目仓库。选择 **Only select repositories**，仅勾选 `auravigor-site`，然后返回 Cloudflare。
4. 选中仓库，点击 **Begin setup / Set up builds and deployments**。按下表填写，根目录使用仓库根目录：

   | 后台字段               | 填写内容                                             |
   | ---------------------- | ---------------------------------------------------- |
   | Project name           | `auravigor-site`，与 `wrangler.jsonc` 的 `name` 一致 |
   | Production branch      | `main`                                               |
   | Framework preset       | `None`，手动填写下方构建信息                         |
   | Build command          | `npm run build`                                      |
   | Build output directory | `dist`                                               |
   | Root directory         | 留空，使用仓库根目录                                 |
   | Environment variable   | `NODE_VERSION` = `20.20.2`                           |

5. 点击 **Save and Deploy**，等待首次构建。此操作会产生 Cloudflare 托管地址，当前内容仍是 M0 占位，正式品牌上线属于 T21。此时不需要绑定正式域名。
6. 进入 Pages 项目的 **Settings → Builds → Branch control**，确认生产分支为 `main`，**Preview branch** 选择 **All non-Production branches**。在 **Settings → Variables and Secrets**（部分界面显示 **Environment variables**）分别检查 **Production** 和 **Preview** 的 `NODE_VERSION` 都是 `20.20.2`。
7. 本项目不需要应用密钥、数据库或环境绑定。保留 Web Analytics 和其他脚本注入功能为关闭状态，符合无运行时第三方请求的契约。
8. 返回 T01 PR 查看部署结果。如果 PR 在连接 Pages 前已经存在且没有触发预览，请告知实现工程师连接已完成，由工程师推送该分支的下一次提交触发；不用为了预览提前合并 PR。

`wrangler.jsonc` 固定 Pages 项目名称和 `./dist` 输出位置；Node 版本由已有 `.nvmrc` 与后台 `NODE_VERSION` 控制，构建命令仍需在后台填写。该配置不会自动创建 Cloudflare 项目或授权 GitHub。操作依据：[Vite 部署指南](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)、[GitHub 连接与预览](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)、[Node 构建版本设置](https://developers.cloudflare.com/pages/configuration/build-image/)。

### Alan 每次怎样验收 PR

1. 打开 GitHub 仓库 → **Pull requests** → 当前任务 PR。
2. 查看 **Checks**：`.github/workflows/ci.yml` 会在每次 push 和 PR 更新时，使用 Node 20 执行 `npm ci`、`npm run check`。检查名称为 **CI / 检查（Node 20）**；失败时点击查看对应步骤日志。
3. 找到 Cloudflare Pages 发布的部署状态或机器人评论，点击 **View deployment / Preview URL**。也可在 Cloudflare → 项目 → **Deployments** 找到对应分支与提交的 **Preview** 部署，点击 **Visit site**。一定要确认提交与 PR 最新提交一致，不能拿 `main` 的地址代替。
4. 桌面和手机各从头滚到尾、再滚回头；首屏切换 2–3 个产品，再下滚确认第 2 幕是刚选中的产品。其余项目按 `docs/CHECKLIST.md` §1 检查，在 PR 留下中文验收结果。
5. **CI 成功与 Pages 部署成功是两个独立结果**，需同时检查。CI 不负责登录 Cloudflare，也不包含部署密钥。来自 fork 的 PR 不会由 Pages Git 集成自动生成预览；本项目使用同一仓库内的任务分支。[预览部署说明](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

看不到 CI 时：进入 GitHub 仓库 **Settings → Actions → General**，确认仓库允许使用 GitHub Actions 及官方 `actions/checkout`、`actions/setup-node`；若有组织限制，请由账号管理员处理。保持工作流默认只读权限即可。

看不到预览时：先检查 Pages 的 GitHub 授权是否包含该仓库，再检查 Preview 分支设置及部署日志。页面已打开但仍显示旧内容时，核对分支和提交，不要凭网址外观判断部署版本。

## 文档地图

| 文件                   | 给谁            | 内容                                                  |
| ---------------------- | --------------- | ----------------------------------------------------- |
| `AGENTS.md`            | Codex           | 工作守则（Codex 会自动读取）                          |
| `docs/ARCHITECTURE.md` | Codex / 验收人  | 图层、数据流、契约、目录、常见改动怎么做              |
| `docs/TASKS.md`        | 所有人          | **三方分工 + 状态表 + 全部任务卡（含验收标准）**      |
| `docs/ASSETS.md`       | 设计 / 品牌同事 | 标签图、尺寸表、品牌资产、文案的交付规范              |
| `docs/CHECKLIST.md`    | 验收人          | PR 验收、素材验收、逐幕视觉、性能兼容、合规、上线清单 |
| `docs/REFERENCE.md`    | 所有人          | 参考站逐幕拆解，以及我们借鉴什么、不借鉴什么          |

## 怎么推进

1. 把本仓库推到 GitHub。
2. 团队按 `docs/ASSETS.md` 准备素材（A01–A04 是最大阻塞项）。
3. 按 `docs/TASKS.md` 的顺序，**一次给 Codex 派一张任务卡**（指令模板在该文件 §0）。T01 / T06 / T08 / T10 不依赖素材，可立即开工。
4. 每个 PR 按 `docs/CHECKLIST.md` §1 验收后合并。

## 改内容不用懂代码

产品、文案、主题色、包装尺寸、口号、FAQ 全在 `src/content/`；字体与颜色令牌在 `src/styles/tokens.css`。开发模式左下角的黄色角标会提示还有多少产品在用占位内容。

## 骨架现状截图

桌面（幕 1 → Outro）：

![desktop](docs/preview/skeleton-desktop.jpg)

手机（未打磨，见 T13）：

![phone](docs/preview/skeleton-phone.jpg)
