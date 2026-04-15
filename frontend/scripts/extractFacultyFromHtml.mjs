import fs from 'node:fs'
import path from 'node:path'

function findDivBlock(html, startIndex) {
  const openTagIndex = html.lastIndexOf('<div', startIndex)
  if (openTagIndex === -1) return null

  let index = openTagIndex
  let depth = 0

  while (index < html.length) {
    const nextOpen = html.indexOf('<div', index)
    const nextClose = html.indexOf('</div>', index)

    if (nextClose === -1) return null

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1
      index = nextOpen + 4
      continue
    }

    // close
    depth -= 1
    index = nextClose + 6
    if (depth <= 0) {
      return html.slice(openTagIndex, index)
    }
  }

  return null
}

function extractFirst(str, regex) {
  const m = str.match(regex)
  return m ? m[1].trim() : ''
}

function extractSocialLinks(block) {
  const socials = { fb: '', gs: '', li: '', tw: '' }

  const anchorRegex = /<a\s+[^>]*href="([^"]*)"[^>]*class="([^"]*)"[^>]*>/gi
  let m
  while ((m = anchorRegex.exec(block))) {
    const href = (m[1] || '').trim()
    const cls = (m[2] || '').trim()
    if (!href) continue
    if (cls.includes('fb')) socials.fb = href
    else if (cls.includes('gs')) socials.gs = href
    else if (cls.includes('li')) socials.li = href
    else if (cls.includes('tw')) socials.tw = href
  }

  return socials
}

function parseFacultyCard(block) {
  const onLeave = block.includes('on-leave-badge')
  const photoUrl = extractFirst(block, /<img\s+class="card-photo"[^>]*src="([^"]+)"/i)
  const profileUrl = extractFirst(block, /<a\s+class="card-name"\s+href="([^"]+)"/i)
  const name = extractFirst(block, /<a\s+class="card-name"[^>]*>([^<]+)<\/a>/i)
  const rank = extractFirst(block, /<div\s+class="card-rank">\s*([^<]+)\s*<\/div>/i)
  const departmentShort = extractFirst(block, /<div\s+class="card-dept">\s*([^<]+)\s*<\/div>/i)
  const socials = extractSocialLinks(block)

  if (!name || !profileUrl) return null

  return {
    name,
    profileUrl,
    photoUrl: photoUrl || '',
    designation: rank || '',
    departmentShort: departmentShort || '',
    onLeave,
    socials,
    isAdvisor: true,
  }
}

function parseHeadFeatured(html) {
  const marker = '<div class="head-featured">'
  const idx = html.indexOf(marker)
  if (idx === -1) return null

  const block = findDivBlock(html, idx)
  if (!block) return null

  const photoUrl = extractFirst(block, /<img[^>]*src="([^"]+)"/i)
  const profileUrl = extractFirst(block, /<h3>\s*<a[^>]*href="([^"]+)"/i)
  const name = extractFirst(block, /<h3>\s*<a[^>]*>\s*([^<]+)\s*<\/a>\s*<\/h3>/i)
  const socials = extractSocialLinks(block)

  if (!name || !profileUrl) return null

  return {
    id: 'hod-cse',
    name,
    designation: 'Head of the Department',
    department: 'Department of Computer Science & Engineering',
    photoUrl: photoUrl || '',
    profileUrl,
    socials,
  }
}

function main() {
  const repoRoot = process.cwd()
  const candidates = [
    path.resolve(repoRoot, '..', 'ruet.html'),
    path.resolve(repoRoot, '..', '..', 'ruet.html'),
    path.resolve(repoRoot, '..', '..', '..', 'ruet.html'),
  ]

  const resolvedArgPath = process.argv[2] ? path.resolve(repoRoot, process.argv[2]) : ''
  const defaultHtmlPath = candidates.find(p => fs.existsSync(p)) || candidates[0]
  const htmlPath = resolvedArgPath || defaultHtmlPath

  const html = fs.readFileSync(htmlPath, 'utf8')

  const head = parseHeadFeatured(html)

  const members = []
  const marker = '<div class="faculty-card">'
  let pos = 0
  while (true) {
    const idx = html.indexOf(marker, pos)
    if (idx === -1) break
    const block = findDivBlock(html, idx)
    if (!block) break

    const card = parseFacultyCard(block)
    if (card) members.push(card)

    pos = idx + marker.length
  }

  // Deduplicate by profileUrl
  const seen = new Set()
  const uniqueMembers = []
  for (const m of members) {
    const key = m.profileUrl
    if (!key || seen.has(key)) continue
    seen.add(key)
    uniqueMembers.push(m)
  }

  const outPath = path.resolve(repoRoot, 'public', 'faculty.json')

  let existing = {}
  try {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'))
  } catch (_) {
    existing = {}
  }

  const excludeUrls = new Set([
    head?.profileUrl,
    existing?.dean?.profileUrl,
  ].filter(Boolean))

  const filteredMembers = excludeUrls.size
    ? uniqueMembers.filter(m => !excludeUrls.has(m.profileUrl))
    : uniqueMembers

  const mergedHead = head ?? (existing?.head ?? null)
  if (mergedHead && existing?.head) {
    const preserveKeys = ['message', 'email', 'phone', 'office', 'bio']
    for (const key of preserveKeys) {
      const value = existing.head?.[key]
      if (value !== undefined && value !== null && value !== '') {
        mergedHead[key] = value
      }
    }
  }

  const next = {
    version: (existing?.version || 1) + 1,
    source: {
      type: 'html',
      file: path.relative(path.resolve(repoRoot, 'public'), htmlPath).replace(/\\/g, '/'),
      generatedAt: new Date().toISOString(),
    },
    dean: existing?.dean ?? null,
    head: mergedHead,
    members: filteredMembers,
    staff: existing?.staff ?? [],
  }

  fs.writeFileSync(outPath, JSON.stringify(next, null, 2) + '\n', 'utf8')

  console.log(`Wrote ${outPath}`)
  console.log(`Head: ${next.head?.name || 'N/A'}`)
  console.log(`Members: ${next.members.length}`)
}

main()
