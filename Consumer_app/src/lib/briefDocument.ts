/** Turn brief markdown into a Word-openable .doc (HTML) or a print/PDF window. */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineFormat(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

/** Minimal markdown → HTML for programme briefs. */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let inList = false

  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      closeList()
      continue
    }
    if (line.startsWith('### ')) {
      closeList()
      out.push(`<h3>${inlineFormat(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      closeList()
      out.push(`<h2>${inlineFormat(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      closeList()
      out.push(`<h1>${inlineFormat(line.slice(2))}</h1>`)
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inlineFormat(line.slice(2))}</li>`)
      continue
    }
    closeList()
    out.push(`<p>${inlineFormat(line)}</p>`)
  }
  closeList()
  return out.join('\n')
}

function documentShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 12pt; color: #111; line-height: 1.45; max-width: 720px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 20pt; margin: 0 0 12px; }
  h2 { font-size: 14pt; margin: 22px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  h3 { font-size: 12pt; margin: 16px 0 6px; }
  p { margin: 0 0 10px; }
  ul { margin: 0 0 12px 20px; }
  li { margin-bottom: 4px; }
  code { font-family: Consolas, monospace; font-size: 10pt; }
  .meta { color: #555; font-size: 10pt; margin-bottom: 20px; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`
}

export function buildBriefDocHtml(opts: {
  title: string
  generatedAt?: string
  mode?: string
  markdown: string
}): string {
  const meta = [
    opts.generatedAt ? `Generated: ${opts.generatedAt}` : null,
    opts.mode ? `Narrative: ${opts.mode}` : null,
    'Source: Waga published index (no imputed prices)',
  ]
    .filter(Boolean)
    .join(' · ')

  const body = `
    <p class="meta">${escapeHtml(meta)}</p>
    ${markdownToHtml(opts.markdown)}
  `
  return documentShell(opts.title, body)
}

export function downloadBriefAsWord(opts: {
  title: string
  generatedAt?: string
  mode?: string
  markdown: string
  filename?: string
}): void {
  const html = buildBriefDocHtml(opts)
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = opts.filename ?? 'waga_brief.doc'
  a.click()
  URL.revokeObjectURL(url)
}

/** Opens a print window so the user can Save as PDF. */
export function printBriefAsPdf(opts: {
  title: string
  generatedAt?: string
  mode?: string
  markdown: string
}): void {
  const html = buildBriefDocHtml(opts)
  const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!w) return
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
  // Give fonts/layout a tick before print dialog.
  setTimeout(() => {
    w.print()
  }, 250)
}
