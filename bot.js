require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const token = process.env.TELEGRAM_BOT_TOKEN || '8595048507:AAGMvpzIVzskPXSAOuoqome_mvOhq8Bx6cc';
let ADMIN_ID = process.env.ADMIN_ID ? process.env.ADMIN_ID.trim() : null;

if (!token) {
  console.error("XATOLIK: TELEGRAM_BOT_TOKEN topilmadi! .env fayliga bot tokeningizni kiriting.");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Buyruqlar menyusi
bot.setMyCommands([
  { command: '/terminal', description: '💻 Terminal rejimi (Buyruq yuborish)' },
  { command: '/status', description: '📊 Tizim va server holati' },
  { command: '/pull', description: '🔄 IELTS botni yangilash (Git pull)' },
  { command: '/pm2', description: '⚡️ PM2 jarayonlar ro‘yxati' },
  { command: '/restart', description: '🔁 IELTS botni qayta ishga tushirish' },
  { command: '/logs', description: '📜 IELTS botning oxirgi loglari' },
  { command: '/ip', description: '🌐 Mahalliy va Tashqi IP manzillar' },
  { command: '/clock', description: '🕶 Hacker Soat animatsiyasi' },
  { command: '/help', description: 'ℹ️ Yordam va buyruqlar' }
]);

const mainKeyboard = {
  reply_markup: {
    keyboard: [
      ["💻 Buyruq", "📊 Tizim holati"],
      ["📹 4-CH CCTV Video", "🕶 Hacker Soat"],
      ["⚡️ PM2 jarayonlar", "🔄 IELTS botni yangilash"],
      ["📜 IELTS bot loglari", "🔁 IELTS botni qayta yoqish"],
      ["🌐 IP manzillar", "ℹ️ Yordam"]
    ],
    resize_keyboard: true
  }
};

const userModes = {};

// Admin tekshiruvi funksiyasi
function isAdmin(msg) {
  const userId = msg.from.id.toString();
  if (!ADMIN_ID) {
    return false;
  }
  return userId === ADMIN_ID.toString();
}

// Shell buyrug'ini bajarish yordamchisi
function runShellCommand(cmd, timeoutMs = 30000) {
  const defaultCwd = process.env.HOME || process.cwd();
  return new Promise((resolve) => {
    exec(cmd, { cwd: defaultCwd, timeout: timeoutMs, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      let output = stdout || stderr || '';
      if (error && !output) {
        output = `Xatolik yuz berdi: ${error.message}`;
      }
      resolve(output.trim());
    });
  });
}

// Xabarni bo'lib yuborish (Telegram 4096 belgi limiti uchun)
async function sendLongMessage(chatId, text, parseMode = 'HTML') {
  if (text.length <= 4000) {
    return bot.sendMessage(chatId, text, { parse_mode: parseMode });
  }
  const chunks = text.match(/[\s\S]{1,3900}/g) || [];
  for (const chunk of chunks) {
    await bot.sendMessage(chatId, chunk, { parse_mode: parseMode });
  }
}

// --- /start BUYRUG'I ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!ADMIN_ID) {
    // Hali admin belgilanmagan bo'lsa
    return bot.sendMessage(chatId, 
      `👋 <b>Assalomu alaykum!</b>\n\n` +
      `Sizning Telegram ID raqamingiz: <code>${userId}</code>\n\n` +
      `Bu botni o‘zingizga biriktirish uchun quyidagi buyruqni bosing:\n` +
      `/setme - O‘zingizni admin sifatida saqlash`, { parse_mode: 'HTML' });
  }

  if (!isAdmin(msg)) {
    return bot.sendMessage(chatId, `⛔️ <b>Ruxsat yo‘q!</b>\nBu shaxsiy server boshqaruv boti.\nSizning ID: <code>${userId}</code>`, { parse_mode: 'HTML' });
  }

  bot.sendMessage(chatId, 
    `🚀 <b>Kali Server Boshqaruv Boti Faol!</b>\n\n` +
    `Quyidagi tugmalar orqali serveringiz va Express IELTS botini to‘liq masofadan boshqarishingiz mumkin:`, {
      parse_mode: 'HTML',
      ...mainKeyboard
    }
  );
});

