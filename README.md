# Kali Linux Server Controller Bot 🤖

Kali Linux kompyuteringizni va unda ishlayotgan loyihalarni (masalan, Express IELTS Telegram botini) masofadan, dunyoning istalgan nuqtasidan turib boshqarish uchun shaxsiy Telegram bot.

## Imkoniyatlar:
- 📊 **Tizim holati (/status):** Uptime, CPU, RAM va Disk bandligi
- 🔄 **Avto-yangilash (/pull):** `git pull origin main` qilib, botni avtomatik qayta yurgizadi
- ⚡️ **PM2 monitoring (/pm2):** Barcha jarayonlar holatini ko'rish
- 🔁 **Qayta yoqish (/restart):** IELTS botini qayta ishga tushirish
- 📜 **Loglar (/logs):** Oxirgi xatoliklar va loglarni o'qish
- 🌐 **IP manzillar (/ip):** Mahalliy (LAN) va tashqi (Public) IP larni ko'rish
- 💻 **Terminal buyrug'i (/cmd):** Istalgan Linux buyrug'ini masofadan bajarish

## O'rnatish (Kali Linux'da):

```bash
git clone https://github.com/huzayfa0/server-bot.git
cd server-bot
npm install
```

## Sozlash (.env):

`.env` fayli yarating:
```bash
nano .env
```

Ichiga yozing:
```
TELEGRAM_BOT_TOKEN=SIZNING_YANGI_BOT_TOKENINGIZ
ADMIN_ID=SIZNING_TELEGRAM_ID
```
*(Eslatma: Agar ADMIN_ID ni bilmasangiz, faqat tokenni yozib botni yoqsangiz, bot o'zi sizga ID raqamingizni chiqarib beradi va `/setme` orqali saqlab oladi).*

## Ishga tushirish:

```bash
pm2 start bot.js --name "server-controller"
pm2 save
```
