#!/usr/bin/env node

const os = require('os');

// ANSI rang kodlari
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92m';
const DARK_GREEN = '\x1b[38;5;22m';
const CYAN = '\x1b[96m';
const WHITE = '\x1b[97m';
const YELLOW = '\x1b[93m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CLEAR = '\x1b[2J\x1b[H';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';

// Katta 3D/Hacker raqamlar shrifti (5 qator)
const font = {
  '0': [
    ' ██████╗ ',
    '██╔═████╗',
    '██║██╔██║',
    '████╔╝██║',
    '╚██████╔╝'
  ],
  '1': [
    '   ██╗   ',
    '  ███║   ',
    '  ╚██║   ',
    '   ██║   ',
    '   ██║   '
  ],
  '2': [
    '██████╗  ',
    '╚════██╗ ',
    ' █████╔╝ ',
    '██╔═══╝  ',
    '███████╗ '
  ],
  '3': [
    '██████╗  ',
    '╚════██╗ ',
    ' █████╔╝ ',
    ' ╚═══██╗ ',
    '██████╔╝ '
  ],
  '4': [
    '██╗  ██╗ ',
    '██║  ██║ ',
    '███████╗ ',
    '╚════██║ ',
    '     ██║ '
  ],
  '5': [
    '███████╗ ',
    '██╔════╝ ',
    '███████╗ ',
    '╚════██║ ',
    '███████╔╝'
  ],
  '6': [
    ' ██████╗ ',
    '██╔════╝ ',
    '███████╗ ',
    '██╔═══██╗',
    '╚██████╔╝'
  ],
  '7': [
    '███████╗ ',
    '╚════██║ ',
    '    ██╔╝ ',
    '   ██╔╝  ',
    '   ██║   '
  ],
  '8': [
    ' ██████╗ ',
    '██╔═══██╗',
    '╚██████╔╝',
    '██╔═══██╗',
    '╚██████╔╝'
  ],
  '9': [
    ' ██████╗ ',
    '██╔═══██╗',
    '╚███████║',
    ' ╚═══██║ ',
    ' ██████╔╝'
  ],
  ':': [
    '   ',
    ' █ ',
    '   ',
    ' █ ',
    '   '
  ],
  ' ': [
    '  ',
    '  ',
    '  ',
    '  ',
    '  '
  ]
};

// Kursorni yashirish
process.stdout.write(HIDE_CURSOR);

// Ctrl + C bosilganda toza chiqish
process.on('SIGINT', () => {
  process.stdout.write(CLEAR);
  process.stdout.write(SHOW_CURSOR);
  console.log(`${BRIGHT_GREEN}${BOLD}[✔] Hacker soati to'xtatildi. Terminalga xush kelibsiz!${RESET}\n`);
  process.exit(0);
});

// ProgressBar yasash funksiyasi
function createBar(percent, length = 20) {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return `${BRIGHT_GREEN}${'█'.repeat(filled)}${DARK_GREEN}${'░'.repeat(empty)}${RESET}`;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 65) {
  const chars = '01アイウエオカキクケコサシスセソタチツテト01010101XYZ#%@*';
  let str = '';
  for (let i = 0; i < len; i++) {
    const r = Math.random();
    if (r > 0.8) {
      str += `${WHITE}${chars[Math.floor(Math.random() * chars.length)]}${RESET}`;
    } else if (r > 0.4) {
      str += `${BRIGHT_GREEN}${chars[Math.floor(Math.random() * chars.length)]}${RESET}`;
    } else {
      str += `${DARK_GREEN}${chars[Math.floor(Math.random() * chars.length)]}${RESET}`;
    }
  }
  return str;
}

let tick = 0;

function render() {
  tick++;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  // Har sekundda ikki nuqta yonib-o'chishi
  const colon = (tick % 2 === 0) ? ':' : ' ';
  const timeStr = `${hh}${colon}${mm}${colon}${ss}`;

  // Katta raqamlarni qatorlab birlashtirish
  const lines = ['', '', '', '', ''];
  for (const char of timeStr) {
    const glyph = font[char] || font[' '];
    for (let i = 0; i < 5; i++) {
      lines[i] += glyph[i] + ' ';
    }
  }

  // Tizim parametrlari
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramPercent = Math.round((usedMem / totalMem) * 100);
  const uptimeSec = Math.floor(os.uptime());
  const upHours = Math.floor(uptimeSec / 3600);
  const upMins = Math.floor((uptimeSec % 3600) / 60);

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

  const dateStr = `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()} // ${days[now.getDay()]}`;

  let out = CLEAR;

  // Sarlavha (Cyber HUD Header)
  out += `${GREEN}╔═════════════════════════════════════════════════════════════════════════════════════╗${RESET}\n`;
  out += `${GREEN}║  ${BRIGHT_GREEN}${BOLD}[●] KALI CYBER TERMINAL${RESET}  ${DARK_GREEN}//${RESET}  ${CYAN}NODE: ${os.hostname()}${RESET}  ${DARK_GREEN}//${RESET}  ${YELLOW}SYSTEM: 24/7 ONLINE${RESET}  ${GREEN}║${RESET}\n`;
  out += `${GREEN}╚═════════════════════════════════════════════════════════════════════════════════════╝${RESET}\n\n`;

  // Matrix Stream 1
  out += `   ${getMatrixStream(75)}\n\n`;

  // Soat (Katta yashil neon)
  for (const line of lines) {
    out += `   ${BRIGHT_GREEN}${BOLD}${line}${RESET}\n`;
  }

  out += `\n   ${CYAN}>>> ${dateStr.toUpperCase()} <<<${RESET}\n\n`;

  // Matrix Stream 2
  out += `   ${getMatrixStream(75)}\n\n`;

  // Tizim ko'rsatkichlari (Telemetry)
  out += `   ${GREEN}┌──[ ${WHITE}${BOLD}SERVER TELEMETRIYA${RESET}${GREEN} ]────────────────────────────────────────────────────┐${RESET}\n`;
  out += `   ${GREEN}│${RESET}  🧠 RAM: [${createBar(ramPercent, 22)}] ${WHITE}${ramPercent}%${RESET} (${Math.round(usedMem / 1024 / 1024)}MB / ${Math.round(totalMem / 1024 / 1024)}MB)\n`;
  out += `   ${GREEN}│${RESET}  ⏱ UPTIME: ${WHITE}${upHours} soat, ${upMins} daqiqa${RESET}\n`;
  out += `   ${GREEN}│${RESET}  🛡 STATUS: ${BRIGHT_GREEN}FIREWALL ACTIVE // EXPRESS IELTS BOT RUNNING${RESET}\n`;
  out += `   ${GREEN}│${RESET}  💻 PLATFORMA: ${CYAN}${os.type()} ${os.arch()} (Linux Kernel ${os.release()})${RESET}\n`;
  out += `   ${GREEN}└─────────────────────────────────────────────────────────────────────────────┘${RESET}\n\n`;

  out += `   ${DARK_GREEN}⚡️ Ishlash uchun: ${WHITE}${BOLD}CTRL + C${RESET}${DARK_GREEN} ni bosing (Terminalga qaytish) ⚡️${RESET}\n`;

  process.stdout.write(out);
}

// Boshlanishida bir marta tozalab darhol render qilish
render();

// Har sekundda yangilash
setInterval(render, 1000);
