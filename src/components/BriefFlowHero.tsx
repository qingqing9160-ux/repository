import { useMemo, useRef, useState } from 'react'

type Kind = 'group' | 'single' | 'system' | 'alert' | 'callback'
type Tab = 'all' | 'group' | 'system' | 'alert'
type Screen = 'list' | 'chat' | 'alertDetail'

type Conversation = {
  id: string
  kind: Kind
  title: string
  subtitle: string
  time: string
  unread: number
  pinned?: boolean
  muted?: boolean
  weight?: boolean
  color?: string
  deleting?: boolean
}

const initialConversations: Conversation[] = [
  { id: 'sos-1', kind: 'alert', title: 'SOS 紧急求援 · 张伟', subtitle: '西区泵站 B2：人员摔倒，请立即支援', time: '2026-07-06T09:42:00', unread: 1 },
  { id: 'callback-1', kind: 'callback', title: '回呼请求 · 95598 工单', subtitle: '用户要求现场人员回呼确认停电范围', time: '2026-07-06T09:36:00', unread: 2 },
  { id: 'pin-1', kind: 'group', title: '抢修一队群', subtitle: '王强：备品备件已到达 3 号门', time: '2026-07-06T09:30:00', unread: 8, pinned: true, color: '#1677FF' },
  { id: 'pin-2', kind: 'group', title: '暴雨应急保障群', subtitle: '调度：低洼点位每 15 分钟回报一次', time: '2026-07-06T08:58:00', unread: 5, pinned: true, color: '#FA8C16' },
  { id: 'single-1', kind: 'single', title: '刘明 · 副队长', subtitle: '先去 4 号箱变，我随后带安全围栏过去', time: '2026-07-06T08:16:00', unread: 3, weight: true, color: '#00B96B' },
  { id: 'sys-1', kind: 'system', title: '越区告警通知', subtitle: '车辆 PUC-A17 离开东城抢修责任区', time: '2026-07-05T18:40:00', unread: 1 },
  { id: 'group-1', kind: 'group', title: '东城片区联络群', subtitle: '李工：环网柜巡视完成，暂无异常', time: '2026-07-05T15:12:00', unread: 4, color: '#7B61FF' },
  { id: 'group-2', kind: 'group', title: '物资与车辆协调群', subtitle: '仓库：绝缘手套补货 20 副', time: '2026-06-30T11:22:00', unread: 0, muted: true, color: '#4E5969' },
]

