#!/bin/bash
# ==============================================================================
# KALI LINUX CYBER DASHBOARD & 4-CH CCTV MONITOR LAUNCHER
# Samsung SyncMaster 933 monitorida to'liq ekran (Kiosk Mode) ochish uchun skript
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

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

export DISPLAY="${DISPLAY:-:0}"
export XAUTHORITY="${XAUTHORITY:-$HOME/.Xauthority}"
[ -f /root/.Xauthority ] && [ "$USER" = "root" ] && export XAUTHORITY=/root/.Xauthority

# 2. To'liq ekranda (Kiosk) brauzerni ishga tushirish
echo "[*] Brauzer to'liq ekranda ($DISPLAY) ochilmoqda..."

CHROME_FLAGS="--no-sandbox --test-type --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --autoplay-policy=no-user-gesture-required --disable-features=Translate"

if command -v chromium >/dev/null 2>&1; then
    chromium $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome $CHROME_FLAGS "$URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
    firefox --kiosk "$URL" >/dev/null 2>&1 &
else
    echo "[-] Brauzer topilmadi! Iltimos, quyidagi havolani brauzerda oching: $URL"
fi

echo "[✓] Dashboard muvaffaqiyatli ishga tushdi!"
echo "[i] Ekranni yopish uchun Alt+F4 yoki Ctrl+W bosing."
