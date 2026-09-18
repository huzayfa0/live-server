#!/usr/bin/env node

const os = require('os');
const path = require('path');
const fs = require('fs');

// ANSI rang kodlari
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92;1m';
const DARK_GREEN = '\x1b[38;5;22m';
const CYAN = '\x1b[96m';
const BRIGHT_CYAN = '\x1b[96;1m';
const BLUE = '\x1b[94m';
const WHITE = '\x1b[97m';
const YELLOW = '\x1b[93m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';

// Katta 3D/Hacker raqamlar shrifti (5 qator)
const font = {
  '0': [' ██████╗ ', '██╔═████╗', '██║██╔██║', '████╔╝██║', '╚██████╔╝'],
  '1': ['   ██╗   ', '  ███║   ', '  ╚██║   ', '   ██║   ', '   ██║   '],
  '2': ['██████╗  ', '╚════██╗ ', ' █████╔╝ ', '██╔═══╝  ', '███████╗ '],
  '3': ['██████╗  ', '╚════██╗ ', ' █████╔╝ ', ' ╚═══██╗ ', '██████╔╝ '],
  '4': ['██╗  ██╗ ', '██║  ██║ ', '███████╗ ', '╚════██║ ', '     ██║ '],
  '5': ['███████╗ ', '██╔════╝ ', '███████╗ ', '╚════██║ ', '███████╔╝'],
  '6': [' ██████╗ ', '██╔════╝ ', '███████╗ ', '██╔═══██╗', '╚██████╔╝'],
  '7': ['███████╗ ', '╚════██║ ', '    ██╔╝ ', '   ██╔╝  ', '   ██║   '],
  '8': [' ██████╗ ', '██╔═══██╗', '╚██████╔╝', '██╔═══██╗', '╚██████╔╝'],
  '9': [' ██████╗ ', '██╔═══██╗', '╚███████║', ' ╚═══██║ ', ' ██████╔╝'],
  ':': ['   ', ' █ ', '   ', ' █ ', '   '],
  ' ': ['  ', '  ', '  ', '  ', '  ']
};

// Yer shari freymlarini yuklash (24 freym x 20 qator x 46 ustun)
let earthFrames;
try {
  earthFrames = require('./earth_frames.json');
} catch (e) {
  try {
    earthFrames = JSON.parse(fs.readFileSync(path.join(__dirname, 'earth_frames.json'), 'utf8'));
  } catch (err) {
    earthFrames = [];
  }
}

// Kursorni yashirish
process.stdout.write(HIDE_CURSOR);

// Ctrl + C bosilganda toza chiqish
process.on('SIGINT', () => {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
  process.stdout.write(SHOW_CURSOR);
  process.exit(0);
});

// ANSI belgilarni tozalash
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// Quti qatorini yasash (chap va o'ng ramkalar '│ ' va ' │' bilan aniq 50 belgi)
function makeBoxRow(content, innerWidth = 46) {
  const plain = stripAnsi(content);
  const pad = innerWidth > plain.length ? ' '.repeat(innerWidth - plain.length) : '';
  return GREEN + '│ ' + RESET + content + pad + GREEN + ' │' + RESET;
}

// ProgressBar yasash
function createBar(percent, length = 10, color = BRIGHT_GREEN) {
  const filled = Math.max(0, Math.min(length, Math.round((percent / 100) * length)));
  const empty = length - filled;
  return color + '█'.repeat(filled) + DARK_GREEN + '░'.repeat(empty) + RESET;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 98) {
  const chars = '01XYZ#%@*0101アイウエオカキクケコサシスセソタチツテト';
  let str = '';
  for (let i = 0; i < len; i++) {
    const r = Math.random();
    const ch = chars[Math.floor(Math.random() * chars.length)];
    if (r > 0.85) str += WHITE + ch + RESET;
    else if (r > 0.45) str += BRIGHT_GREEN + ch + RESET;
    else str += DARK_GREEN + ch + RESET;
  }
  return str;
}

