# OLED Theme Migration Script
# Replaces all hardcoded legacy colors with new OLED token values across the entire src/ directory.
# Run from the repo root: powershell -File scripts/apply-oled-theme.ps1

param(
  [string]$Root = "src"
)

$files = Get-ChildItem -Path $Root -Recurse -Include "*.tsx","*.ts","*.css" | Where-Object { !$_.FullName.Contains("node_modules") }

# Color replacement map: [old] => [new]
# Order matters — more specific patterns first to avoid double-replacement.
$replacements = [ordered]@{

  # ── Backgrounds (→ true black) ──────────────────────────────────
  '#090A0C'     = '#000000'
  '#0B0D10'     = '#000000'
  '#0B0F14'     = '#000000'
  '#0C1117'     = '#000000'
  '#0D1117'     = '#000000'
  '#0E131A'     = '#000000'
  '#0F1317'     = '#000000'

  # ── Primary surface (→ #090909) ─────────────────────────────────
  '#121519'     = '#090909'
  '#131922'     = '#090909'

  # ── Secondary surface / hover (→ #111111) ───────────────────────
  '#1A222D'     = '#111111'
  '#1F2937'     = '#111111'

  # ── Window chrome / nested surfaces ─────────────────────────────
  '#0E0E0E'     = '#090909'

  # ── Accent green (→ #46D296) ────────────────────────────────────
  '#3FA37C'     = '#46D296'
  '#4A7C72'     = '#46D296'

  # ── Accent hover (→ #5BE3A8) ────────────────────────────────────
  '#348866'     = '#5BE3A8'

  # ── Text primary ────────────────────────────────────────────────
  '#F8FAFC'     = '#FFFFFF'

  # ── Text secondary ──────────────────────────────────────────────
  '#CBD5E1'     = 'rgba(255,255,255,0.72)'
  '#E2E8F0'     = 'rgba(255,255,255,0.72)'

  # ── Text muted ──────────────────────────────────────────────────
  '#94A3B8'     = 'rgba(255,255,255,0.45)'
  '#64748B'     = 'rgba(255,255,255,0.25)'

  # ── Borders ─────────────────────────────────────────────────────
  'rgba(255,255,255,0.08)'  = 'rgba(255,255,255,0.06)'
  'rgba(255, 255, 255, 0.08)' = 'rgba(255,255,255,0.06)'
  'rgba(255,255,255,0.07)'  = 'rgba(255,255,255,0.06)'
  'rgba(255, 255, 255, 0.07)' = 'rgba(255,255,255,0.06)'
  'rgba(255,255,255,0.06)'  = 'rgba(255,255,255,0.06)'  # idempotent pass

  # ── Accent opacity variants ──────────────────────────────────────
  '#3FA37C/10'  = '#46D296/10'
  '#3FA37C/15'  = '#46D296/15'
  '#3FA37C/20'  = '#46D296/20'
  '#3FA37C/30'  = '#46D296/30'
  '#3FA37C/40'  = '#46D296/40'
  '#3FA37C/5'   = '#46D296/5'
}

$total = 0
foreach ($file in $files) {
  $content = Get-Content -Raw -Path $file.FullName
  $original = $content
  foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content -replace [regex]::Escape($old), $new
  }
  if ($content -ne $original) {
    Set-Content -Path $file.FullName -Value $content -NoNewline
    $total++
    Write-Host "  patched: $($file.Name)"
  }
}

Write-Host ""
Write-Host "OLED theme applied to $total files." -ForegroundColor Green
