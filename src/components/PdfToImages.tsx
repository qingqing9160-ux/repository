import { useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function PdfToImages() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    setImages([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const results: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
        results.push(canvas.toDataURL('image/png'))
      }

      setImages(results)
    } catch (e) {
      setError('转换失败，请确认文件是有效的 PDF。')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function downloadImage(dataUrl: string, index: number) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `page-${index + 1}.png`
    a.click()
  }

  function downloadAll() {
    images.forEach((url, i) => downloadImage(url, i))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF 转图片</h1>
      <p className="text-gray-500 mb-8">上传 PDF 文件，每页将被转换为 PNG 图片</p>

      {/* Drop zone */}
      <div
        className="w-full max-w-xl border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600 font-medium">点击或拖拽 PDF 文件到此处</p>
        <p className="text-gray-400 text-sm mt-1">支持单页或多页 PDF</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-8 flex items-center gap-3 text-orange-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="font-medium">正在转换中...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 text-red-500 bg-red-50 px-5 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Results */}
      {images.length > 0 && (
        <div className="mt-8 w-full max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 font-medium">共 {images.length} 页</p>
            <button
              onClick={downloadAll}
              className="px-5 py-2 rounded-full text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #F0846A 0%, #E86050 100%)' }}
            >
              下载全部
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {images.map((url, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <img src={url} alt={`第 ${i + 1} 页`} className="w-full" />
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">第 {i + 1} 页</span>
                  <button
                    onClick={() => downloadImage(url, i)}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