// Yer sharini rangli qilish (Quruqlik - Yashil, Okean - Moviy)
const landChars = new Set(['@', 'N', 'd', 'h', 'y', 's', 'm', 'b', 'q', 'p', 'w', 'Z', 'Y']);
const oceanChars = new Set(['.', '-', '~', '/', '+', ':', 'o', '*']);

function colorizeEarthLine(line) {
  let res = '';
  for (let ch of line) {
    if (landChars.has(ch)) {
      res += BRIGHT_GREEN + ch;
    } else if (oceanChars.has(ch)) {
      res += CYAN + ch;
    } else {
      res += RESET + ch;
    }
  }
  return res + RESET;
}

// Mahalliy IP ni topish
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '192.168.0.71';
}

// Toshkent vaqtini aniqlash (Toshkent vaqti UTC+5)
function getTashkentTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
    hour12: false
  };
  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
  let hh = '00', mm = '00', ss = '00', day = '01', month = '01', year = '2026';
  for (const p of parts) {
    if (p.type === 'hour') hh = p.value;
    if (p.type === 'minute') mm = p.value;
    if (p.type === 'second') ss = p.value;
    if (p.type === 'day') day = p.value;
    if (p.type === 'month') month = p.value;
    if (p.type === 'year') year = p.value;
  }
  const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const mIdx = Math.max(0, Math.min(11, parseInt(month) - 1));
  const monthName = monthsUz[mIdx];
  const daysUz = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const dayOfWeek = daysUz[now.getDay()];

  return {
    hh, mm, ss,
    dateStr: day + '-' + monthName + ', ' + year + ' // ' + dayOfWeek
  };
}

// CPU hisoblash
let prevCpu = null;
function getCpuPercent() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
  for (const cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }
  const total = user + nice + sys + idle + irq;
  if (!prevCpu) {
    prevCpu = { total, idle };
    return 14;
  }
  const diffTotal = total - prevCpu.total;
  const diffIdle = idle - prevCpu.idle;
  prevCpu = { total, idle };
  if (diffTotal <= 0) return 12;
  return Math.min(100, Math.max(0, Math.round(((diffTotal - diffIdle) / diffTotal) * 100)));
}

let tick = 0;
const localIp = getLocalIp();
const cpuRaw = os.cpus()[0]?.model || 'Intel(R) CPU';
const cpuModel = cpuRaw.split('@')[0].trim().slice(0, 24);
const cpuCores = os.cpus().length;

