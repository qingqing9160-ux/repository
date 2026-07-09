---
theme: default
title: 工艺创新 · 全链路降本
class: process-saving-slide
css: unocss
---

<div class="deck-page">
  <header class="page-header">
    <h1>工艺创新 · 全链路降本</h1>
    <div class="subtitle">单一工序 → 复合工艺</div>
  </header>

  <main class="process-grid">
    <section class="source-column" aria-label="单一工序">
      <div class="source-card card-top">
        <div class="visual visual-injection"><span>IMD</span><span>IML</span></div>
        <strong>IMD、IML、模内注塑</strong>
      </div>
      <div class="source-card card-mid">
        <div class="visual visual-cnc"><span>CNC</span></div>
        <strong>车铣一体化</strong>
      </div>
      <div class="source-card card-bottom">
        <div class="visual visual-laser"><span>Laser</span></div>
        <strong>激光数冲一体化</strong>
      </div>
    </section>

    <section class="center-column" aria-label="工艺降本">
      <div class="flow-lines">
        <span></span><span></span><span></span>
      </div>
      <div class="core-badge">
        <div class="trend-icon">↗</div>
        <div>工艺降本</div>
      </div>
      <div class="next-arrows">▶ ▶</div>
    </section>

    <section class="result-column" aria-label="复合工艺成果">
      <article class="result-card mirror-card">
        <div class="result-title">防爆镜片IMD成型 <em>降本 <b>13元/PCS</b></em></div>
        <div class="mirror-process">
          <div class="layer-stack">
            <span>胶片</span><span>主镜镜片</span><span>膜片</span>
          </div>
          <div class="process-arrow">➜</div>
          <div class="lens-output">镜片</div>
        </div>
        <p>OCA胶贴合</p>
        <ul><li>IMD替代OCA胶贴合</li></ul>
      </article>

      <article class="result-card handle-card">
        <div class="result-title">DS930把手固定座一体化成型 <em>降本 <b>91元/PCS</b></em></div>
        <div class="part-process">
          <div class="part handle-before"></div>
          <div class="process-arrow">➜</div>
          <div class="part handle-after"></div>
        </div>
        <ul><li>车铣一体化加工部件单一CNC加工</li></ul>
      </article>

      <article class="result-card bracket-card">
        <div class="result-title">便携背包支架一体化成型 <em>降本 <b>200元/PCS</b></em></div>
        <div class="bracket-visual"></div>
        <ul><li>激光数冲一体化工艺替代单一切割、数冲加工</li></ul>
      </article>
    </section>
  </main>
</div>

