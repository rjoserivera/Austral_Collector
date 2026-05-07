Remove-Item -Recurse -Force patch_staging -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path patch_staging
Copy-Item -Path dist\* -Destination patch_staging -Recurse
Copy-Item -Path api -Destination patch_staging -Recurse
$htaccessContent = @"
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
"@
Set-Content -Path patch_staging\.htaccess -Value $htaccessContent
Compress-Archive -Path patch_staging\* -DestinationPath austral_collector_patch.zip -Force
Remove-Item -Recurse -Force patch_staging