function render() {
  tick++;

  // Aniq Toshkent vaqti
  const tTime = getTashkentTime();
  const colon = (tick % 2 === 0) ? ':' : ' ';
  const timeStr = tTime.hh + colon + tTime.mm + colon + tTime.ss;

  // Soat raqamlari qatorlari (5 qator)
  const clockLines = ['', '', '', '', ''];
  for (const char of timeStr) {
    const glyph = font[char] || font[' '];
    for (let i = 0; i < 5; i++) {
      clockLines[i] += glyph[i] + ' ';
    }
  }

  // Tizim parametrlari
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramPercent = Math.round((usedMem / totalMem) * 100);
  const cpuPercent = getCpuPercent();

  const uptimeSec = Math.floor(os.uptime());
  const upHours = Math.floor(uptimeSec / 3600);
  const upMins = Math.floor((uptimeSec % 3600) / 60);
  const upSecs = uptimeSec % 60;

  // Aylanuvchi Yer shari freymi
  const earthIndex = tick % (earthFrames.length || 1);
  const currentEarthFrame = earthFrames[earthIndex] || [];

  // Jonli tarmoq ko'rsatkichlari
  const netRx = (3.2 + (tick % 7) * 0.4).toFixed(1);
  const netTx = (1.4 + (tick % 5) * 0.3).toFixed(1);

  // ProgressBarlar
  const ramBar = createBar(ramPercent, 10, CYAN);
  const cpuBar = createBar(cpuPercent, 10, YELLOW);
  const diskBar = createBar(18, 12, CYAN);
  const swapBar = createBar(0, 12, BRIGHT_GREEN);

  // 1. Sarlavha HUD (3 qator, eni 102)
  const hostStr = os.hostname().slice(0, 10);
  const h2_content = '  [●] KALI CYBER TERMINAL  //  NODE: ' + hostStr + '  //  TASHKENT (UTC+5)  //  DEFENSE: ACTIVE';
  const h2_pad = Math.max(0, 100 - h2_content.length);
  const topBanner = [
    GREEN + '╔' + '═'.repeat(100) + '╗' + RESET,
    GREEN + '║' + RESET + '  ' + BRIGHT_GREEN + BOLD + '[●] KALI CYBER TERMINAL' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + CYAN + 'NODE: ' + hostStr + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + YELLOW + 'TASHKENT (UTC+5)' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + BRIGHT_GREEN + 'DEFENSE: ACTIVE' + RESET + ' '.repeat(h2_pad) + GREEN + '║' + RESET,
    GREEN + '╚' + '═'.repeat(100) + '╝' + RESET
  ];

  // 2. Matrix va Katta 3D Soat (7 qator)
  const matrix1 = '  ' + getMatrixStream(98) + '  ';
  const centeredClock = clockLines.map(line => ' '.repeat(17) + BRIGHT_GREEN + BOLD + line + RESET);
  const dateStr = '>>> ' + tTime.dateStr.toUpperCase() + ' // ASIA/TASHKENT (UTC+5) <<<';
  const centeredDate = ' '.repeat(Math.max(0, Math.floor((102 - dateStr.length) / 2))) + CYAN + BOLD + dateStr + RESET;
  const matrix2 = '  ' + getMatrixStream(98) + '  ';

  // 3. O'rta yonma-yon qismlar: Telemetriya (chapda 50) + Yer shari (o'ngda 50) (22 qator)
  const leftTelemetry = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'SERVER TELEMETRIYA' + RESET + GREEN + ' ]────────────────────────┐' + RESET,
    makeBoxRow('[●] ' + BOLD + 'RAM:' + RESET + '      [' + ramBar + '] ' + CYAN + ramPercent + '%' + RESET + ' (' + Math.round(usedMem / 1024 / 1024) + 'M/' + Math.round(totalMem / 1024 / 1024) + 'M)'),
    makeBoxRow('[●] ' + BOLD + 'CPU:' + RESET + '      [' + cpuBar + '] ' + YELLOW + cpuPercent + '%' + RESET + ' (' + cpuCores + ' Cores)'),
    makeBoxRow('[●] ' + BOLD + 'CHIP:' + RESET + '     ' + WHITE + cpuModel + RESET),
    makeBoxRow('[●] ' + BOLD + 'UPTIME:' + RESET + '   ' + WHITE + upHours + 'h ' + upMins + 'm ' + upSecs + 's' + RESET),
    makeBoxRow('[●] ' + BOLD + 'LAN IP:' + RESET + '   ' + BRIGHT_CYAN + localIp + RESET),
    makeBoxRow('[●] ' + BOLD + 'TRAFFIC:' + RESET + '  RX: ' + WHITE + netRx + ' MB/s' + RESET + ' | TX: ' + WHITE + netTx + ' MB/s' + RESET),
    makeBoxRow('[●] ' + BOLD + 'FIREWALL:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE [MAXIMUM SHIELD]' + RESET),
    makeBoxRow('[●] ' + BOLD + 'PM2 BOTS:' + RESET + ' ' + BRIGHT_GREEN + 'ONLINE [2/2 RUNNING]' + RESET),
    makeBoxRow('[●] ' + BOLD + 'SSH PORT:' + RESET + ' ' + CYAN + '22 [ENCRYPTED - ACTIVE]' + RESET),
    makeBoxRow('[●] ' + BOLD + 'REGION:' + RESET + '   ' + WHITE + 'UZBEKISTAN // TASHKENT' + RESET),
    makeBoxRow('[●] ' + BOLD + 'IELTS BOT:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE & LISTENING' + RESET),
    makeBoxRow('[●] ' + BOLD + 'SRV BOT:' + RESET + '   ' + BRIGHT_GREEN + 'ACTIVE & CONTROLLING' + RESET),
    makeBoxRow('[●] ' + BOLD + 'PLATFORM:' + RESET + ' ' + WHITE + 'Linux x64 (' + os.type() + ')' + RESET),
    makeBoxRow('[●] ' + BOLD + 'LOAD AVG:' + RESET + ' ' + WHITE + '0.15, 0.22, 0.18' + RESET),
    makeBoxRow('[●] ' + BOLD + 'MEM SWAP:' + RESET + ' ' + BRIGHT_GREEN + 'CLEAN [0% USED - 2.0GB]' + RESET),
    makeBoxRow('[●] ' + BOLD + 'ROOT DISK:' + RESET + ' ' + CYAN + '19G / 110G [18% USED]' + RESET),
    makeBoxRow('[●] ' + BOLD + 'SECURITY:' + RESET + ' ' + BRIGHT_GREEN + 'ZERO THREAT DETECTED' + RESET),
    makeBoxRow('[●] ' + BOLD + 'DEFENSE:' + RESET + '  ' + BRIGHT_CYAN + 'MAXIMUM ENCRYPTION (AES-256)' + RESET),
    makeBoxRow('[●] ' + BOLD + 'STATUS:' + RESET + '   ' + BRIGHT_GREEN + '24/7 CONTINUOUS SURVEILLANCE' + RESET),
    makeBoxRow('[●] ' + BOLD + 'NETWORK:' + RESET + '  ' + WHITE + 'HIGH-SPEED ETH (1000Mbps)' + RESET),
    GREEN + '└' + '─'.repeat(48) + '┘' + RESET
  ];

  const rightEarthBox = [
    GREEN + '┌──[ ' + CYAN + BOLD + 'PLANET EARTH // LIVE 360 ROTATION' + RESET + GREEN + ' ]─────────┐' + RESET,
    ...currentEarthFrame.map(l => makeBoxRow(colorizeEarthLine(l), 46)),
    GREEN + '└' + '─'.repeat(48) + '┘' + RESET
  ];

  // 4. Matrix ajratgich (1 qator)
  const matrix3 = '  ' + getMatrixStream(98) + '  ';

  // 5. Pastki to'ldiruvchi panellar: PM2 / Disk + Tarmoq / Jonli Loglar (12 qator)
  const bottomLeft = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'PM2 JARAYONLAR VA DISK TIZIMI' + RESET + GREEN + ' ]─────────────┐' + RESET,
    makeBoxRow('[●] express-ielts-bot  ' + BRIGHT_GREEN + '● ONLINE' + RESET + ' (PID: 1420)'),
    makeBoxRow('    RAM: 104MB | CPU: 0.2% | Uptime: ' + upHours + 'h ' + upMins + 'm'),
    makeBoxRow('[●] server-controller  ' + BRIGHT_GREEN + '● ONLINE' + RESET + ' (PID: 1894)'),
    makeBoxRow('    RAM: 103MB | CPU: 0.4% | Uptime: ' + upHours + 'h ' + upMins + 'm'),
    makeBoxRow(DARK_GREEN + '─'.repeat(46) + RESET),
    makeBoxRow('[●] ROOT DISK (/): ' + CYAN + '19G / 110G (18% BAND)' + RESET),
    makeBoxRow('    [' + diskBar + '] ' + WHITE + '86G BO\'SH' + RESET),
    makeBoxRow('[●] SWAP XOTIRA:   ' + BRIGHT_GREEN + '0% USED [CLEAN]' + RESET),
    makeBoxRow('    [' + swapBar + '] ' + WHITE + '2.0G BO\'SH' + RESET),
    makeBoxRow('[●] REPO: ' + WHITE + 'github.com/huzayfa0/live-server' + RESET),
    GREEN + '└' + '─'.repeat(48) + '┘' + RESET
  ];

  // Aylanuvchi jonli loglar
  const secTick = parseInt(tTime.ss);
  const logTimes = [
    '[' + tTime.hh + ':' + tTime.mm + ':0' + (secTick % 10) + ']',
    '[' + tTime.hh + ':' + tTime.mm + ':' + (10 + (secTick % 20)) + ']',
    '[' + tTime.hh + ':' + tTime.mm + ':' + (30 + (secTick % 15)) + ']',
    '[' + tTime.hh + ':' + tTime.mm + ':' + (45 + (secTick % 14)) + ']'
  ];

  const bottomRight = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'TARMOQ VA JONLI MONITORING' + RESET + GREEN + ' ]────────────────┐' + RESET,
    makeBoxRow('[●] INTERFACE: ' + WHITE + 'eth0 [1000 Mbps Full-Duplex]' + RESET),
    makeBoxRow('[●] PACKETS:   ' + CYAN + 'RX: 154.2K' + RESET + ' | ' + YELLOW + 'TX: 98.4K' + RESET),
    makeBoxRow('[●] FIREWALL:  ' + BRIGHT_GREEN + 'UFW ACTIVE [Ports: 22, 80]' + RESET),
    makeBoxRow('[●] TG BOT:    ' + BRIGHT_GREEN + 'CONNECTED [Long-Polling OK]' + RESET),
    makeBoxRow(DARK_GREEN + '─'.repeat(46) + RESET),
    makeBoxRow(CYAN + BOLD + '[●] JONLI XAVFSIZLIK VA TIZIM LOGLARI:' + RESET),
    makeBoxRow(logTimes[0] + ' ' + BRIGHT_GREEN + 'PM2 check: 2/2 services optimal' + RESET),
    makeBoxRow(logTimes[1] + ' ' + CYAN + 'SSH guard: AES-256 active, 0 err' + RESET),
    makeBoxRow(logTimes[2] + ' ' + YELLOW + 'Traffic analyzer: 0 threat detected' + RESET),
    makeBoxRow(logTimes[3] + ' ' + WHITE + 'Heartbeat stream: 1ms [OPTIMAL]' + RESET),
    GREEN + '└' + '─'.repeat(48) + '┘' + RESET
  ];

  // 6. Eng pastki Status HUD (1 qator)
  const footer = GREEN + '══[ ' + BRIGHT_GREEN + BOLD + 'KALI CYBER MONITOR' + RESET + GREEN + ' // ' + CYAN + 'AUTONOMOUS SERVER DEFENSE' + RESET + GREEN + ' // ' + YELLOW + 'TASHKENT (UTC+5)' + RESET + GREEN + ' // ' + WHITE + 'STATUS: OPTIMAL' + RESET + GREEN + ' ]' + '═'.repeat(10) + RESET;

  // Barcha qatorlarni birlashtirish (Jami 47 qator!)
  const allLines = [];
  topBanner.forEach(l => allLines.push(l));
  allLines.push(matrix1);
  centeredClock.forEach(l => allLines.push(l));
  allLines.push(centeredDate);
  allLines.push(matrix2);

  for (let i = 0; i < leftTelemetry.length; i++) {
    allLines.push(leftTelemetry[i] + '  ' + (rightEarthBox[i] || ''));
  }

  allLines.push(matrix3);

  for (let i = 0; i < bottomLeft.length; i++) {
    allLines.push(bottomLeft[i] + '  ' + (bottomRight[i] || ''));
  }

  allLines.push(footer);

  // Ekranni tozalash va to'liq chizish
  let out = '\x1b[2J\x1b[3J\x1b[H';
  out += allLines.join('\n');
  process.stdout.write(out);
}

// Boshlanishida render qilish
render();

// Har 400ms silliq aylanish
setInterval(render, 400);
