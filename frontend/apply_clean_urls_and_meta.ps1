Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Get-Location
$targetNames = @(
  "index.html","about.html","blog.html","blogs-details.html","contact.html","faq.html","pricing.html",
  "project-details.html","projects.html","service-details.html","services.html","team.html","testimonial.html"
)

$slugMap = [ordered]@{
  "index.html" = "./"
  "about.html" = "about"
  "blog.html" = "blog"
  "blogs-details.html" = "blogs-details"
  "contact.html" = "contact"
  "faq.html" = "faq"
  "pricing.html" = "pricing"
  "project-details.html" = "project-details"
  "projects.html" = "projects"
  "service-details.html" = "service-details"
  "services.html" = "services"
  "team.html" = "team"
  "testimonial.html" = "testimonial"
}

$legacyMap = [ordered]@{
  "page-project-details.html" = "project-details"
  "page-projects.html" = "projects"
  "page-service-details.html" = "service-details"
  "page-services.html" = "services"
  "page-team.html" = "team"
  "page-testimonial.html" = "testimonial"
  "page-faq.html" = "faq"
  "page-pricing.html" = "pricing"
  "page-contact.html" = "contact"
  "page-about.html" = "about"
}

function Escape-Attr([string]$value) {
  if ($null -eq $value) { return "" }
  return ($value.Replace('&','&amp;').Replace('"','&quot;').Replace('<','&lt;').Replace('>','&gt;'))
}

function Normalize-Url([string]$url) {
  if ([string]::IsNullOrWhiteSpace($url)) { return $url }
  $u = $url.Trim()

  if ($u -match '^(?i)(https?:|mailto:|tel:|javascript:|data:|#|//)') { return $u }

  $m = [regex]::Match($u, '^(?<path>[^?#]*)(?<suffix>[?#].*)?$')
  $path = $m.Groups['path'].Value
  $suffix = $m.Groups['suffix'].Value

  if ($path -eq '/') { return "./$suffix" }

  $leadingSlash = $false
  if ($path.StartsWith('/')) {
    $leadingSlash = $true
    $path = $path.TrimStart('/')
  }

  $candidate = $path.ToLowerInvariant()
  $newPath = $null

  if ($slugMap.Contains($candidate)) { $newPath = [string]$slugMap[$candidate] }
  elseif ($legacyMap.Contains($candidate)) { $newPath = [string]$legacyMap[$candidate] }
  else {
    $candidateNoHtml = if ($candidate.EndsWith('.html')) { $candidate.Substring(0, $candidate.Length - 5) } else { $candidate }
    $knownSlugs = @('about','blog','blogs-details','contact','faq','pricing','project-details','projects','service-details','services','team','testimonial','index')
    if ($knownSlugs -contains $candidateNoHtml) {
      if ($candidateNoHtml -eq 'index') { $newPath = './' } else { $newPath = $candidateNoHtml }
    }
  }

  if ($null -ne $newPath) { return "$newPath$suffix" }

  if ($leadingSlash) {
    $knownLeading = @('about','blog','blogs-details','contact','faq','pricing','project-details','projects','service-details','services','team','testimonial','index')
    if ($knownLeading -contains $candidate) {
      if ($candidate -eq 'index') { return "./$suffix" }
      return "$candidate$suffix"
    }
  }

  return $u
}

