import { useState } from 'react'

interface SettingsModalProps {
  initialApiKey: string
  onSave: (apiKey: string) => void
  onClose: () => void
}

export default function SettingsModal({ initialApiKey, onSave, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [showKey, setShowKey] = useState(false)
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleTest = async () => {
    if (!apiKey.trim()) return
    setStatus('testing')
    setErrorMsg('')
    try {
      const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10,
        }),
      })
      if (res.ok) {
        setStatus('ok')
      } else {
        const err = await res.json().catch(() => ({}))
        setStatus('fail')
        setErrorMsg(err?.error?.message ?? `错误码 ${res.status}`)
      }
    } catch {
      setStatus('fail')
      setErrorMsg('网络连接失败')
    }
  }

  const handleSave = () => {
    onSave(apiKey.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="font-semibold text-gray-800">API 设置</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Provider Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">🆓</span>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">智谱AI · GLM-4-Flash（完全免费）</p>
                <p className="text-xs text-blue-600 mb-3">国内直连，无需VPN。免费额度充足，满足日常使用。</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>访问 <span className="font-mono bg-blue-100 px-1 rounded">open.bigmodel.cn</span> 注册账号</li>
                  <li>进入「API密钥」页面，点击「创建API Key」</li>
                  <li>复制生成的 Key，粘贴到下方输入框</li>
                </ol>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setStatus('idle') }}
                placeholder="请粘贴您的 API Key，例如：xxxxxxxx.xxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Validation status */}
            {status === 'ok' && (
              <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                连接成功，API Key 有效
              </p>
            )}
            {status === 'fail' && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                验证失败：{errorMsg}
              </p>
            )}
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-400 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            API Key 仅保存在您本机的浏览器中，不会上传到任何服务器。
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleTest}
            disabled={!apiKey.trim() || status === 'testing'}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'testing' ? '验证中…' : '验证连接'}
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            保存并使用
          </button>
        </div>
      </div>
    </div>
  )
}