function formatTime(iso: string) {
  const d = new Date(iso)
  const today = new Date('2026-07-06T12:00:00')
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (d.toDateString() === yesterday.toDateString()) return '昨天'
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function Badge({ count, muted }: { count: number; muted?: boolean }) {
  if (!count) return null
  return <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold text-white ${muted ? 'bg-[#C9CDD4]' : 'bg-[#F5222D]'}`}>{count}</span>
}

function AndroidStatusBar() {
  return <div className="flex h-7 items-center justify-between px-6 text-[12px] font-semibold text-[#1D2129]"><span>9:41</span><div className="flex items-center gap-1"><span>5G</span><span className="h-3 w-4 rounded-sm border border-[#1D2129]"><span className="block h-full w-3 rounded-[1px] bg-[#1D2129]" /></span></div></div>
}

function Avatar({ item, small = false }: { item: Conversation; small?: boolean }) {
  const size = small ? 'h-10 w-10' : 'h-[46px] w-[46px]'
  if (item.kind === 'system' || item.kind === 'callback' || item.kind === 'alert') {
    const bg = item.kind === 'alert' ? 'bg-[#F5222D]' : item.kind === 'callback' ? 'bg-[#FA8C16]' : 'bg-[#1677FF]'
    return <div className={`${size} flex shrink-0 items-center justify-center rounded-xl ${bg} text-xl font-black text-white`}>{item.kind === 'alert' ? '!' : item.kind === 'callback' ? '↩' : '⌁'}</div>
  }
  return <div className={`${size} flex shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`} style={{ background: item.color }}>{item.kind === 'single' ? item.title[0] : '群'}</div>
}

export default function BriefFlowHero() {
  const [items, setItems] = useState(initialConversations)
  const [tab, setTab] = useState<Tab>('all')
  const [menu, setMenu] = useState<Conversation | null>(null)
  const [openSwipe, setOpenSwipe] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('list')
  const [active, setActive] = useState<Conversation | null>(null)
  const [sosHandled, setSosHandled] = useState(false)
  const touch = useRef({ x: 0, id: '', timer: 0, moved: false })

  const unread = useMemo(() => ({
    all: items.reduce((s, i) => s + i.unread, 0),
    group: items.filter(i => i.kind === 'group').reduce((s, i) => s + i.unread, 0),
    system: items.filter(i => i.kind === 'system' || i.kind === 'callback').reduce((s, i) => s + i.unread, 0),
    alert: items.filter(i => i.kind === 'alert').reduce((s, i) => s + i.unread, 0),
  }), [items])

  const visible = items.filter(i => !i.deleting)
  const sos = visible.find(i => i.kind === 'alert')
  const callback = visible.find(i => i.kind === 'callback')
  const pinned = visible.filter(i => i.pinned && i.kind === 'group').slice(0, 2)
  const normal = visible.filter(i => i.kind !== 'alert' && i.kind !== 'callback' && !i.pinned).filter(i => tab === 'all' || i.kind === tab || (tab === 'system' && i.kind === 'system')).sort((a, b) => +new Date(b.time) - +new Date(a.time))
  const showSpecial = tab === 'all' || tab === 'alert'
  const showCallback = tab === 'all' || tab === 'system'
  const showPinned = tab === 'all' || tab === 'group'

  const update = (id: string, patch: Partial<Conversation>) => setItems(v => v.map(i => i.id === id ? { ...i, ...patch } : i))
  const remove = (id: string) => { update(id, { deleting: true }); setTimeout(() => setItems(v => v.filter(i => i.id !== id)), 260) }
  const pin = (id: string) => { setItems(v => v.map(i => i.id === id ? { ...i, pinned: true } : i)); setOpenSwipe(null); setMenu(null) }
  const mute = (id: string) => { update(id, { muted: true }); setOpenSwipe(null); setMenu(null) }
  const openItem = (item: Conversation) => { update(item.id, { unread: 0 }); setActive(item); setScreen(item.kind === 'alert' ? 'alertDetail' : 'chat') }

  const row = (item: Conversation, swipe = true) => {
    const opened = openSwipe === item.id
    return <div key={item.id} className={`relative overflow-hidden border-b border-[#E5E6EB] bg-white transition-all duration-300 ${item.deleting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      {swipe && <div className="absolute right-0 top-0 flex h-full w-[216px] text-sm font-bold text-white"><button onClick={() => pin(item.id)} className="w-[72px] bg-[#1677FF] active:opacity-70">置顶</button><button onClick={() => mute(item.id)} className="w-[72px] bg-[#4E5969] active:opacity-70">免打扰</button><button onClick={() => remove(item.id)} className="w-[72px] bg-[#F5222D] active:opacity-70">删除</button></div>}
      <button className={`flex w-full items-center gap-3 px-4 py-3 text-left transition duration-200 active:opacity-60 ${item.weight ? 'bg-[#F7FBFF]' : 'bg-white'}`} style={{ transform: opened ? 'translateX(-216px)' : 'translateX(0)', transition: 'transform 220ms ease' }}
        onClick={() => openItem(item)} onTouchStart={e => { touch.current = { x: e.touches[0].clientX, id: item.id, moved: false, timer: window.setTimeout(() => setMenu(item), 500) } }}
        onTouchMove={e => { const dx = touch.current.x - e.touches[0].clientX; if (Math.abs(dx) > 8) { touch.current.moved = true; clearTimeout(touch.current.timer) } }}
        onTouchEnd={e => { clearTimeout(touch.current.timer); const dx = touch.current.x - e.changedTouches[0].clientX; if (swipe && dx > 288) pin(item.id); else if (swipe && dx > 180) setOpenSwipe(item.id); else if (dx < -30) setOpenSwipe(null) }}>
        <Avatar item={item} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className={`truncate ${item.weight ? 'font-black text-[#1D2129]' : 'font-semibold text-[#1D2129]'}`}>{item.title}</p><span className="text-xs text-[#86909C]">{formatTime(item.time)}</span></div><p className="mt-1 truncate text-sm text-[#4E5969]">{item.subtitle}</p></div><Badge count={item.unread} muted={item.muted} />
      </button>
    </div>
  }

  if (screen !== 'list' && active) return <div className="flex min-h-screen items-center justify-center bg-slate-200"><div className="h-[812px] w-[375px] overflow-hidden rounded-[28px] bg-[#F2F3F5] shadow-2xl"><AndroidStatusBar /><div className="flex h-12 items-center gap-3 bg-white px-4"><button onClick={() => setScreen('list')} className="text-2xl active:opacity-60">‹</button><b>{screen === 'alertDetail' ? '告警详情' : active.title}</b></div><main className="p-4"><div className={`rounded-2xl p-4 ${screen === 'alertDetail' ? (sosHandled ? 'bg-gray-100 text-[#86909C]' : 'bg-[#FFF1F0]') : 'bg-white'}`}><h2 className="text-lg font-black">{active.title}</h2><p className="mt-2 text-sm text-[#4E5969]">{active.subtitle}</p>{screen === 'alertDetail' && <button onClick={() => { setSosHandled(true); update(active.id, { unread: 0, subtitle: '已处理 · 原求援记录保留在消息列表原位' }) }} className="mt-5 w-full rounded-xl bg-[#00B96B] py-3 font-bold text-white active:opacity-70">处理</button>}</div></main></div></div>

  return <div className="flex min-h-screen items-center justify-center bg-slate-200"><div className="relative h-[812px] w-[375px] overflow-hidden rounded-[28px] bg-[#F2F3F5] shadow-2xl"><AndroidStatusBar />
    <header className="bg-white px-4 pb-2"><div className="flex items-center gap-3 py-2"><div className="flex h-9 flex-1 items-center rounded-lg bg-[#F2F3F5] px-3 text-sm text-[#86909C]">🔍 搜索联系人、群组或工单</div><button className="h-9 w-9 rounded-lg bg-[#1677FF] text-2xl leading-8 text-white active:opacity-70">+</button></div><div className="flex justify-between text-sm font-semibold">{(['all','group','system','alert'] as Tab[]).map(t => <button key={t} onClick={() => setTab(t)} className="relative px-2 py-2 active:opacity-60"><span className={tab === t ? 'text-[#1677FF]' : 'text-[#4E5969]'}>{{all:'全部',group:'群聊',system:'系统',alert:'告警'}[t]}</span><Badge count={unread[t]} /><span className={`absolute bottom-0 left-2 h-0.5 rounded-full bg-[#1677FF] transition-all ${tab === t ? 'w-8' : 'w-0'}`} /></button>)}</div></header>
    <main className="h-[674px] overflow-y-auto pb-20">{showSpecial && sos && <button onClick={() => openItem(sos)} className={`m-3 flex w-[calc(100%-24px)] items-center gap-3 rounded-2xl border border-[#F5222D]/20 p-3 text-left active:opacity-70 ${sosHandled ? 'bg-gray-100 opacity-70' : 'bg-[#FFF1F0]'}`}><Avatar item={sos} /><div className="flex-1"><b className="text-[#F5222D]">{sosHandled ? '已处理 · ' : ''}{sos.title}</b><p className="text-sm text-[#4E5969]">{sos.subtitle}</p></div><Badge count={sos.unread} /></button>}
      {showCallback && callback && <div className="mx-3 mb-3 overflow-hidden rounded-2xl">{row(callback)}</div>}
      {showPinned && pinned.length > 0 && <section className="mx-3 mb-3 rounded-2xl bg-[#EDEFF2] p-2"><p className="px-2 pb-1 text-xs font-bold text-[#86909C]">置顶群聊</p>{pinned.map(p => <div key={p.id} className="relative overflow-hidden rounded-xl bg-white mb-2 last:mb-0"><span className="absolute left-2 top-2 z-10 text-xs">📌</span><span className="absolute bottom-2 right-2 z-10 rounded bg-[#1677FF] px-1 text-[10px] text-white">群</span>{row(p, false)}</div>)}</section>}
      <section className="overflow-hidden bg-white">{normal.map(i => row(i))}</section></main>
    <nav className="absolute bottom-0 grid h-16 w-full grid-cols-6 border-t border-[#E5E6EB] bg-white text-[11px] text-[#86909C]">{['地图','资源','通信','任务','消息','我的'].map(x => <button key={x} className={`active:opacity-60 ${x === '消息' ? 'font-bold text-[#1677FF]' : ''}`}><div className="text-lg">{x === '消息' ? '●' : '○'}</div>{x}</button>)}</nav>
    {menu && <div onClick={() => setMenu(null)} className="absolute inset-0 z-20 bg-black/20"><div onClick={e => e.stopPropagation()} className="absolute left-16 top-72 flex overflow-hidden rounded-2xl bg-white shadow-xl"><button onClick={() => pin(menu.id)} className="px-5 py-3 active:opacity-60">置顶</button><button onClick={() => mute(menu.id)} className="px-5 py-3 active:opacity-60">免打扰</button><button onClick={() => remove(menu.id)} className="px-5 py-3 text-[#F5222D] active:opacity-60">删除</button></div></div>}
  </div></div>
}
