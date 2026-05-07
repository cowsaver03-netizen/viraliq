$routes = @('index.html','about.html','blog.html','blogs-details.html','contact.html','faq.html','pricing.html','project-details.html','projects.html','service-details.html','services.html','team-details.html','team.html','testimonial.html')
$slugs = @('about','team','team-details','contact','services','service-details','projects','project-details','blog','blogs-details','faq','pricing','testimonial')

"=== [1] .htaccess (current) ==="
if (Test-Path '.htaccess' -PathType Leaf) { Get-Content '.htaccess' } else { '.htaccess not found' }
""

"=== [2] Required route files existence ==="
foreach($r in $routes){ "{0}: {1}" -f $r, ($(if(Test-Path $r -PathType Leaf){'FOUND'} else {'MISSING'})) }
""

$htmlFiles = Get-ChildItem -Path . -File -Filter *.html
"=== [3] Root-level *.html internal attrs still using .html routes ==="
$attrPattern = '(?i)(href|action|src|formaction)\s*=\s*["''][^"'']*(index|about|blog|blogs-details|contact|faq|pricing|project-details|projects|service-details|services|team-details|team|testimonial)\.html(?:[?#][^"'']*)?["'']'
$m3 = @(Select-String -Path $htmlFiles.FullName -Pattern $attrPattern)
"Count=$($m3.Count)"
$m3 | Select-Object -First 80 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""

"=== [4] Bare slug links without leading slash ==="
$slugAlt = ($slugs -join '|')
$barePattern = '(?i)(href|action|src|formaction)\s*=\s*["''](?!https?:|//|#|mailto:|tel:|javascript:)(?:' + $slugAlt + ')(?:[?#][^"'']*)?["'']'
$m4 = @(Select-String -Path $htmlFiles.FullName -Pattern $barePattern)
"Count=$($m4.Count)"
$m4 | Select-Object -First 80 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""

"=== [5] Trailing slash links for these slugs (/slug/) ==="
$trailPattern = '(?i)(href|action|src|formaction)\s*=\s*["'']/(?:' + $slugAlt + ')/(?:[?#][^"'']*)?["'']'
$m5 = @(Select-String -Path $htmlFiles.FullName -Pattern $trailPattern)
"Count=$($m5.Count)"
$m5 | Select-Object -First 80 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
""

"=== [6] Behavior summary basis (.htaccess flags) ==="
if (Test-Path '.htaccess' -PathType Leaf) {
  $ht = Get-Content '.htaccess' -Raw
  $hasSlashRule = $ht -match 'REQUEST_URI.*\(\.\*\)/\$' -or $ht -match '\^\(\.\*\)/\$'
  $hasHtmlRewrite = $ht -match '\$1\.html'
  "Detected trailing-slash canonicalization rule: $hasSlashRule"
  "Detected extensionless-to-.html rewrite rule: $hasHtmlRewrite"
  if($hasSlashRule -and $hasHtmlRewrite){
    'Expected: /slug -> internally serves /slug.html (200). /slug/ -> redirected to /slug (typically 301), then served via rewrite.'
  } elseif($hasHtmlRewrite){
    'Expected: /slug -> internally serves /slug.html (200). /slug/ may 404 unless separate slash rule exists.'
  } else {
    'Expected: behavior depends on server/default rules; no clear extensionless rewrite to .html detected.'
  }
}
