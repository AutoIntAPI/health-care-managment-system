# to run: powershell -ExecutionPolicy Bypass -File .\run-services.ps1
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RootDir = $PSScriptRoot
$LogDir = Join-Path $RootDir "logs"

if (-not (Test-Path $LogDir)) {
  New-Item -ItemType Directory -Path $LogDir | Out-Null
}

function Require-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Error "Missing required command: $Name"
  }
}

Require-Command "npm"
Require-Command "python"

if ($Env:RUN_INSTALL -eq "1") {
  Write-Host "Installing dependencies..."

  Push-Location (Join-Path $RootDir "services\auth-service")
  npm install
  Pop-Location

  Push-Location (Join-Path $RootDir "services\appointment-service")
  npm install
  Pop-Location

  Push-Location (Join-Path $RootDir "services\doctor-service")
  npm install
  Pop-Location

  Push-Location (Join-Path $RootDir "services\patient-service")
  python -m pip install -r requirements.txt
  Pop-Location

  Push-Location (Join-Path $RootDir "services\billing-service")
  python -m pip install -r requirements.txt
  Pop-Location
} else {
  Write-Host "Skipping dependency install. Set RUN_INSTALL=1 to install."
}

$ServiceProcesses = New-Object System.Collections.Generic.List[System.Diagnostics.Process]

function Start-ServiceProcess {
  param(
    [string]$Name,
    [string]$WorkingDir,
    [string]$Command
  )

  $OutLogFile = Join-Path $LogDir "$Name.log"
  $ErrLogFile = Join-Path $LogDir "$Name.err.log"

  $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $Command `
    -WorkingDirectory $WorkingDir -RedirectStandardOutput $OutLogFile `
    -RedirectStandardError $ErrLogFile -PassThru -NoNewWindow

  $ServiceProcesses.Add($proc) | Out-Null
  Set-Content -Path (Join-Path $LogDir "$Name.pid") -Value $proc.Id
  Write-Host "Started $Name (PID $($proc.Id))"
}

function Stop-Services {
  Write-Host "Stopping services..."
  foreach ($proc in $ServiceProcesses) {
    if (-not $proc.HasExited) {
      Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
  }
}

try {
  Start-ServiceProcess "auth-service" (Join-Path $RootDir "services\auth-service") "npm start"
  Start-ServiceProcess "patient-service" (Join-Path $RootDir "services\patient-service") "python app.py"
  Start-ServiceProcess "doctor-service" (Join-Path $RootDir "services\doctor-service") "npm run build && npm start"
  Start-ServiceProcess "appointment-service" (Join-Path $RootDir "services\appointment-service") "npm start"
  Start-ServiceProcess "billing-service" (Join-Path $RootDir "services\billing-service") "python app.py"

  Write-Host ""
  Write-Host "Health checks:"
  Write-Host "  http://localhost:3001/health"
  Write-Host "  http://localhost:5001/health"
  Write-Host "  http://localhost:3002/health"
  Write-Host "  http://localhost:3003/health"
  Write-Host "  http://localhost:5002/health"
  Write-Host ""
  Write-Host "Logs are in $LogDir (stdout: *.log, stderr: *.err.log)"

  if ($ServiceProcesses.Count -gt 0) {
    Wait-Process -Id ($ServiceProcesses | ForEach-Object { $_.Id })
  }
}
finally {
  Stop-Services
}
