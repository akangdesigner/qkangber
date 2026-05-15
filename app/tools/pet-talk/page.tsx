'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/shared/Breadcrumbs'

const SPECIES = ['貓', '狗', '兔子', '倉鼠', '鸚鵡', '烏龜', '其他']

const LOADING_STEPS = [
  '連線量子頻道…',
  '校準靈魂感應器…',
  '解碼情緒暗物質…',
  '同步跨維度共振…',
  '生成診斷報告…',
]

type Result = {
  mood: string
  diagnosis: string
  answer: string
  secret: string
  scienceFact: string
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function generateReportId() {
  return 'QSR-' + Math.random().toString(36).slice(2, 7).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase()
}

export default function PetTalkPage() {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('貓')
  const [personality, setPersonality] = useState('')
  const [question, setQuestion] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [reportId] = useState(() => generateReportId())
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    try {
      const b64 = await compressImage(file)
      setImageBase64(b64)
    } catch {
      setError('圖片處理失敗，請換一張試試')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }, [handleImageFile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setLoadingStep(0)

    stepTimerRef.current = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 900)

    try {
      const res = await fetch('/api/tools/pet-talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, species, personality, question, image: imageBase64 ?? undefined }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? '溝通失敗')
      setResult(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤')
    } finally {
      setLoading(false)
      if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    }
  }

  async function handleCopy() {
    if (!result) return
    const text = `【量子靈魂感應研究所 診斷報告 ${reportId}】\n\n診斷：${result.diagnosis}\n情緒磁場：${result.mood}\n\n${result.answer}\n\n🤫 深層意識：${result.secret}\n\n📡 感應依據：${result.scienceFact}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-colors"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <main className="relative max-w-2xl mx-auto px-6 py-20">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 5%, rgba(236,72,153,0.1), transparent 60%)' }}
      />

      <Breadcrumbs crumbs={[
        { label: '首頁', href: '/' },
        { label: '工具站', href: '/tools' },
        { label: '寵物溝通師' },
      ]} />

      <div className="flex items-center gap-3 mb-4 mt-6">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #ec4899)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#f9a8d4,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Quantum Soul Research Institute
        </span>
      </div>

      <h1 className="text-4xl font-semibold text-white tracking-[-0.02em] mb-2">寵物溝通師</h1>
      <p className="text-slate-400 mb-10">
        上傳毛孩照片，AI 化身量子靈魂感應師，用極度嚴肅的偽科學替你解讀牠的心聲。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Photo upload */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            寵物照片 <span className="text-slate-600">（選填，有照片靈魂掃描更準確）</span>
          </label>
          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 ${dragging ? 'ring-1 ring-pink-400/60' : ''}`}
            style={{
              minHeight: imageBase64 ? 'auto' : 140,
              background: dragging ? 'rgba(236,72,153,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px dashed ${dragging ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.12)'}`,
            }}
            onClick={() => !imageBase64 && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {imageBase64 ? (
              <div className="relative w-full p-4 flex items-center gap-4">
                <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-pink-500/30">
                  <Image src={imageBase64} alt="寵物照片" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium mb-1">靈魂掃描就緒</p>
                  <p className="text-xs text-slate-500">點擊右側可重新上傳</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImageBase64(null) }}
                  className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  移除
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="flex-shrink-0 text-pink-400 hover:text-pink-300 transition-colors text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(236,72,153,0.08)' }}
                >
                  換圖
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 select-none">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-slate-400">點擊上傳或拖放圖片</p>
                <p className="text-xs text-slate-600">支援 JPG、PNG、WEBP</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">寵物名字</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：小虎"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">種類</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {SPECIES.map((s) => (
                <option key={s} value={s} style={{ background: '#0d0f1a' }}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">個性特徵 <span className="text-slate-600">（選填）</span></label>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="例：超愛吃飯、很愛撒嬌、一看到玩具就抓狂"
            rows={2}
            className={`${inputClass} resize-none`}
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">你想問牠什麼？</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例：你今天為什麼把水杯推下去？"
            rows={2}
            className={`${inputClass} resize-none`}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !question.trim()}
          className="w-full py-3.5 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: loading ? 'none' : '0 0 24px rgba(236,72,153,0.3)' }}
        >
          {loading ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {LOADING_STEPS[loadingStep]}
            </>
          ) : '開始靈魂掃描 🔬'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10">
          {/* Report card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0b14', border: '1px solid rgba(236,72,153,0.2)', boxShadow: '0 0 40px rgba(236,72,153,0.06)' }}>

            {/* Report header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(236,72,153,0.07)', borderBottom: '1px solid rgba(236,72,153,0.12)' }}>
              <div className="flex items-center gap-3">
                {imageBase64 && (
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-pink-500/40 flex-shrink-0">
                    <Image src={imageBase64} alt={name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: '#f9a8d4' }}>量子靈魂感應研究所</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">報告編號 {reportId}</p>
                </div>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.2)' }}
              >
                {result.mood}
              </span>
            </div>

            {/* Diagnosis */}
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-1">臨床診斷</p>
              <p className="text-sm font-medium" style={{ color: '#e9d5ff' }}>{result.diagnosis}</p>
            </div>

            {/* Answer */}
            <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-600 mb-3">🔬 靈魂感應結果</p>
              <p className="text-sm text-slate-200 leading-[1.9] whitespace-pre-wrap">{result.answer}</p>
            </div>

            {/* Secret */}
            <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(192,132,252,0.03)' }}>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#a78bfa' }}>🤫 深層意識讀取（主人限閱）</p>
              <p className="text-sm leading-[1.9] whitespace-pre-wrap" style={{ color: '#e9d5ff' }}>{result.secret}</p>
            </div>

            {/* Science fact */}
            <div className="px-5 py-3.5 flex items-start gap-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-slate-600 text-xs mt-0.5 flex-shrink-0">📡</span>
              <p className="text-xs text-slate-600 leading-relaxed">{result.scienceFact}</p>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={handleCopy}
            className="mt-4 w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: copied ? '#4ade80' : '#94a3b8',
            }}
          >
            {copied ? '✓ 已複製到剪貼簿' : '複製診斷報告 分享社群'}
          </button>
        </div>
      )}

      <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm text-slate-500">
          想把寵物相關業務自動化？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">
            了解 Q kangber 的自動化服務 →
          </Link>
        </p>
      </div>
    </main>
  )
}
