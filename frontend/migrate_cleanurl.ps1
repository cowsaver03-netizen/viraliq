$ErrorActionPreference = "Stop"
$enc = New-Object System.Text.UTF8Encoding($false)

$htaccessPath = Join-Path (Get-Location) ".htaccess"
$htaccess = @"
DirectoryIndex index.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Skip rewrite for existing files or directories (assets keep working)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 301 redirect direct *.html requests to extensionless URL
RewriteCond %{THE_REQUEST} \s/+(.+?)\.html(?:[\s?]|$) [NC]
RewriteRule ^ %1 [R=301,L,NE]

# Rewrite extensionless URL to matching .html file when it exists
RewriteCond %{REQUEST_URI} !/$
RewriteCond %{DOCUMENT_ROOT}/$1.html -f
RewriteRule ^(.+)$ $1.html [L]
</IfModule>
"@
[System.IO.File]::WriteAllText($htaccessPath, $htaccess, $enc)

$map = [ordered]@{
  "index.html" = "/"
  "about.html" = "/about"
  "blog.html" = "/blog"
  "blogs-details.html" = "/blogs-details"
  "contact.html" = "/contact"
  "faq.html" = "/faq"
  "pricing.html" = "/pricing"
  "project-details.html" = "/project-details"
  "projects.html" = "/projects"
  "service-details.html" = "/service-details"
  "services.html" = "/services"
  "team-details.html" = "/team-details"
  "team.html" = "/team"
  "testimonial.html" = "/testimonial"
}
$slugs = @("about","blog","blogs-details","contact","faq","pricing","project-details","projects","service-details","services","team-details","team","testimonial")
$rootHtml = Get-ChildItem -Path . -File -Filter *.html
$changed = New-Object System.Collections.Generic.List[string]

foreach ($f in $rootHtml) {
  $p = $f.FullName
  $orig = [System.IO.File]::ReadAllText($p)
  $new = $orig

  foreach ($k in $map.Keys) {
    $target = [Regex]::Escape($k)
    $patternAttr = '(?i)(?<pre>\b(?:href|action|src|data-href|data-src|formaction)\s*=\s*["''][ ]*)(?<val>(?:\./)?' + $target + ')(?<tail>(?:[?#][^"'']*)?)(?<post>["''])'
    $new = [Regex]::Replace($new, $patternAttr, { param($m) $m.Groups['pre'].Value + $map[$k] + $m.Groups['tail'].Value + $m.Groups['post'].Value })

    $patternQuoted = '(?i)(?<q>["''])(?<val>(?:\./)?' + $target + ')(?<tail>(?:[?#][^"'']*)?)(?<q2>["''])'
    $new = [Regex]::Replace($new, $patternQuoted, {
      param($m)
      if ($m.Groups['q'].Value -ne $m.Groups['q2'].Value) { return $m.Value }
      $m.Groups['q'].Value + $map[$k] + $m.Groups['tail'].Value + $m.Groups['q2'].Value
    })
  }

  foreach ($slug in $slugs) {
    $esc = [Regex]::Escape($slug)
    $patternBare = '(?i)(?<pre>\b(?:href|action|src|data-href|data-src|formaction)\s*=\s*["''][ ]*)(?<val>(?:\./)?' + $esc + ')(?<tail>(?:[?#][^"'']*)?)(?<post>["''])'
    $new = [Regex]::Replace($new, $patternBare, { param($m) $m.Groups['pre'].Value + '/' + $slug + $m.Groups['tail'].Value + $m.Groups['post'].Value })
  }

  $patternDotSlash = '(?i)(?<pre>\b(?:href|action|src|data-href|data-src|formaction)\s*=\s*["''][ ]*)\./(?<tail>(?:[?#][^"'']*)?)(?<post>["''])'
  $new = [Regex]::Replace($new, $patternDotSlash, { param($m) $m.Groups['pre'].Value + '/' + $m.Groups['tail'].Value + $m.Groups['post'].Value })

  if ($new -ne $orig) {
    [System.IO.File]::WriteAllText($p, $new, $enc)
    $changed.Add($f.Name)
  }
}

$removedDirs = New-Object System.Collections.Generic.List[string]
foreach ($slug in $slugs) {
  $dir = Join-Path (Get-Location) $slug
  $idx = Join-Path $dir "index.html"
  if ((Test-Path $dir -PathType Container) -and (Test-Path $idx -PathType Leaf)) {
    $idxContent = [System.IO.File]::ReadAllText($idx)
    $stub1 = 'location.replace("../' + $slug + '.html"'
    $stub2 = 'url=../' + $slug + '.html'
    if ($idxContent.Contains($stub1) -or $idxContent.Contains($stub2)) {
      Remove-Item -Path $dir -Recurse -Force
      $removedDirs.Add($slug)
    }
  }
}

$routePattern = '(?:index|about|blog|blogs-details|contact|faq|pricing|project-details|projects|service-details|services|team-details|team|testimonial)\.html'
$remainHtml = @(Select-String -Path $rootHtml.FullName -Pattern ('(?i)(?:href|action|src|data-href|data-src|formaction)\s*=\s*["''][^"'']*' + $routePattern + '(?:[?#][^"'']*)?["'']'))
$slugAlt = ($slugs | ForEach-Object { [Regex]::Escape($_) }) -join '|'
$remainBare = @(Select-String -Path $rootHtml.FullName -Pattern ('(?i)(?:href|action|src|data-href|data-src|formaction)\s*=\s*["''](?:\./)?(?:' + $slugAlt + ')(?:[?#][^"'']*)?["'']'))

"Changed files ($($changed.Count)):"
$changed | Sort-Object | ForEach-Object { " - $_" }
""
"Removed stub directories ($($removedDirs.Count)):"
$removedDirs | Sort-Object | ForEach-Object { " - $_" }
""
"Remaining internal route links containing .html ($($remainHtml.Count)) [first 40]:"
$remainHtml | Select-Object -First 40 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""
"Remaining bare slug links without leading slash ($($remainBare.Count)) [first 40]:"
$remainBare | Select-Object -First 40 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""
".htaccess summary:"
Get-Content -Path $htaccessPath | Select-Object -First 30