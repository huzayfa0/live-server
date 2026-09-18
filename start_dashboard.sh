#!/bin/bash
# ==============================================================================
# KALI LINUX CYBER DASHBOARD & 4-CH CCTV MONITOR LAUNCHER
# Samsung SyncMaster 933 monitorida to'liq ekran (Kiosk Mode) ochish uchun skript
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

export DISPLAY="${DISPLAY:-:0}"
export XAUTHORITY="${XAUTHORITY:-$HOME/.Xauthority}"
[ -f /root/.Xauthority ] && [ "$USER" = "root" ] && export XAUTHORITY=/root/.Xauthority

# Eski matnli soatni to'xtatish
pkill -f "node clock.js" >/dev/null 2>&1

echo "[*] Kali Cyber Dashboard serveri tekshirilmoqda..."

# 1. dashboard-server.js ishlayaptimi tekshirish
if pgrep -f "node dashboard-server.js" > /dev/null; then
    echo "[+] dashboard-server.js allaqachon ishlayapti."
else
    echo "[+] dashboard-server.js fon rejimida ishga tushirilmoqda..."
    node dashboard-server.js > dashboard.log 2>&1 &
    sleep 2
fi

URL="http://localhost:3000"

# 2. To'liq ekranda (Kiosk) brauzerni ishga tushirish
echo "[*] Brauzer to'liq ekranda ($DISPLAY) ochilmoqda..."

CHROME_FLAGS="--no-sandbox --test-type --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --autoplay-policy=no-user-gesture-required --disable-features=Translate"

if command -v firefox-esr >/dev/null 2>&1; then
    echo "[+] Kali Linux Firefox-ESR aniqlandi, to'liq ekranda ochilmoqda..."
    firefox-esr --kiosk "$URL" >/dev/null 2>&1 &
elif command -v chromium >/dev/null 2>&1; then
    echo "[+] Chromium aniqlandi, to'liq ekranda ochilmoqda..."
    chromium $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v chromium-browser >/dev/null 2>&1; then
    echo "[+] Chromium-browser aniqlandi, to'liq ekranda ochilmoqda..."
    chromium-browser $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
    echo "[+] Firefox aniqlandi, to'liq ekranda ochilmoqda..."
    firefox --kiosk "$URL" >/dev/null 2>&1 &
elif command -v google-chrome >/dev/null 2>&1; then
    echo "[+] Google Chrome aniqlandi, to'liq ekranda ochilmoqda..."
    google-chrome $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v x-www-browser >/dev/null 2>&1; then
    echo "[+] Tizim brauzeri (x-www-browser) ochilmoqda..."
    x-www-browser "$URL" >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 &
else
    echo "[-] Brauzer topilmadi! Iltimos quyidagini o'rnating: sudo apt update && sudo apt install -y firefox-esr"
fi

echo "[✓] Dashboard muvaffaqiyatli ishga tushdi!"
echo "[i] Ekranni yopish uchun Alt+F4 yoki Ctrl+W bosing."
