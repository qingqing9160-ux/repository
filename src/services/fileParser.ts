import * as XLSX from 'xlsx'

export interface ParsedFile {
  name: string
  ext: string
  size: number
  content: string       // extracted plain text / CSV
  sheets?: string[]     // Excel sheet names
  truncated?: boolean   // true if content was cut for token safety
}

const MAX_CHARS = 18000  // ~4500 tokens, safe for GLM-4-Flash

const EXT_LABELS: Record<string, string> = {
  xlsx: 'Excel 表格',
  xls: 'Excel 表格（旧版）',
  csv: 'CSV 数据表',
  docx: 'Word 文档',
  doc: 'Word 文档（旧版）',
  txt: '纯文本文件',
}

export function supportedExtensions() {
  return ['.xlsx', '.xls', '.csv', '.docx', '.txt']
}

export function fileTypeLabel(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return EXT_LABELS[ext] ?? '文件'
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file, ext)
  if (ext === 'csv') return parseCsv(file)
  if (ext === 'docx') return parseDocx(file)
  if (ext === 'txt') return parseTxt(file)
  if (ext === 'doc') throw new Error('暂不支持 .doc 格式，请另存为 .docx 后再上传')

  throw new Error(`暂不支持 .${ext} 格式，支持：Excel、Word(.docx)、CSV、TXT`)
}

// ─── Excel ───────────────────────────────────────────────────────────────────
async function parseExcel(file: File, ext: string): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })

  const sheets = workbook.SheetNames
  let content = ''

  for (const sheetName of sheets) {
    const sheet = workbook.Sheets[sheetName]
    // Convert to array of arrays for cleaner output
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as string[][]
    if (rows.length === 0) continue

    content += `【工作表：${sheetName}】\n`
    for (const row of rows) {
      const line = row.map(c => String(c ?? '').trim()).join('\t')
      if (line.replace(/\t/g, '').trim()) content += line + '\n'
    }
    content += '\n'
  }

  const truncated = content.length > MAX_CHARS
  return {
    name: file.name,
    ext,
    size: file.size,
    content: truncated ? content.slice(0, MAX_CHARS) + '\n…（内容过长，已截取前部分）' : content.trim(),
    sheets,
    truncated,
  }
}

// ─── CSV ─────────────────────────────────────────────────────────────────────
async function parseCsv(file: File): Promise<ParsedFile> {
  const text = await file.text()
  const truncated = text.length > MAX_CHARS
  return {
    name: file.name,
    ext: 'csv',
    size: file.size,
    content: truncated ? text.slice(0, MAX_CHARS) + '\n…（内容过长，已截取）' : text,
    truncated,
  }
}

// ─── Word .docx ──────────────────────────────────────────────────────────────
async function parseDocx(file: File): Promise<ParsedFile> {
  // Dynamic import to keep initial bundle small
  const mammoth = await import('mammoth')
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  const text = result.value
  const truncated = text.length > MAX_CHARS
  return {
    name: file.name,
    ext: 'docx',
    size: file.size,
    content: truncated ? text.slice(0, MAX_CHARS) + '\n…（内容过长，已截取）' : text,
    truncated,
  }
}

// ─── TXT ─────────────────────────────────────────────────────────────────────
async function parseTxt(file: File): Promise<ParsedFile> {
  const text = await file.text()
  const truncated = text.length > MAX_CHARS
  return {
    name: file.name,
    ext: 'txt',
    size: file.size,
    content: truncated ? text.slice(0, MAX_CHARS) + '\n…（内容过长，已截取）' : text,
    truncated,
  }
}

// ─── Build AI prompt ─────────────────────────────────────────────────────────
export function buildFileAnalysisPrompt(parsed: ParsedFile, userInstruction?: string): string {
  const typeLabel = fileTypeLabel(parsed.name)
  const sizeStr = parsed.size < 1024 * 1024
    ? `${(parsed.size / 1024).toFixed(1)} KB`
    : `${(parsed.size / 1024 / 1024).toFixed(1)} MB`

  const header = [
    `请分析以下上传的文件，对内容进行准确分类整理：`,
    ``,
    `📄 文件名：${parsed.name}`,
    `📊 类型：${typeLabel}　大小：${sizeStr}`,
    parsed.sheets && parsed.sheets.length > 1 ? `📋 工作表：${parsed.sheets.join('、')}` : '',
    parsed.truncated ? `⚠️ 注意：文件内容较长，已截取前段进行分析` : '',
    ``,
    `--- 文件内容开始 ---`,
    parsed.content,
    `--- 文件内容结束 ---`,
    ``,
  ].filter(l => l !== null).join('\n')

  const instruction = userInstruction?.trim()
    ? `用户补充说明：${userInstruction}\n\n`
    : ''

  const analysisRequest = [
    `${instruction}请按以下结构输出完整分析：`,
    ``,
    `## 一、内容概述`,
    `说明文件记录了什么内容、时间范围、涉及对象等基本情况。`,
    ``,
    `## 二、分类整理`,
    `将文件内容按类别/维度整理，使用表格展示核心数据。`,
    ``,
    `## 三、关键信息提取`,
    `提取重要数字、日期、人员姓名、金额、编号等关键字段。`,
    ``,
    `## 四、发现与建议`,
    `指出数据特点、异常项、缺失项，并给出处理建议。`,
  ].join('\n')

  return header + analysisRequest
}
