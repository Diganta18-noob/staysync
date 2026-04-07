# ============================================
# StaySync Auto-Committer
# Watches for changes and auto-commits + pushes
# with intelligent commit messages
# ============================================

param(
    [int]$IntervalSeconds = 30,
    [string]$Branch = "main"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host "      StaySync Auto-Committer v1.0      " -ForegroundColor Cyan
Write-Host "      Watching for changes...            " -ForegroundColor Cyan
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Project : $projectRoot" -ForegroundColor DarkGray
Write-Host "  Branch  : $Branch" -ForegroundColor DarkGray
Write-Host "  Interval: Every $IntervalSeconds seconds" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

function Get-SmartCommitMessage {
    $staged = git -C $projectRoot diff --cached --name-only 2>$null
    if (-not $staged) { return $null }

    $files = @($staged -split "`n" | Where-Object { $_.Trim() -ne "" })
    if ($files.Count -eq 0) { return $null }

    $pageFiles = @()
    $componentFiles = @()
    $styleFiles = @()
    $serverFiles = @()
    $configFiles = @()
    $otherFiles = @()

    foreach ($f in $files) {
        $name = Split-Path -Leaf $f
        $cleanName = $name -replace '\.jsx$','' -replace '\.js$','' -replace '\.css$','' -replace '\.json$',''

        if ($f -like "client/src/pages/*") {
            $pageFiles += $cleanName
        }
        elseif ($f -like "client/src/components/*") {
            $componentFiles += $cleanName
        }
        elseif ($f -like "*.css") {
            $styleFiles += $cleanName
        }
        elseif ($f -like "server/*") {
            $serverFiles += $cleanName
        }
        elseif ($f -like "*.json") {
            $configFiles += $cleanName
        }
        else {
            $otherFiles += $cleanName
        }
    }

    # Build message
    $parts = @()

    if ($pageFiles.Count -gt 0) {
        $joined = $pageFiles -join ", "
        $parts += "update $joined page(s)"
    }
    if ($componentFiles.Count -gt 0) {
        $joined = $componentFiles -join ", "
        $parts += "update $joined component(s)"
    }
    if ($styleFiles.Count -gt 0) {
        $parts += "update styles"
    }
    if ($serverFiles.Count -gt 0) {
        $parts += "update server"
    }
    if ($configFiles.Count -gt 0) {
        $parts += "update config"
    }
    if ($parts.Count -eq 0 -and $otherFiles.Count -gt 0) {
        $parts += "update project files"
    }

    # Determine prefix
    $added = git -C $projectRoot diff --cached --diff-filter=A --name-only 2>$null
    $deleted = git -C $projectRoot diff --cached --diff-filter=D --name-only 2>$null

    $prefix = "update: "
    if ($added -and -not $deleted) {
        $prefix = "feat: "
    }
    elseif ($deleted -and -not $added) {
        $prefix = "chore: "
    }
    elseif ($files.Count -le 3) {
        $prefix = "fix: "
    }

    $body = $parts -join ", "
    $count = $files.Count
    $msg = "$prefix$body ($count files)"

    return $msg
}

# Main loop
while ($true) {
    try {
        $status = git -C $projectRoot status --porcelain 2>$null

        if ($status) {
            $ts = Get-Date -Format "HH:mm:ss"

            # Stage everything
            git -C $projectRoot add -A 2>$null

            # Generate commit message
            $msg = Get-SmartCommitMessage

            if ($msg) {
                Write-Host "  [$ts] " -NoNewline -ForegroundColor DarkGray
                Write-Host "Changes detected! " -NoNewline -ForegroundColor Green

                # Commit
                git -C $projectRoot commit -m $msg 2>&1 | Out-Null

                Write-Host "Committed: " -NoNewline -ForegroundColor White
                Write-Host $msg -ForegroundColor Yellow

                # Push
                Write-Host "  [$ts] " -NoNewline -ForegroundColor DarkGray
                Write-Host "Pushing to origin/$Branch... " -NoNewline -ForegroundColor Cyan

                git -C $projectRoot push origin $Branch 2>&1 | Out-Null

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Done!" -ForegroundColor Green
                }
                else {
                    Write-Host "Push failed!" -ForegroundColor Red
                }

                Write-Host ""
            }
        }
    }
    catch {
        $ts = Get-Date -Format "HH:mm:ss"
        Write-Host "  [$ts] Error occurred" -ForegroundColor Red
    }

    Start-Sleep -Seconds $IntervalSeconds
}