// Admin qilib belgilash (/setme)
bot.onText(/\/setme/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (ADMIN_ID) {
    return bot.sendMessage(chatId, "⚠️ Admin allaqachon belgilangan.");
  }

  ADMIN_ID = userId.toString();
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('ADMIN_ID=')) {
      envContent = envContent.replace(/ADMIN_ID=.*/g, `ADMIN_ID=${ADMIN_ID}`);
    } else {
      envContent += `\nADMIN_ID=${ADMIN_ID}\n`;
    }
  } else {
    envContent = `ADMIN_ID=${ADMIN_ID}\n`;
  }
  fs.writeFileSync(envPath, envContent);

  bot.sendMessage(chatId, `✅ <b>Muvaffaqiyatli!</b> Siz admin sifatida belgilandingiz (ID: <code>${ADMIN_ID}</code>).`, {
    parse_mode: 'HTML',
    ...mainKeyboard
  });
});

// --- /status (TIZIM HOLATI) ---
async function handleStatus(chatId) {
  bot.sendMessage(chatId, "⏳ <i>Tizim ma'lumotlari yig'ilmoqda...</i>", { parse_mode: 'HTML' });

  const uptime = await runShellCommand("uptime -p");
  const ram = await runShellCommand("free -h | awk '/Mem:/ {print \"Jami: \" $2 \", Ishlatilmoqda: \" $3 \", Bo‘sh: \" $4}'");
  const disk = await runShellCommand("df -h / | awk 'NR==2 {print \"Jami: \" $2 \", Band: \" $3 \" (\" $5 \"), Bo‘sh: \" $4}'");
  const pm2List = await runShellCommand("pm2 jlist");

  let pm2Info = "";
  try {
    const list = JSON.parse(pm2List);
    if (list && list.length > 0) {
      pm2Info = list.map(app => {
        const icon = app.pm2_env.status === 'online' ? '🟢' : '🔴';
        return `${icon} <b>${app.name}</b>: ${app.pm2_env.status} (RAM: ${Math.round(app.monit.memory / 1024 / 1024)}MB, CPU: ${app.monit.cpu}%)`;
      }).join("\n");
    } else {
      pm2Info = "Hech qanday jarayon yo'q";
    }
  } catch (e) {
    pm2Info = "PM2 ma'lumotini o'qib bo'lmadi";
  }

  const response = `📊 <b>KALI LINUX TIZIM HOLATI:</b>\n\n` +
    `⏱ <b>Ish vaqti (Uptime):</b> ${uptime}\n` +
    `🧠 <b>Operativ xotira (RAM):</b>\n   ${ram}\n` +
    `💾 <b>Disk (/):</b>\n   ${disk}\n\n` +
    `⚡️ <b>PM2 Jarayonlar:</b>\n${pm2Info}`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
}

// --- /pull (YANGILASH VA RESTART) ---
async function handleGitPull(chatId) {
  bot.sendMessage(chatId, "⏳ <i>GitHub'dan yangi kod yuklanmoqda va IELTS boti qayta ishga tushirilmoqda...</i>", { parse_mode: 'HTML' });

  // Home papkadagi Ielts-express-bot ga o'tib git pull va pm2 restart qilish
  const cmd = `cd ~/Ielts-express-bot && git pull origin main && pm2 restart express-ielts-bot`;
  const result = await runShellCommand(cmd, 60000);

  const response = `🔄 <b>YANGILASH NATIJASI:</b>\n\n<pre>${result || "Buyruq bajarildi, lekin natija bo'sh."}</pre>`;
  sendLongMessage(chatId, response);
}

// --- /pm2 (JARAYONLAR) ---
async function handlePM2Status(chatId) {
  const result = await runShellCommand("pm2 status");
  sendLongMessage(chatId, `⚡️ <b>PM2 JARAYONLAR:</b>\n\n<pre>${result}</pre>`);
}

// --- /restart (IELTS BOTNI QAYTA YOQISH) ---
async function handleRestart(chatId) {
  bot.sendMessage(chatId, "⏳ <i>IELTS boti qayta ishga tushirilmoqda...</i>", { parse_mode: 'HTML' });
  const result = await runShellCommand("pm2 restart express-ielts-bot");
  sendLongMessage(chatId, `🔁 <b>Qayta yoqish natijasi:</b>\n\n<pre>${result}</pre>`);
}

// --- /logs (OXIRGI LOGLAR) ---
async function handleLogs(chatId) {
  bot.sendMessage(chatId, "⏳ <i>Oxirgi loglar olinmoqda...</i>", { parse_mode: 'HTML' });
  const result = await runShellCommand("pm2 logs express-ielts-bot --lines 25 --nostream");
  sendLongMessage(chatId, `📜 <b>OXIRGI 25 TA LOG:</b>\n\n<pre>${result || "Loglar topilmadi."}</pre>`);
}

