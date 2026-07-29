import { ChangeEvent, useEffect, useRef, useState } from 'react'

type Template = { id: string; title: string; sub: string; text: string; color: string; accent: string }

const templates: Template[] = [
  { id: 'think', title: '我想想', sub: '思考一下下', text: '我想想…', color: '#f9f3e9', accent: '#ff6846' },
  { id: 'work', title: '不想上班', sub: '今日已电量不足', text: '不想上班', color: '#eef7f3', accent: '#3da580' },
  { id: 'angry', title: '生气了', sub: '哄不好的那种', text: '生气了！', color: '#fff0ed', accent: '#ef4b39' },
]

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, JSX.Element> = {
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 14v5h14v-5"/></>,
    download: <><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
    spark: <path d="m12 2 1.5 5.2L19 9l-5.5 1.7L12 16l-1.5-5.3L5 9l5.5-1.8L12 2Z"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    refresh: <><path d="M20 7v5h-5"/><path d="M18.5 15a7 7 0 1 1-.3-6.5L20 12"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function CatArt({ mood = 'think' }: { mood?: string }) {
  return <div className={`cat cat-${mood}`} aria-label="示例猫咪插画">
    <div className="cat-tail"/><div className="cat-body"/>
    <div className="cat-head"><span className="ear left"/><span className="ear right"/><span className="eye left"/><span className="eye right"/><span className="nose"/><span className="mouth"/><i className="stripe s1"/><i className="stripe s2"/></div>
    <div className="paw left"/><div className="paw right"/>
  </div>
}

export default function BriefFlowHero() {
  const [selected, setSelected] = useState(0)
  const [fileUrl, setFileUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const tpl = templates[selected]

  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl) }, [fileUrl])

  const chooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    setFileUrl(URL.createObjectURL(file)); setFileName(file.name); setGenerated(false)
  }

  const generate = () => {
    setIsGenerating(true); setGenerated(false)
    window.setTimeout(() => { setIsGenerating(false); setGenerated(true); resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 850)
  }

  const download = (size: number) => {
    const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = tpl.color; ctx.fillRect(0, 0, size, size)
    ctx.textAlign = 'center'; ctx.fillStyle = '#292622'; ctx.font = `900 ${size * .12}px sans-serif`; ctx.fillText(tpl.text, size / 2, size * .18)
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = size * .018; ctx.strokeRect(size * .055, size * .055, size * .89, size * .89)
    const finish = () => { const a = document.createElement('a'); a.download = `PetMaker-${tpl.id}-${size}.png`; a.href = canvas.toDataURL('image/png'); a.click() }
    if (fileUrl) { const img = new Image(); img.onload = () => { const ratio = Math.min(size * .65 / img.width, size * .62 / img.height); const w = img.width * ratio, h = img.height * ratio; ctx.save(); ctx.beginPath(); ctx.roundRect((size-w)/2, size*.27, w, h, size*.06); ctx.clip(); ctx.drawImage(img, (size-w)/2, size*.27, w, h); ctx.restore(); finish() }; img.src = fileUrl } else { ctx.font = `${size * .38}px serif`; ctx.fillText('🐱', size / 2, size * .68); finish() }
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark"><span>●</span><span>●</span><b>⌄</b></span><span>PetMaker<small>宠物表情包生成器</small></span></a>
      <nav><a href="#how">制作流程</a><a href="#templates">模板广场</a><a href="#faq">常见问题</a></nav>
      <button className="ghost-btn" onClick={() => inputRef.current?.click()}><Icon name="upload" size={17}/> 上传宠物照片</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><Icon name="spark" size={15}/> 让每只小可爱都有自己的表情包</div>
          <h1>把你家主子，<br/>变成<span>专属表情包</span></h1>
          <p>上传一张宠物照片，选择喜欢的模板，<br/>30 秒生成独一无二的可爱表情。</p>
          <button className="primary hero-button" onClick={() => inputRef.current?.click()}><Icon name="upload"/> 开始制作 <Icon name="arrow" size={18}/></button>
          <div className="trust"><span><Icon name="check" size={14}/> 自动智能抠图</span><span><Icon name="check" size={14}/> 免费高清下载</span><span><Icon name="check" size={14}/> 无需登录</span></div>
        </div>
        <div className="hero-art"><div className="burst">✦</div><div className="bubble b1">WOW!</div><div className="bubble b2">♡</div><div className="sticker-card back"><CatArt mood="angry"/><b>生气了！</b></div><div className="sticker-card front"><span className="tape"/><CatArt/><b>让我想想…</b></div><div className="dots">•••</div></div>
      </section>

      <section className="maker" id="how">
        <div className="section-heading"><span>JUST 3 STEPS</span><h2>三步，制作你的专属表情</h2><p>简单到连猫猫都能学会</p></div>
        <div className="steps"><span className="active">1 <b>上传照片</b></span><i/><span>2 <b>选择模板</b></span><i/><span>3 <b>生成下载</b></span></div>
        <div className="studio">
          <div className="upload-panel">
            <div className="panel-title"><em>01</em><div><h3>上传宠物照片</h3><p>清晰的正面或半身照效果更佳</p></div></div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} hidden/>
            <button className={`dropzone ${fileUrl ? 'has-file' : ''}`} onClick={() => inputRef.current?.click()}>
              {fileUrl ? <><img src={fileUrl} alt="已上传宠物"/><span className="file-pill"><Icon name="check" size={14}/>{fileName}</span></> : <><span className="upload-icon"><Icon name="image" size={29}/><i>+</i></span><b>点击或拖拽上传照片</b><small>支持 JPG、PNG、WEBP，最大 10MB</small></>}
            </button>
            <div className="tip"><span>💡</span><p><b>拍摄小贴士</b><br/>单只宠物 · 光线充足 · 主体完整 · 背景不限</p></div>
          </div>
          <div className="template-panel" id="templates">
            <div className="panel-title"><em>02</em><div><h3>选择表情模板</h3><p>更多有趣模板持续更新中</p></div></div>
            <div className="template-list">{templates.map((item, i) => <button key={item.id} onClick={() => { setSelected(i); setGenerated(false) }} className={selected === i ? 'selected' : ''}>
              <span className="mini-preview" style={{ background: item.color }}><CatArt mood={item.id}/><b>{item.text}</b></span><span><strong>{item.title}</strong><small>{item.sub}</small></span>{selected === i && <i><Icon name="check" size={13}/></i>}
            </button>)}</div>
            <button className="primary generate" onClick={generate} disabled={isGenerating}>{isGenerating ? <><span className="spinner"/> 正在施展魔法…</> : <><Icon name="spark"/> 生成我的表情包 <Icon name="arrow" size={18}/></>}</button>
          </div>
          <div className="result-panel" ref={resultRef}>
            <div className="panel-title"><em>03</em><div><h3>预览与下载</h3><p>{generated ? '你的专属表情包已完成！' : '生成后可预览下载'}</p></div></div>
            <div className={`result-card ${generated ? 'done' : ''}`} style={{ background: tpl.color }}>
              {fileUrl ? <img className="user-pet" src={fileUrl} alt="宠物合成预览"/> : <CatArt mood={tpl.id}/>}<b>{tpl.text}</b><span className="decor">{tpl.id === 'angry' ? '♨' : tpl.id === 'work' ? 'Z z' : '💭'}</span>
            </div>
            <div className="size-row"><span><b>微信表情</b><small>240 × 240 PNG</small></span><button onClick={() => download(240)}><Icon name="download" size={17}/> 下载</button></div>
            <div className="size-row"><span><b>高清原图</b><small>1000 × 1000 PNG</small></span><button onClick={() => download(1000)}><Icon name="download" size={17}/> 下载</button></div>
            <button className="again" onClick={generate}><Icon name="refresh" size={16}/> 换一个再生成</button>
          </div>
        </div>
      </section>
      <section className="privacy" id="faq"><span>🔒</span><div><b>你的照片，很安全</b><p>照片仅用于本次表情包制作，处理完成后将自动删除。我们不会存储或分享你的任何照片。</p></div><strong>隐私保护承诺 →</strong></section>
    </main>
    <footer><div className="brand"><span className="brand-mark"><span>●</span><span>●</span><b>⌄</b></span><span>PetMaker<small>记录每一份可爱</small></span></div><p>© 2026 PetMaker · Made with ♡ for pets</p><div><a href="#faq">隐私政策</a><a href="#faq">使用条款</a><a href="#faq">联系我们</a></div></footer>
  </div>
}
