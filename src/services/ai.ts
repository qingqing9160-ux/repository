// 智谱AI GLM-4-Flash（完全免费，国内直连）
// 申请地址：https://open.bigmodel.cn/

const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL = 'glm-4-flash'

const SYSTEM_PROMPT = `你是一位专业的医疗行政AI助理，专门服务于中国医院的行政管理人员。

你的核心能力：
1. 文献查询：解读国内外医学文献、临床指南、研究报告，注明文献来源
2. 政策法规：查询解读国家卫健委、各省卫健委发布的医疗政策、法规、通知文件
3. 文书撰写：按照规范格式协助撰写各类医疗行政文书

回答要求：
- 语言简洁专业，使用标准医疗行政术语
- 涉及具体政策请注明文件来源（如"根据国家卫健委XX年XX号文"）
- 撰写文书时严格按照正式公文格式输出，包含完整结构
- 无法确认的数据或内容，明确告知用户需自行核实
- 始终用中文回答`

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function streamChat(
  history: ChatMessage[],
  apiKey: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (message: string) => void
): Promise<void> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
  ]

  let response: Response
  try {
    response = await fetch(ZHIPU_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: MODEL, messages, stream: true }),
    })
  } catch {
    onError('网络请求失败，请检查网络连接')
    return
  }

  if (!response.ok) {
    let detail = ''
    try {
      const err = await response.json()
      detail = err?.error?.message ?? ''
    } catch { /* ignore */ }

    if (response.status === 401) {
      onError('API Key 无效或已过期，请在设置中重新填写')
    } else if (response.status === 429) {
      onError('请求过于频繁，请稍后重试')
    } else {
      onError(`请求失败（${response.status}）${detail ? '：' + detail : ''}`)
    }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    onError('无法读取响应流')
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))
          const text: string = json?.choices?.[0]?.delta?.content ?? ''
          if (text) onChunk(text)
        } catch { /* skip malformed chunk */ }
      }
    }
  } finally {
    reader.releaseLock()
  }

  onDone()
}
