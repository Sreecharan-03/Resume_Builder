$register = @{ email='e2user@example.com'; password='Password123!'; fullName='E2 User' } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Uri 'http://localhost:8083/api/auth/register' -Method Post -Body $register -ContentType 'application/json' -ErrorAction Stop
  $token = $r.data.token
} catch {
  $login = @{ email='e2user@example.com'; password='Password123!' } | ConvertTo-Json
  $r = Invoke-RestMethod -Uri 'http://localhost:8083/api/auth/login' -Method Post -Body $login -ContentType 'application/json' -ErrorAction Stop
  $token = $r.data.token
}
Write-Output "TOKEN: $token"
Set-Content -Path 'test_upload_resume.pdf' -Value "Sample resume content`nEmail: e2user@example.com`nPhone: +1-999-0000`nSkills: React, Node" -Encoding ascii
$cmd = "cmd.exe /c curl -v -H `"Authorization: Bearer $token`" -F `"file=@test_upload_resume.pdf`" http://localhost:8083/api/resume/upload-file -o upload_response.json"
Write-Output "Running: $cmd"
Invoke-Expression $cmd
Write-Output "UPLOAD_RESPONSE:"
Get-Content upload_response.json -Raw
