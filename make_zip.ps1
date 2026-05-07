Remove-Item -Recurse -Force deploy_staging -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path deploy_staging
Copy-Item -Path dist\* -Destination deploy_staging -Recurse
Copy-Item -Path api -Destination deploy_staging -Recurse
Copy-Item -Path uploads -Destination deploy_staging -Recurse
$htaccessContent = @"
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
"@
Set-Content -Path deploy_staging\.htaccess -Value $htaccessContent
Compress-Archive -Path deploy_staging\* -DestinationPath austral_collector_deploy.zip -Force
Remove-Item -Recurse -Force deploy_staging
