---
theme: default
title: PUC升级报告
class: puc-upgrade-report
css: unocss
---

<div class="cover slide-frame">
  <div class="cover-kicker">PUC Upgrade Report</div>
  <h1>PUC升级报告</h1>
  <p class="cover-subtitle">版本演进 · 能力增强 · 交付计划</p>
  <div class="cover-meta">
    <span>汇报对象：项目组 / 管理层</span>
    <span>日期：2026.07</span>
  </div>
</div>

---

<div class="slide-frame agenda">
  <div class="section-label">目录</div>
  <h2>本次汇报聚焦四个问题</h2>
  <div class="agenda-grid">
    <div><b>01</b><span>升级背景</span><p>为什么现在要做PUC升级</p></div>
    <div><b>02</b><span>升级目标</span><p>升级后要达成哪些业务与技术指标</p></div>
    <div><b>03</b><span>方案设计</span><p>能力、架构、体验与安全如何演进</p></div>
    <div><b>04</b><span>计划与保障</span><p>如何分阶段落地并控制风险</p></div>
  </div>
</div>

---

<div class="slide-frame split-page">
  <div>
    <div class="section-label">01 / 背景</div>
    <h2>现状痛点推动PUC进入升级窗口</h2>
    <p class="lead">当前PUC在稳定支撑核心场景的同时，也暴露出容量、体验、协同与运维方面的瓶颈，需要通过一次系统性升级完成能力补齐。</p>
    <div class="pain-list">
      <div><strong>容量压力</strong><span>并发接入、消息分发与历史数据查询存在峰值压力。</span></div>
      <div><strong>体验割裂</strong><span>多终端交互不统一，关键流程需要减少跳转和等待。</span></div>
      <div><strong>运维成本</strong><span>告警、排障、发布回滚仍依赖人工经验。</span></div>
      <div><strong>安全合规</strong><span>权限、审计、数据留痕需要进一步标准化。</span></div>
    </div>
  </div>
  <div class="metric-card">
    <span>升级关键词</span>
    <b>稳定 / 高效 / 可控</b>
    <p>以不中断业务为原则，以关键链路提效为目标。</p>
  </div>
</div>

---

<div class="slide-frame objective-page">
  <div class="section-label">02 / 目标</div>
  <h2>升级目标：从“可用”走向“好用、稳用、易运维”</h2>
  <div class="objective-grid">
    <article><span>业务连续性</span><b>零重大中断</b><p>灰度迁移、双轨验证、快速回滚。</p></article>
    <article><span>用户体验</span><b>关键流程提效</b><p>消息、群组、告警、回呼统一入口。</p></article>
    <article><span>平台性能</span><b>峰值更稳</b><p>提升并发处理、查询响应与数据同步能力。</p></article>
    <article><span>安全治理</span><b>权限可追溯</b><p>完善认证授权、审计日志与数据分级。</p></article>
  </div>
</div>

---

<div class="slide-frame roadmap-page">
  <div class="section-label">03 / 方案</div>
  <h2>总体方案：四层能力同步升级</h2>
  <div class="layer-stack">
    <div><b>应用体验层</b><span>统一工作台、移动端交互、消息聚合、告警闭环</span></div>
    <div><b>业务服务层</b><span>通讯录、群组、任务、回呼、SOS等核心服务重构</span></div>
    <div><b>平台支撑层</b><span>网关、缓存、队列、监控、日志、配置中心</span></div>
    <div><b>安全治理层</b><span>统一认证、角色权限、审计留痕、数据加密</span></div>
  </div>
</div>

---

<div class="slide-frame comparison-page">
  <div class="section-label">03 / 对比</div>
  <h2>升级前后能力对比</h2>
  <table>
    <thead><tr><th>维度</th><th>升级前</th><th>升级后</th></tr></thead>
    <tbody>
      <tr><td>消息触达</td><td>多入口分散，状态不统一</td><td>统一消息中心，未读、置顶、免打扰一致</td></tr>
      <tr><td>应急响应</td><td>SOS与告警处理链路较长</td><td>高优先级卡片、详情闭环、处理留痕</td></tr>
      <tr><td>系统运维</td><td>问题定位依赖人工日志排查</td><td>监控看板、链路追踪、告警自动归因</td></tr>
      <tr><td>发布方式</td><td>集中发布，回滚成本高</td><td>灰度发布、分批迁移、快速回滚</td></tr>
    </tbody>
  </table>
</div>

---

<div class="slide-frame timeline-page">
  <div class="section-label">04 / 计划</div>
  <h2>实施计划：四阶段稳步推进</h2>
  <div class="timeline">
    <div><b>阶段一</b><span>需求确认</span><p>范围冻结、指标定义、风险清单</p></div>
    <div><b>阶段二</b><span>方案建设</span><p>核心能力开发、联调、数据准备</p></div>
    <div><b>阶段三</b><span>灰度验证</span><p>小范围试点、问题修复、用户反馈</p></div>
    <div><b>阶段四</b><span>全量上线</span><p>迁移切换、运维保障、复盘沉淀</p></div>
  </div>
</div>

---

