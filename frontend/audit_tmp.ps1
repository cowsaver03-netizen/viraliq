$root = Get-Location
$htmlFiles = Get-ChildItem -Path $root -Recurse -File -Filter *.html
$jsFiles = Get-ChildItem -Path $root -Recurse -File -Filter *.js
$filesHtmlJs = @($htmlFiles + $jsFiles)

$m1 = Select-String -Path $filesHtmlJs.FullName -Pattern 'page-' -SimpleMatch
"[1] pattern 'page-' in *.html,*.js | Count=$($m1.Count)"
$m1 | Select-Object -First 40 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, ($_.Line.Trim()) }
""

$m2 = Select-String -Path $htmlFiles.FullName -Pattern 'href="/' -SimpleMatch
"[2] pattern 'href=\"/' in *.html | Count=$($m2.Count)"
$m2 | Select-Object -First 40 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, ($_.Line.Trim()) }
""

$pattern3 = "(href|action)\s*=\s*[`"''][^`"'']*\.html[^`"'']*[`"'']"
$m3 = Select-String -Path $htmlFiles.FullName -Pattern $pattern3
"[3] href/action contains '.html' in *.html | Count=$($m3.Count)"
$m3 | Select-Object -First 80 | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, ($_.Line.Trim()) }
