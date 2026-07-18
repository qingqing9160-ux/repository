---
theme: default
title: PUC 事件驱动调度升级报告
class: puc-upgrade-report
css: unocss
info: |
  PUC event-driven dispatch upgrade report deck.
---

<div class="slide-frame cover">
  <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div>
  <div class="cover-kicker">PUC Upgrade · Event-driven Dispatch</div>
  <h1>PUC事件驱动<br/>调度升级报告</h1>
  <p class="cover-subtitle">从流程驱动到事件驱动，提升响应效率、调度协同与闭环治理能力</p>
  <div class="cover-meta"><span>汇报对象：项目组 / 管理层</span><span>版本：升级方案初稿</span><span>日期：2026.07</span></div>
</div>

---

<div class="slide-frame agenda">
  <div class="section-label">Agenda</div>
  <h2>本次升级汇报回答四个关键问题</h2>
  <div class="agenda-grid">
    <div><b>01</b><span>为什么升级</span><p>现状痛点、业务诉求与升级窗口。</p></div>
    <div><b>02</b><span>升级成什么</span><p>事件驱动调度的目标形态与能力边界。</p></div>
    <div><b>03</b><span>怎么落地</span><p>架构分层、核心流程与升级前后对比。</p></div>
    <div><b>04</b><span>如何保障</span><p>里程碑、风险控制、验证指标与下一步。</p></div>
  </div>
</div>

---

<div class="slide-frame split-page">
  <div>
    <div class="section-label">01 / Background</div>
    <h2>现有PUC调度模式已进入系统性升级窗口</h2>
    <p class="lead">当前PUC能够支撑基础通信与调度，但在高并发事件、跨部门协同、任务闭环和运维可观测性方面仍存在效率损耗。</p>
    <div class="pain-list">
      <div><strong>事件入口分散</strong><span>SOS、告警、消息、回呼等入口独立，优先级与状态难统一。</span></div>
      <div><strong>调度链路偏长</strong><span>人工判断、转派、确认环节多，紧急事件响应不够敏捷。</span></div>
      <div><strong>过程留痕不足</strong><span>任务处理、人员到位、处置结果缺少统一闭环视图。</span></div>
      <div><strong>运维定位困难</strong><span>链路监控、异常归因、发布回滚能力需要平台化增强。</span></div>
    </div>
  </div>
  <div class="metric-card"><span>升级主线</span><b>事件驱动</b><p>以事件为中心聚合人员、消息、任务、位置与处置记录。</p></div>
</div>

---

<div class="slide-frame objective-page">
  <div class="section-label">02 / Target</div>
  <h2>升级目标：构建“可感知、可调度、可追踪、可运营”的PUC</h2>
  <div class="objective-grid">
    <article><span>响应效率</span><b>事件自动分级</b><p>根据来源、类型、区域和优先级触发调度策略。</p></article>
    <article><span>协同体验</span><b>一屏处置闭环</b><p>消息、群组、回呼、任务和状态在统一工作台聚合。</p></article>
    <article><span>平台韧性</span><b>峰值稳定承载</b><p>通过网关、队列、缓存与灰度发布增强高峰可靠性。</p></article>
    <article><span>治理能力</span><b>全链路可追溯</b><p>权限、审计、日志、指标和处置记录统一留痕。</p></article>
  </div>
</div>

---

<div class="slide-frame roadmap-page">
  <div class="section-label">03 / Architecture</div>
  <h2>目标架构：围绕事件总线重构PUC调度能力</h2>
  <div class="architecture">
    <div class="node source"><b>事件来源</b><span>SOS / 告警 / 消息 / 工单 / 外部系统</span></div>
    <div class="arrow">→</div>
    <div class="node bus"><b>事件总线</b><span>标准化、去重、分级、路由、订阅</span></div>
    <div class="arrow">→</div>
    <div class="node action"><b>调度执行</b><span>人员匹配、群组拉起、任务派发、回呼联动</span></div>
  </div>
  <div class="layer-stack">
    <div><b>体验层</b><span>统一事件工作台、移动端处置卡片、状态实时刷新</span></div>
    <div><b>服务层</b><span>事件编排、调度策略、通讯录、群组、通知、回呼</span></div>
    <div><b>支撑层</b><span>API网关、消息队列、缓存、配置中心、链路追踪</span></div>
    <div><b>治理层</b><span>统一认证、角色权限、审计留痕、数据分级与加密</span></div>
  </div>
</div>

---