// --- /ip (IP MANZILLAR) ---
async function handleIP(chatId) {
  const localIp = await runShellCommand("hostname -I | awk '{print $1}'");
  const publicIp = await runShellCommand("curl -s ifconfig.me || curl -s icanhazip.com || echo 'Aniqlab bo‘lmadi'");

  const response = `🌐 <b>IP MANZILLAR:</b>\n\n` +
    `🏠 <b>Mahalliy IP (LAN):</b> <code>${localIp}</code>\n` +
    `🌍 <b>Tashqi IP (Public):</b> <code>${publicIp}</code>`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
}

// --- /cmd BUYRUG'I (Terminal buyruqlarini bajarish) ---
bot.onText(/\/cmd (.+)/, async (msg, match) => {
  if (!isAdmin(msg)) return;
  const command = match[1];

  bot.sendMessage(msg.chat.id, `⏳ <i>Bajarilmoqda:</i> <code>${command}</code>`, { parse_mode: 'HTML' });
  const result = await runShellCommand(command, 60000);

  sendLongMessage(msg.chat.id, `💻 <b>NATIJA:</b>\n\n<pre>${result || "Buyruq muvaffaqiyatli bajarildi (hech qanday matn chiqmadi)."}</pre>`);
});

// --- /cctv (4-CH REAL CCTV MP4 VIDEO DASHBOARD) ---
async function handleCCTV(chatId) {
  bot.sendMessage(chatId, "⏳ <i>Monitorda 4-CH Real MP4 Video ochilmoqda...</i>", { parse_mode: 'HTML' });
  const cmd = "export DISPLAY=:0; export XAUTHORITY=/home/kali/.Xauthority; [ -f /root/.Xauthority ] && export XAUTHORITY=/root/.Xauthority; bash ~/live-server/start_dashboard.sh";
  await runShellCommand(cmd);
  bot.sendMessage(chatId, "✅ <b>Monitorda 4-CH Real CCTV Video (MP4) to'liq ekranda ochildi!</b>\n\n📺 Ekranda 4 ta haqiqiy video (ko'cha mashinalari, piyodalar, chorraha, parkovka) va neon soat ko'rinmoqda.", { parse_mode: 'HTML' });
}

// --- /clock (HACKER SOAT) ---
function handleClock(chatId) {
  const clockText = `🕶 <b>KALI HACKER SOATI VA MONITORINGI</b>\n\n` +
    `Ushbu animatsiyali hacker soatini Kali serveringiz ekraniga qo‘yish uchun:\n\n` +
    `🖥 <b>1. Kali terminalida shunchaki quyidagi buyruqni bering:</b>\n` +
    `<code>node ~/live-server/clock.js</code>\n\n` +
    `🟢 Ekranda katta yashil raqamlar, Matrix animatsiyasi, real-vaqtdagi RAM va Uptime monitori yonib turadi!\n\n` +
    `⌨️ <b>Chiqish:</b> Serverda ishlash kerak bo‘lsa, shunchaki <b>Ctrl + C</b> tugmasini bossangiz, terminal darhol o‘z holiga qaytadi!`;

  bot.sendMessage(chatId, clockText, { parse_mode: 'HTML' });
}

// --- TERMINAL REJIMI (BUYRUQ) ---
function enterTerminalMode(chatId) {
  userModes[chatId] = 'TERMINAL';
  const text = `💻 <b>KALI TERMINAL REJIMI YOQILDI</b>\n\n` +
    `Endi Kali Linux terminalida bajarmoqchi bo‘lgan istalgan buyrug‘ingizni to‘g‘ridan-to‘g‘ri yozing va jo‘nating!\n\n` +
    `Masalan:\n` +
    `• <code>ls -la</code>\n` +
    `• <code>uptime</code>\n` +
    `• <code>df -h</code>\n` +
    `• <code>free -m</code>\n` +
    `• <code>pm2 status</code>\n` +
    `• <code>ip a</code>\n` +
    `• <code>node -v</code>\n\n` +
    `❌ Chiqish uchun: pastdagi <b>«❌ Chiqish»</b> tugmasini bosing.`;

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [["❌ Chiqish"]],
      resize_keyboard: true
    }
  });
}

