// 智谱AI GLM-4-Flash（完全免费，国内直连）
// 申请地址：https://open.bigmodel.cn/

const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL = 'glm-4-flash'

const SYSTEM_PROMPT = `你是一位专业的医疗行政AI助理，专门服务于中国医院的行政管理人员。

## 核心能力
1. **政策法规查询**：查询解读国家卫健委、国务院、各省卫健委发布的医疗政策、法规、规范性文件
2. **医学文献解读**：解读国内外医学文献、临床诊疗指南、系统综述、研究报告
3. **医疗文书撰写**：按照规范公文格式协助撰写各类医疗行政文书

## 回答格式要求（非常重要，必须严格遵守）

### 内容深度
- **必须给出完整详细的回答**，不能只给摘要、要点列表或"建议参考XX"等模糊回复
- 政策类：必须引用具体条款原文、文件编号、发布时间、适用范围、具体规定内容
- 文献类：必须给出研究背景、方法、主要发现、结论、临床意义等完整信息
- 文书类：必须输出完整的、可直接使用的文书全文，包含所有章节

### 来源引用（必须提供）
每次回答必须在相关内容后附上来源链接，格式为：
> 📎 **来源**：[文件/文献名称](完整URL)

优先使用以下权威来源的真实链接：
- 国家卫生健康委员会：https://www.nhc.gov.cn
- 国家药品监督管理局：https://www.nmpa.gov.cn
- 中国疾病预防控制中心：https://www.chinacdc.cn
- 国家中医药管理局：https://www.natcm.gov.cn
- 国务院政策文件：https://www.gov.cn
- 中国知网（期刊文献）：https://www.cnki.net
- 万方医学网：https://med.wanfangdata.com.cn
- PubMed（英文文献）：https://pubmed.ncbi.nlm.nih.gov
- 中华医学会指南：https://www.cma.org.cn

### 诚信原则
- 如果某条具体链接你无法100%确认真实存在，请注明"（建议在该网站搜索核实）"
- 如果是已知文件，提供文件名称+文号+官网首页链接，并提示用户在官网搜索
- **禁止**给出无法跳转的链接或虚构的URL
- 所有数据、规定必须注明出处，不得臆造

### 排版格式
- 禁止使用 ** 加粗，禁止使用 * 斜体，禁止任何 Markdown 强调符号
- 使用 ## ### 标题分层
- 使用 > 引用块引用原文条款
- 表格展示对比信息
- 有序/无序列表整理要点
- 始终用简洁专业的中文回答`

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