<div class="slide-frame flow-page">
  <div class="section-label">03 / Process</div>
  <h2>核心流程：从事件接入到复盘沉淀形成闭环</h2>
  <div class="process-flow">
    <div><b>1</b><span>事件接入</span><p>多源事件统一登记</p></div>
    <div><b>2</b><span>智能分级</span><p>规则匹配优先级和责任域</p></div>
    <div><b>3</b><span>调度派发</span><p>人员、群组、任务自动联动</p></div>
    <div><b>4</b><span>现场处置</span><p>状态反馈、回呼、补充材料</p></div>
    <div><b>5</b><span>复盘归档</span><p>指标沉淀与策略优化</p></div>
  </div>
</div>

---

<div class="slide-frame comparison-page">
  <div class="section-label">03 / Comparison</div>
  <h2>升级前后能力对比</h2>
  <table>
    <thead><tr><th>维度</th><th>升级前</th><th>升级后</th></tr></thead>
    <tbody>
      <tr><td>事件处理</td><td>按模块处理，依赖人工汇总</td><td>统一事件中心，自动分级、路由与订阅</td></tr>
      <tr><td>调度协同</td><td>通知、群组、任务相互割裂</td><td>一键拉群、派单、回呼、到位确认联动</td></tr>
      <tr><td>状态闭环</td><td>进展分散在聊天或线下记录</td><td>处置节点、责任人、耗时与结果全链路留痕</td></tr>
      <tr><td>运维保障</td><td>问题定位依赖人工日志排查</td><td>监控看板、链路追踪、异常告警与快速回滚</td></tr>
    </tbody>
  </table>
</div>

---

<div class="slide-frame timeline-page">
  <div class="section-label">04 / Roadmap</div>
  <h2>实施计划：先闭环关键场景，再逐步扩大覆盖范围</h2>
  <div class="timeline">
    <div><b>阶段一</b><span>范围确认</span><p>冻结事件类型、关键角色、指标口径与验收标准。</p></div>
    <div><b>阶段二</b><span>能力建设</span><p>完成事件模型、调度策略、工作台和接口联调。</p></div>
    <div><b>阶段三</b><span>灰度验证</span><p>选择典型场景试点，验证稳定性、体验和数据一致性。</p></div>
    <div><b>阶段四</b><span>全量推广</span><p>分批切换、现场保障、问题复盘和运营指标沉淀。</p></div>
  </div>
</div>

---

<div class="slide-frame risk-page">
  <div class="section-label">04 / Assurance</div>
  <h2>风险与保障措施</h2>
  <div class="risk-grid">
    <div><b>数据一致性风险</b><p>升级前完成事件数据映射、迁移演练和回滚校验报表。</p></div>
    <div><b>流程切换风险</b><p>保留旧流程兼容入口，灰度期间按组织和场景分批迁移。</p></div>
    <div><b>用户接受风险</b><p>提供操作手册、演示视频、现场培训和首周驻场支持。</p></div>
    <div><b>上线稳定风险</b><p>建立监控大盘、应急联系人、冻结窗口和分钟级回滚预案。</p></div>
  </div>
</div>

---

<div class="slide-frame closing">
  <div class="section-label">Next Step</div>
  <h2>下一步需要补齐的信息</h2>
  <ul>
    <li>确认PUC升级范围：事件类型、组织边界、终端范围、外部系统接口。</li>
    <li>补充现网基线数据：事件量、峰值并发、平均响应时长、闭环率。</li>
    <li>提供Figma模板导出素材：封面图形、图标、字体、色板与页面组件。</li>
    <li>确认汇报时长与听众角色，进一步压缩为管理层版或扩展为实施方案版。</li>
  </ul>
</div>

