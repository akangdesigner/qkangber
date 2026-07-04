# 桌面 UI 自動化小工具：點擊座標／送鍵盤輸入。
# 用法：
#   pwsh scripts/ui-input.ps1 -Click 500,300            ← 左鍵點 (500,300)
#   pwsh scripts/ui-input.ps1 -Keys "%/"                 ← SendKeys 語法（%=Alt ^=Ctrl +=Shift）
#   pwsh scripts/ui-input.ps1 -Type "Apps Script"        ← 逐字輸入（不解析特殊符號）
#   pwsh scripts/ui-input.ps1 -Activate "Chrome"         ← 把標題含關鍵字的視窗帶到前景
#   可組合，執行順序固定為 Activate → Click → Keys → Type，各步之間 -DelayMs（預設 400）
param(
  [string]$Activate,
  [string]$Click,
  [string]$Keys,
  [string]$Type,
  [int]$DelayMs = 400
)
Add-Type -AssemblyName System.Windows.Forms
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class UInput {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, UIntPtr e);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  public const uint DOWN = 0x02, UP = 0x04;
  public static void Click(int x, int y) {
    SetCursorPos(x, y);
    System.Threading.Thread.Sleep(120);
    mouse_event(DOWN, 0, 0, 0, UIntPtr.Zero);
    System.Threading.Thread.Sleep(60);
    mouse_event(UP, 0, 0, 0, UIntPtr.Zero);
  }
}
"@
if ($Activate) {
  $proc = Get-Process | Where-Object { $_.MainWindowTitle -like "*$Activate*" } | Select-Object -First 1
  if ($proc) { [UInput]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null; Write-Output "activated: $($proc.MainWindowTitle)" }
  else { Write-Output "no window matching: $Activate" }
  Start-Sleep -Milliseconds $DelayMs
}
if ($Click) {
  $xy = $Click -split ','
  [UInput]::Click([int]$xy[0], [int]$xy[1])
  Write-Output "clicked: $Click"
  Start-Sleep -Milliseconds $DelayMs
}
if ($Keys) {
  [System.Windows.Forms.SendKeys]::SendWait($Keys)
  Write-Output "keys sent: $Keys"
  Start-Sleep -Milliseconds $DelayMs
}
if ($Type) {
  foreach ($ch in $Type.ToCharArray()) {
    $esc = $ch -replace '([+^%~(){}\[\]])', '{$1}'
    [System.Windows.Forms.SendKeys]::SendWait($esc)
    Start-Sleep -Milliseconds 30
  }
  Write-Output "typed: $Type"
}