<style>
.slidev-layout { padding: 0; background: linear-gradient(115deg, #eff6ff 0%, #f8fbff 48%, #ffffff 100%); }
.deck-page { width: 100%; height: 100%; padding: 22px 36px 24px; color: #06215c; font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif; }
.page-header { display: grid; place-items: center; gap: 10px; margin-bottom: 8px; }
.page-header h1 { margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 0.12em; }
.subtitle { padding: 9px 56px; border-radius: 999px; background: rgba(255,255,255,.86); box-shadow: 0 10px 24px rgba(22, 65, 148, .14); border: 1px solid rgba(69, 112, 191, .16); font-size: 17px; font-weight: 800; }
.process-grid { height: calc(100% - 88px); display: grid; grid-template-columns: 250px 280px 1fr; gap: 26px; align-items: center; }
.source-column { display: grid; gap: 18px; position: relative; z-index: 2; }
.source-card { min-height: 116px; border-radius: 4px; background: rgba(255,255,255,.88); box-shadow: 0 16px 32px rgba(28, 71, 145, .12); display: grid; grid-template-columns: 95px 1fr; align-items: center; gap: 18px; padding: 16px; position: relative; }
.source-card::after { content: "↗"; position: absolute; right: 92px; bottom: 14px; color: #2458bd; font-size: 34px; line-height: 1; }
.source-card strong { font-size: 16px; color: #111827; }
.visual { height: 62px; border-radius: 2px; display: grid; place-items: center; color: white; font-weight: 900; font-size: 12px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255,255,255,.4); }
.visual-injection { background: linear-gradient(135deg,#244f7f,#c66d3f); grid-template-columns: 1fr 1fr; gap: 2px; padding: 8px; }
.visual-cnc { background: linear-gradient(135deg,#111827,#9ca3af); }
.visual-laser { background: linear-gradient(135deg,#1e3a8a,#ef4444); }
.center-column { height: 100%; display: grid; place-items: center; position: relative; }
.flow-lines { position: absolute; left: -120px; right: 70px; top: 19%; bottom: 18%; pointer-events: none; }
.flow-lines span { position: absolute; width: 310px; height: 92px; border: 14px solid rgba(62, 107, 207, .22); border-left: 0; border-radius: 0 120px 120px 0; transform-origin: left center; }
.flow-lines span:nth-child(1) { top: 0; transform: rotate(-16deg); }
.flow-lines span:nth-child(2) { top: 35%; transform: rotate(0deg); border-color: rgba(206, 155, 55, .20); }
.flow-lines span:nth-child(3) { bottom: 0; transform: rotate(16deg); }
.core-badge { width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #4f76e6, #1f45b8 72%); color: white; display: grid; place-items: center; align-content: center; gap: 14px; box-shadow: 0 26px 48px rgba(33, 76, 184, .28), 0 0 0 14px rgba(70, 111, 202, .12); font-size: 30px; font-weight: 900; z-index: 2; }
.trend-icon { width: 76px; height: 60px; display: grid; place-items: center; border-radius: 4px; background: rgba(4, 31, 96, .44); color: #b9ffe4; font-size: 54px; }
.next-arrows { position: absolute; right: 0; font-size: 44px; letter-spacing: -10px; color: #2f62c3; }
.result-column { background: rgba(255,255,255,.88); padding: 10px 34px; min-height: 100%; display: grid; gap: 6px; }
.result-card { padding: 6px 0 8px; border-bottom: 1px dashed #777; color: #111827; }
.result-card:last-child { border-bottom: 0; }
.result-title { text-align: center; font-size: 16px; font-weight: 900; color: #111827; }
.result-title em { font-style: normal; font-size: 13px; margin-left: 8px; }
.result-title b { color: #00a651; font-size: 17px; }
.result-card ul { margin: 4px 0 0 52%; font-size: 10px; color: #111827; }
.result-card p { text-align: center; margin: 2px 0; font-size: 10px; }
.mirror-process, .part-process { display: grid; grid-template-columns: 1fr 54px 1fr; align-items: center; gap: 10px; margin: 6px 0 0; }
.layer-stack { display: grid; gap: 3px; font-size: 10px; }
.layer-stack span { height: 9px; background: linear-gradient(90deg,#475569,#e5e7eb,#334155); border-radius: 999px; padding-left: 6px; color: #111827; }
.process-arrow { color: #1f72c9; text-align: center; font-size: 34px; font-weight: 900; }
.lens-output { height: 14px; border-radius: 999px; background: linear-gradient(90deg,#111827,#94a3b8,#111827); color: #111827; font-size: 10px; text-align: right; padding-right: 4px; }
.part { width: 110px; height: 56px; justify-self: center; background: #222; border-radius: 24px 10px 10px 24px; box-shadow: inset 10px 12px 0 rgba(255,255,255,.12); position: relative; }
.part::before, .part::after { content: ""; position: absolute; border-radius: 50%; background: #444; width: 25px; height: 25px; top: 13px; }
.part::before { left: 18px; } .part::after { right: 21px; }
.handle-after { width: 118px; background: #151515; }
.bracket-visual { width: 80px; height: 92px; margin: 6px auto 0; border: 8px solid #1f2937; border-radius: 6px; background: repeating-linear-gradient(45deg, transparent 0 8px, rgba(250,204,21,.85) 8px 11px), linear-gradient(#eef2ff,#fff); box-shadow: inset 0 0 0 4px rgba(15,23,42,.2); }
</style>