<div class="slide-frame risk-page">
  <div class="section-label">04 / 风险</div>
  <h2>风险与保障措施</h2>
  <div class="risk-grid">
    <div><b>数据迁移风险</b><p>提前演练迁移脚本，保留备份与校验报表。</p></div>
    <div><b>兼容性风险</b><p>保留旧版本兼容层，覆盖主流终端与核心流程。</p></div>
    <div><b>用户切换风险</b><p>分批灰度、培训材料、现场支持同步推进。</p></div>
    <div><b>上线稳定风险</b><p>监控预案、应急联系人、回滚窗口提前确认。</p></div>
  </div>
</div>

---

<div class="slide-frame closing">
  <div class="section-label">Next Step</div>
  <h2>下一步需要补齐的信息</h2>
  <ul>
    <li>确认PUC升级范围：产品模块、终端范围、业务场景。</li>
    <li>补充升级前后关键指标：性能、成本、稳定性、用户效率。</li>
    <li>提供现有系统截图、目标版本截图或Figma模板导出图片。</li>
    <li>确定汇报对象与汇报时长，进一步压缩或扩展页数。</li>
  </ul>
</div>

<style>
.slidev-layout { padding: 0; background: #f6f8fc; }
.slide-frame { width: 100%; height: 100%; padding: 54px 68px; color: #10204a; font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif; background: radial-gradient(circle at 88% 12%, rgba(77, 119, 255, .18), transparent 30%), linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%); position: relative; overflow: hidden; }
.slide-frame::after { content: ""; position: absolute; right: -80px; bottom: -120px; width: 360px; height: 360px; border-radius: 50%; background: linear-gradient(135deg, rgba(60,92,230,.16), rgba(15,185,177,.12)); }
h1, h2, p { margin: 0; } h1 { font-size: 56px; font-weight: 900; letter-spacing: .08em; } h2 { font-size: 34px; font-weight: 900; margin: 14px 0 24px; max-width: 780px; } .section-label, .cover-kicker { display: inline-flex; align-items: center; border-radius: 999px; background: #1637d2; color: #fff; padding: 8px 18px; font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; } .lead { font-size: 18px; line-height: 1.8; color: #4b587c; max-width: 640px; }
.cover { display: flex; flex-direction: column; justify-content: center; gap: 24px; } .cover-subtitle { font-size: 24px; color: #53617f; } .cover-meta { display: flex; gap: 18px; margin-top: 36px; color: #6d7896; font-weight: 700; }
.agenda-grid, .objective-grid, .risk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; position: relative; z-index: 1; } .agenda-grid div, .objective-grid article, .risk-grid div, .metric-card { background: rgba(255,255,255,.86); border: 1px solid rgba(33,62,150,.12); border-radius: 24px; padding: 24px; box-shadow: 0 18px 42px rgba(23,49,132,.10); } .agenda-grid b { color: #1637d2; font-size: 28px; } .agenda-grid span, .objective-grid span { display: block; margin: 10px 0; font-size: 20px; font-weight: 900; } .agenda-grid p, .objective-grid p, .risk-grid p, .metric-card p { color: #61708f; line-height: 1.6; }
.split-page { display: grid; grid-template-columns: 1fr 300px; gap: 42px; align-items: center; } .pain-list { display: grid; gap: 14px; margin-top: 26px; } .pain-list div { display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center; background: #fff; border-radius: 16px; padding: 16px 18px; } .pain-list strong { color: #1637d2; } .metric-card { text-align: center; } .metric-card b { display: block; font-size: 34px; margin: 20px 0; color: #0fb9b1; }
.objective-grid b { display:block; font-size: 26px; color: #1637d2; margin-bottom: 10px; }
.layer-stack { display: grid; gap: 18px; margin-top: 34px; } .layer-stack div { display: grid; grid-template-columns: 170px 1fr; gap: 24px; padding: 22px 26px; border-radius: 20px; background: linear-gradient(90deg, #183bd6, #5d7cff); color: #fff; box-shadow: 0 18px 38px rgba(30,60,200,.18); } .layer-stack div:nth-child(even) { background: linear-gradient(90deg, #0b9f99, #33c9c0); } .layer-stack b { font-size: 20px; } .layer-stack span { opacity: .92; }
table { width: 100%; border-collapse: separate; border-spacing: 0 12px; position: relative; z-index: 1; } th { text-align: left; color: #62708e; padding: 10px 18px; } td { background: #fff; padding: 18px; border-top: 1px solid rgba(33,62,150,.10); border-bottom: 1px solid rgba(33,62,150,.10); } td:first-child { border-radius: 16px 0 0 16px; font-weight: 900; color: #1637d2; } td:last-child { border-radius: 0 16px 16px 0; color: #0b8f89; font-weight: 800; }
.timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 54px; position: relative; z-index: 1; } .timeline div { min-height: 230px; border-radius: 28px; padding: 26px; color: #fff; background: linear-gradient(160deg, #1637d2, #6a83ff); box-shadow: 0 24px 44px rgba(23,49,132,.18); } .timeline div:nth-child(even) { margin-top: 46px; background: linear-gradient(160deg, #0b9f99, #3ad5ca); } .timeline b { display:block; font-size: 18px; opacity:.84; } .timeline span { display:block; font-size: 26px; font-weight:900; margin: 18px 0; } .timeline p { line-height: 1.6; opacity:.9; }
.risk-grid b { display:block; font-size: 22px; color:#1637d2; margin-bottom: 12px; }
.closing ul { margin-top: 30px; font-size: 22px; line-height: 2.1; color: #3f4d6e; position: relative; z-index: 1; }
</style>