// --- TEXT TUGMALARNI QABUL QILISH ---
bot.on('message', async (msg) => {
  const text = msg.text || '';
  if (text.startsWith('/')) return;
  if (!isAdmin(msg)) return;

  const chatId = msg.chat.id;

  if (text === "❌ Chiqish") {
    userModes[chatId] = null;
    bot.sendMessage(chatId, "✅ Terminal rejimidan chiqildi. Asosiy menyu:", mainKeyboard);
    return;
  }

  // Agar foydalanuvchi TERMINAL rejimida bo'lsa:
  if (userModes[chatId] === 'TERMINAL') {
    bot.sendMessage(chatId, `⏳ <i>Bajarilmoqda:</i> <code>${text}</code>`, { parse_mode: 'HTML' });
    const result = await runShellCommand(text, 60000);
    await sendLongMessage(chatId, `💻 <b>NATIJA:</b>\n\n<pre>${result || "Buyruq muvaffaqiyatli bajarildi (hech qanday xabar chiqmadi)."}</pre>`);
    return;
  }

  if (text === "💻 Buyruq") {
    enterTerminalMode(chatId);
  } else if (text === "📊 Tizim holati") {
    handleStatus(chatId);
  } else if (text === "🔄 IELTS botni yangilash") {
    handleGitPull(chatId);
  } else if (text === "⚡️ PM2 jarayonlar") {
    handlePM2Status(chatId);
  } else if (text === "📜 IELTS bot loglari") {
    handleLogs(chatId);
  } else if (text === "🔁 IELTS botni qayta yoqish") {
    handleRestart(chatId);
  } else if (text === "🌐 IP manzillar") {
    handleIP(chatId);
  } else if (text === "📹 4-CH CCTV Video") {
    handleCCTV(chatId);
  } else if (text === "🕶 Hacker Soat") {
    handleClock(chatId);
  } else if (text === "ℹ️ Yordam") {
    bot.sendMessage(chatId, "Quyidagi menyu orqali buyruqlarni berishingiz mumkin:", mainKeyboard);
  }
});

// Slash buyruqlar ulanishi
bot.onText(/\/terminal/, (msg) => { if (isAdmin(msg)) enterTerminalMode(msg.chat.id); });
bot.onText(/\/status/, (msg) => { if (isAdmin(msg)) handleStatus(msg.chat.id); });
bot.onText(/\/pull/, (msg) => { if (isAdmin(msg)) handleGitPull(msg.chat.id); });
bot.onText(/\/pm2/, (msg) => { if (isAdmin(msg)) handlePM2Status(msg.chat.id); });
bot.onText(/\/restart/, (msg) => { if (isAdmin(msg)) handleRestart(msg.chat.id); });
bot.onText(/\/logs/, (msg) => { if (isAdmin(msg)) handleLogs(msg.chat.id); });
bot.onText(/\/ip/, (msg) => { if (isAdmin(msg)) handleIP(msg.chat.id); });
bot.onText(/\/clock/, (msg) => { if (isAdmin(msg)) handleClock(msg.chat.id); });
bot.onText(/\/cctv/, (msg) => { if (isAdmin(msg)) handleCCTV(msg.chat.id); });

bot.onText(/\/help/, (msg) => {
  if (!isAdmin(msg)) return;
  const helpText = `ℹ️ <b>KALI CONTROLLER BUYRUQLARI:</b>\n\n` +
    `• <b>💻 Buyruq</b> (/terminal) — Terminal rejimiga kirish va buyruq yuborish\n` +
    `• <b>📊 Tizim holati</b> (/status) — CPU, RAM, disk, bot holati\n` +
    `• <b>🔄 IELTS botni yangilash</b> (/pull) — Git pull qilib, botni yangi kod bilan qayta yoqadi\n` +
    `• <b>⚡️ PM2 jarayonlar</b> (/pm2) — pm2 status jadvali\n` +
    `• <b>🔁 Qayta yoqish</b> (/restart) — IELTS botini qayta ishga tushirish\n` +
    `• <b>📜 Loglar</b> (/logs) — Xatolik va loglarni ko‘rish\n` +
    `• <b>🌐 IP manzillar</b> (/ip) — Lokal va global IP\n` +
    `• <b>🕶 Hacker Soat</b> (/clock) — Kali monitoriga hacker soatini qo‘yish\n` +
    `• <b>💻 /cmd &lt;buyruq&gt;</b> — Bitta alohida terminal buyrug‘ini bajarish`;

  bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML', ...mainKeyboard });
});

console.log("Kali Server Boshqaruv Boti ishga tushdi...");