<style>
.slidev-layout { padding: 0; background: #eef3ff; }
.slide-frame { width:100%; height:100%; padding:48px 64px; color:#142047; font-family:"Inter","PingFang SC","Microsoft YaHei",sans-serif; background: radial-gradient(circle at 12% 12%, rgba(69,222,210,.20), transparent 25%), radial-gradient(circle at 90% 10%, rgba(87,112,255,.24), transparent 30%), linear-gradient(135deg,#ffffff 0%,#f3f7ff 100%); position:relative; overflow:hidden; }
.slide-frame::before { content:""; position:absolute; inset:18px; border:1px solid rgba(22,55,210,.10); border-radius:30px; pointer-events:none; }
.slide-frame::after { content:""; position:absolute; right:-96px; bottom:-132px; width:390px; height:390px; border-radius:50%; background:linear-gradient(135deg,rgba(60,92,230,.18),rgba(15,185,177,.16)); }
h1,h2,p{margin:0} h1{font-size:58px; line-height:1.12; font-weight:950; letter-spacing:.04em;} h2{font-size:34px; line-height:1.25; font-weight:950; margin:14px 0 24px; max-width:850px;} .section-label,.cover-kicker{display:inline-flex;align-items:center;border-radius:999px;background:#1637d2;color:white;padding:8px 18px;font-size:13px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.lead{font-size:18px;line-height:1.8;color:#53617f;max-width:670px}.cover{display:flex;flex-direction:column;justify-content:center;gap:22px}.cover-subtitle{font-size:24px;color:#53617f;max-width:760px}.cover-meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:30px;color:#6d7896;font-weight:800}.cover-meta span{background:rgba(255,255,255,.72);padding:10px 14px;border-radius:999px}.orbit{position:absolute;border-radius:50%;border:1px solid rgba(22,55,210,.20)}.orbit-a{width:520px;height:520px;right:-100px;top:-100px}.orbit-b{width:360px;height:360px;right:40px;top:30px;border-color:rgba(15,185,177,.25)}
.agenda-grid,.objective-grid,.risk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;position:relative;z-index:1}.agenda-grid div,.objective-grid article,.risk-grid div,.metric-card,.process-flow div{background:rgba(255,255,255,.88);border:1px solid rgba(33,62,150,.12);border-radius:24px;padding:22px;box-shadow:0 18px 42px rgba(23,49,132,.10)}.agenda-grid b{color:#1637d2;font-size:28px}.agenda-grid span,.objective-grid span{display:block;margin:10px 0;font-size:20px;font-weight:950}.agenda-grid p,.objective-grid p,.risk-grid p,.metric-card p,.process-flow p{color:#61708f;line-height:1.6}.split-page{display:grid;grid-template-columns:1fr 310px;gap:42px;align-items:center}.pain-list{display:grid;gap:14px;margin-top:24px}.pain-list div{display:grid;grid-template-columns:132px 1fr;gap:16px;align-items:center;background:#fff;border-radius:16px;padding:15px 18px}.pain-list strong{color:#1637d2}.metric-card{text-align:center}.metric-card span{color:#6d7896;font-weight:900}.metric-card b{display:block;font-size:38px;margin:18px 0;color:#0fb9b1}.objective-grid b{display:block;font-size:25px;color:#1637d2;margin-bottom:10px}
.architecture{display:grid;grid-template-columns:1fr 42px 1.1fr 42px 1.1fr;align-items:center;gap:10px;margin:8px 0 20px;position:relative;z-index:1}.node{border-radius:22px;padding:20px;background:#fff;box-shadow:0 16px 36px rgba(23,49,132,.10);border:1px solid rgba(33,62,150,.12)}.node b{display:block;color:#1637d2;font-size:22px;margin-bottom:8px}.node span{color:#61708f}.node.bus{background:linear-gradient(135deg,#1637d2,#6a83ff);color:#fff}.node.bus b,.node.bus span{color:#fff}.arrow{text-align:center;color:#0b9f99;font-size:30px;font-weight:950}.layer-stack{display:grid;gap:12px}.layer-stack div{display:grid;grid-template-columns:120px 1fr;gap:22px;padding:16px 22px;border-radius:18px;background:linear-gradient(90deg,#183bd6,#5d7cff);color:#fff;box-shadow:0 16px 30px rgba(30,60,200,.14)}.layer-stack div:nth-child(even){background:linear-gradient(90deg,#0b9f99,#33c9c0)}.layer-stack b{font-size:19px}.layer-stack span{opacity:.92}
.process-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:42px;position:relative;z-index:1}.process-flow div{min-height:210px}.process-flow b{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#1637d2;color:#fff;font-size:22px}.process-flow span{display:block;font-size:22px;font-weight:950;color:#142047;margin:22px 0 10px}table{width:100%;border-collapse:separate;border-spacing:0 12px;position:relative;z-index:1}th{text-align:left;color:#62708e;padding:10px 18px}td{background:#fff;padding:17px 18px;border-top:1px solid rgba(33,62,150,.10);border-bottom:1px solid rgba(33,62,150,.10)}td:first-child{border-radius:16px 0 0 16px;font-weight:950;color:#1637d2}td:last-child{border-radius:0 16px 16px 0;color:#0b8f89;font-weight:850}.timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:46px;position:relative;z-index:1}.timeline div{min-height:220px;border-radius:28px;padding:24px;color:#fff;background:linear-gradient(160deg,#1637d2,#6a83ff);box-shadow:0 24px 44px rgba(23,49,132,.18)}.timeline div:nth-child(even){margin-top:42px;background:linear-gradient(160deg,#0b9f99,#3ad5ca)}.timeline b{display:block;font-size:18px;opacity:.84}.timeline span{display:block;font-size:25px;font-weight:950;margin:18px 0}.timeline p{line-height:1.6;opacity:.92}.risk-grid b{display:block;font-size:22px;color:#1637d2;margin-bottom:12px}.closing ul{margin-top:28px;font-size:21px;line-height:2.05;color:#3f4d6e;position:relative;z-index:1}
</style>
