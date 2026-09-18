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
CHROME_FLAGS="--no-sandbox --test-type --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --autoplay-policy=no-user-gesture-required --disable-features=Translate"

# Qaysi brauzer mavjudligini aniqlash
BIN=""
if command -v firefox-esr >/dev/null 2>&1; then
    BIN="firefox-esr"
    LAUNCH="firefox-esr --kiosk $URL"
elif command -v chromium >/dev/null 2>&1; then
    BIN="chromium"
    LAUNCH="chromium $CHROME_FLAGS $URL"
elif command -v chromium-browser >/dev/null 2>&1; then
    BIN="chromium-browser"
    LAUNCH="chromium-browser $CHROME_FLAGS $URL"
elif command -v firefox >/dev/null 2>&1; then
    BIN="firefox"
    LAUNCH="firefox --kiosk $URL"
elif command -v google-chrome >/dev/null 2>&1; then
    BIN="google-chrome"
    LAUNCH="google-chrome $CHROME_FLAGS $URL"
elif command -v x-www-browser >/dev/null 2>&1; then
    BIN="x-www-browser"
    LAUNCH="x-www-browser $URL"
fi

if [ -z "$BIN" ]; then
    echo "[-] Brauzer topilmadi! O'rnatish: sudo apt update && sudo apt install -y firefox-esr"
    exit 1
fi

echo "[*] Brauzer aniqlandi: $BIN"

# A) Agar grafik tizim (X11) allaqachon ishlab turgan bo'lsa:
if xset q >/dev/null 2>&1 || [ -n "$DISPLAY" -a "$DISPLAY" != ":0" ]; then
    echo "[+] Grafik tizim faol ($DISPLAY). Brauzer ochilmoqda..."
    $LAUNCH >/dev/null 2>&1 &
    echo "[✓] Dashboard ochildi!"
    exit 0
fi

# B) Agar TTY konsol rejimida bo'lsa (DISPLAY bo'lmasa):
if command -v xinit >/dev/null 2>&1; then
    echo "[+] Konsol rejimi aniqlandi. xinit orqali to'liq ekranli Kiosk ishga tushirilmoqda..."
    xinit $(command -v $BIN) --kiosk "$URL" -- :0 >/dev/null 2>&1
    exit 0
elif command -v startx >/dev/null 2>&1; then
    echo "[+] startx orqali grafik tizim ishga tushirilmoqda..."
    startx
    exit 0
else
    # Fallback: DISPLAY=:0 deb sinab ko'rish
    export DISPLAY=:0
    $LAUNCH >/dev/null 2>&1 &
fi

echo "[✓] Dashboard muvaffaqiyatli ishga tushdi!"
echo "[i] Ekranni yopish uchun Alt+F4 yoki Ctrl+W bosing."