function Upsert-Tag([string]$headInner, [string]$pattern, [string]$newTag) {
  $regex = [regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if ($regex.IsMatch($headInner)) {
    $done = $false
    $headInner = $regex.Replace($headInner, {
      param($m)
      if (-not $done) { $done = $true; return $newTag }
      return ""
    })
  } else {
    $headInner = ($headInner.TrimEnd() + "`r`n    " + $newTag + "`r`n")
  }
  return $headInner
}

$files = foreach ($name in $targetNames) {
  $p = Join-Path $root $name
  if (Test-Path -LiteralPath $p -PathType Leaf) { Get-Item -LiteralPath $p }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$changed = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $original = [System.IO.File]::ReadAllText($file.FullName)
  $content = $original

  $attrRegex = [regex]::new('(?is)\b(href|action)\s*=\s*(["''][^"'']*["''])')
  $content = $attrRegex.Replace($content, {
    param($m)
    $attr = $m.Groups[1].Value
    $quoted = $m.Groups[2].Value
    $quote = $quoted.Substring(0,1)
    $value = $quoted.Substring(1, $quoted.Length - 2)
    $newValue = Normalize-Url $value
    return "$attr=$quote$newValue$quote"
  })

  $title = "Viraliq"
  $titleMatch = [regex]::Match($content, '(?is)<title[^>]*>(.*?)</title>')
  if ($titleMatch.Success) {
    $titleText = [regex]::Replace($titleMatch.Groups[1].Value, '<[^>]+>', ' ')
    $titleText = [regex]::Replace($titleText, '\s+', ' ').Trim()
    if (-not [string]::IsNullOrWhiteSpace($titleText)) { $title = $titleText }
  }

  $desc = "Viraliq website"
  $metaDescTag = [regex]::Match($content, '(?is)<meta\b[^>]*name\s*=\s*(["''])description\1[^>]*>')
  if ($metaDescTag.Success) {
    $contentMatch = [regex]::Match($metaDescTag.Value, '(?is)content\s*=\s*(["''])(.*?)\1')
    if ($contentMatch.Success -and -not [string]::IsNullOrWhiteSpace($contentMatch.Groups[2].Value)) {
      $desc = $contentMatch.Groups[2].Value.Trim()
    }
  }

  $slug = [string]$slugMap[$file.Name.ToLowerInvariant()]
  if ([string]::IsNullOrWhiteSpace($slug)) { $slug = "./" }

  $canonicalTag = '<link rel="canonical" href="' + (Escape-Attr $slug) + '">'
  $ogTypeTag = '<meta property="og:type" content="website">'
  $ogSiteTag = '<meta property="og:site_name" content="Viraliq">'
  $ogTitleTag = '<meta property="og:title" content="' + (Escape-Attr $title) + '">'
  $ogDescTag = '<meta property="og:description" content="' + (Escape-Attr $desc) + '">'
  $ogImageTag = '<meta property="og:image" content="images/og-default.svg">'
  $ogUrlTag = '<meta property="og:url" content="' + (Escape-Attr $slug) + '">'

  $headMatch = [regex]::Match($content, '(?is)<head\b[^>]*>(?<inner>.*?)</head>')
  if ($headMatch.Success) {
    $headInner = $headMatch.Groups['inner'].Value
    $headInner = Upsert-Tag $headInner '(?is)<link\b[^>]*rel\s*=\s*(["''])canonical\1[^>]*>' $canonicalTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:type\1[^>]*>' $ogTypeTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:site_name\1[^>]*>' $ogSiteTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:title\1[^>]*>' $ogTitleTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:description\1[^>]*>' $ogDescTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:image\1[^>]*>' $ogImageTag
    $headInner = Upsert-Tag $headInner '(?is)<meta\b[^>]*(?:property|name)\s*=\s*(["''])og:url\1[^>]*>' $ogUrlTag

    $newHead = "<head>" + $headInner + "</head>"
    $content = $content.Substring(0, $headMatch.Index) + $newHead + $content.Substring($headMatch.Index + $headMatch.Length)
  }

  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    $changed.Add($file.Name) | Out-Null
  }
}

"Files changed ($($changed.Count)):"
$changed | ForEach-Object { " - $_" }
""

$patternHtml = '(?i)(href|action)\s*=\s*["''][^"'']*\.html[^"'']*["'']'
$remainingHtml = Select-String -Path $files.FullName -Pattern $patternHtml
"Remaining href/action containing '.html' ($($remainingHtml.Count)):"
$remainingHtml | Select-Object -First 30 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""

$patternSlash = '(?i)(href|action)\s*=\s*["'']/[^"'']*["'']'
$remainingSlash = Select-String -Path $files.FullName -Pattern $patternSlash
"Remaining href/action starting with '/' ($($remainingSlash.Count)):"
$remainingSlash | Select-Object -First 30 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
