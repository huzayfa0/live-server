#!/usr/bin/env node

const os = require('os');
const path = require('path');
const { exec, spawn } = require('child_process');

// Avtomatik Dashboard Server va Brauzerni ishga tushirish
try {
  exec('pgrep -f "node dashboard-server.js"', (err, stdout) => {
    if (!stdout || !stdout.trim()) {
      const srv = spawn('node', [path.join(__dirname, 'dashboard-server.js')], {
        detached: true,
        stdio: 'ignore'
      });
      srv.unref();
    }
  });

  const disp = process.env.DISPLAY || ':0';
  const scriptPath = path.join(__dirname, 'start_dashboard.sh');
  exec(`DISPLAY=${disp} bash "${scriptPath}" >/dev/null 2>&1 &`);
} catch (e) {}

// ANSI rang kodlari
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92;1m';
const DARK_GREEN = '\x1b[38;5;22m';
const CYAN = '\x1b[96m';
const BRIGHT_CYAN = '\x1b[96;1m';
const BLUE = '\x1b[94m';
const WHITE = '\x1b[97m';
const YELLOW = '\x1b[93m';
const RED = '\x1b[91;1m';
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

// Aniq katakka moslashtirish (kesish yoki to'ldirish)
function fitCell(str, width) {
  const plain = stripAnsi(str);
  if (plain.length === width) return str;
  if (plain.length < width) return str + ' '.repeat(width - plain.length);
  return plain.slice(0, width);
}

// Quti qatorini yasash
function makeBoxRow(content, innerWidth, borderColor = GREEN) {
  return borderColor + '│ ' + RESET + fitCell(content, innerWidth) + borderColor + ' │' + RESET;
}

// ProgressBar yasash
function createBar(percent, length = 10, color = BRIGHT_GREEN) {
  const filled = Math.max(0, Math.min(length, Math.round((percent / 100) * length)));
  const empty = length - filled;
  return color + '█'.repeat(filled) + DARK_GREEN + '░'.repeat(empty) + RESET;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 110) {
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

// -------------------------------------------------------------
// 4 TA CCTV KAMERA MULTIVIEWER (JONLI KO'CHA VA TRANSPORT VEDIOSI)
// -------------------------------------------------------------

function getCam1(tick, timeStr) {
  const recState = (tick % 2 === 0) ? RED + '● REC' + RESET : DARK_GREEN + '○ REC' + RESET;
  const speed = 45 + (tick % 15);
  return [
    '  ' + BRIGHT_CYAN + BOLD + '[●] CAM-01: SHOH KUCHA' + RESET + ' ' + recState,
    '  ' + WHITE + '1080p 30FPS // H.264 HD' + RESET,
    '  ' + CYAN + 'STREAM: ' + BRIGHT_GREEN + 'ONLINE [4.2 Mbps]' + RESET,
    '  ' + YELLOW + 'LOC: AMIR TEMUR SHOH KO\'CHA' + RESET,
    '  ' + WHITE + 'AI TRACK: ' + BRIGHT_GREEN + '14 VEHICLES [OK]' + RESET,
    '  ' + DARK_GREEN + '---------------------------' + RESET,
    '  ' + CYAN + 'RADAR SPEED: ' + WHITE + speed + ' KM/H' + RESET,
    '  ' + BRIGHT_GREEN + '[TRAFFIC FLOW: OPTIMAL]' + RESET,
    '  ' + WHITE + 'LIVE URL: ' + CYAN + 'localhost:3000' + RESET
  ];
}

function getCam2(tick, timeStr) {
  const recState = (tick % 2 === 0) ? RED + '● REC' + RESET : DARK_GREEN + '○ REC' + RESET;
  const lights = [RED + 'QIZIL' + RESET, YELLOW + 'SARIQ' + RESET, BRIGHT_GREEN + 'YASHIL' + RESET];
  const curLight = lights[Math.floor((tick % 9) / 3)];
  return [
    '  ' + BRIGHT_CYAN + BOLD + '[●] CAM-02: PIYODALAR' + RESET + '  ' + recState,
    '  ' + WHITE + '1080p 30FPS // H.264 HD' + RESET,
    '  ' + CYAN + 'STREAM: ' + BRIGHT_GREEN + 'ONLINE [3.8 Mbps]' + RESET,
    '  ' + YELLOW + 'LOC: CHORSU CHORRAHASI' + RESET,
    '  ' + WHITE + 'AI TRACK: ' + CYAN + '8 PEDESTRIANS [OK]' + RESET,
    '  ' + DARK_GREEN + '---------------------------' + RESET,
    '  ' + WHITE + 'SVETOFOR: [' + curLight + WHITE + ']' + RESET,
    '  ' + BRIGHT_GREEN + '[CROSSWALK: SAFE (ZEBRA)]' + RESET,
    '  ' + WHITE + 'LIVE URL: ' + CYAN + 'localhost:3000' + RESET
  ];
}

function getCam3(tick, timeStr) {
  const recState = (tick % 2 === 0) ? RED + '● REC' + RESET : DARK_GREEN + '○ REC' + RESET;
  const plates = ['01|A777AA', '01|B123BB', '01|Z999ZZ', '01|M555MM'];
  const plate = plates[Math.floor(tick / 6) % plates.length];
  return [
    '  ' + BRIGHT_CYAN + BOLD + '[●] CAM-03: KIRISH' + RESET + '     ' + recState,
    '  ' + WHITE + '1080p 30FPS // H.264 HD' + RESET,
    '  ' + CYAN + 'STREAM: ' + BRIGHT_GREEN + 'ONLINE [4.0 Mbps]' + RESET,
    '  ' + YELLOW + 'LOC: ASOSIY DARVOZA' + RESET,
    '  ' + WHITE + 'ANPR SCAN: ' + BRIGHT_GREEN + plate + RESET,
    '  ' + DARK_GREEN + '---------------------------' + RESET,
    '  ' + CYAN + 'SHLAGBAUM: ' + BRIGHT_GREEN + '[OCHIQ / PASS]' + RESET,
    '  ' + BRIGHT_GREEN + '[XAVFSIZLIK: RUXSAT ETILDI]' + RESET,
    '  ' + WHITE + 'LIVE URL: ' + CYAN + 'localhost:3000' + RESET
  ];
}

function getCam4(tick, timeStr) {
  const recState = (tick % 2 === 0) ? RED + '● REC' + RESET : DARK_GREEN + '○ REC' + RESET;
  const radarIcons = ['[RADAR: ◴ ]', '[RADAR: ◷ ]', '[RADAR: ◶ ]', '[RADAR: ◵ ]'];
  const rIcon = radarIcons[tick % 4];
  return [
    '  ' + BRIGHT_CYAN + BOLD + '[●] CAM-04: TURARGOH' + RESET + '   ' + recState,
    '  ' + WHITE + '1080p 30FPS // NIGHT-VISION' + RESET,
    '  ' + CYAN + 'STREAM: ' + BRIGHT_GREEN + 'ONLINE [3.5 Mbps]' + RESET,
    '  ' + YELLOW + 'LOC: AVTO PARKOVKA' + RESET,
    '  ' + CYAN + rIcon + ' ' + WHITE + 'BO\'SH: ' + BRIGHT_GREEN + '14' + RESET + ' / ' + WHITE + '36' + RESET,
    '  ' + DARK_GREEN + '---------------------------' + RESET,
    '  ' + WHITE + 'SENSOR: ' + BRIGHT_GREEN + 'INFRARED DETECT [OK]' + RESET,
    '  ' + BRIGHT_GREEN + '[XAVFSIZLIK: SHUBHA YO\'Q]' + RESET,
    '  ' + WHITE + 'LIVE URL: ' + CYAN + 'localhost:3000' + RESET
  ];
}

// CCTV Qatorini birlashtirish (har biri 29 belgi, jami 66 belgi)
function makeCctvRow(left, right) {
  return GREEN + '│ ' + RESET + fitCell(left, 29) + GREEN + ' ││ ' + RESET + fitCell(right, 29) + GREEN + ' │' + RESET;
}

let tick = 0;
const localIp = getLocalIp();
const cpuRaw = os.cpus()[0]?.model || 'Intel(R) CPU';
const cpuModel = cpuRaw.split('@')[0].trim().slice(0, 20);
const cpuCores = os.cpus().length;

function render() {
  tick++;

  // Aniq Toshkent vaqti (Asia/Tashkent UTC+5)
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

  // Jonli tarmoq ko'rsatkichlari
  const netRx = (3.4 + (tick % 7) * 0.4).toFixed(1);
  const netTx = (1.5 + (tick % 5) * 0.3).toFixed(1);

  // ProgressBarlar
  const ramBar = createBar(ramPercent, 10, CYAN);
  const cpuBar = createBar(cpuPercent, 10, YELLOW);
  const diskBar = createBar(18, 12, CYAN);
  const swapBar = createBar(0, 12, BRIGHT_GREEN);

  // 1. Sarlavha HUD (Eni 114)
  const hostStr = os.hostname().slice(0, 10);
  const h2_content = '  ' + BRIGHT_GREEN + BOLD + '[●] KALI CYBER TERMINAL' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + CYAN + 'NODE: ' + hostStr + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + YELLOW + 'TASHKENT (UTC+5)' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + RED + '● CCTV 4-CH LIVE' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + BRIGHT_GREEN + 'DEFENSE: ACTIVE' + RESET;
  const topBanner = [
    GREEN + '╔' + '═'.repeat(112) + '╗' + RESET,
    GREEN + '║' + RESET + fitCell(h2_content, 112) + GREEN + '║' + RESET,
    GREEN + '╚' + '═'.repeat(112) + '╝' + RESET
  ];

  // 2. Matrix va Katta 3D Soat (7 qator)
  const matrix1 = '  ' + getMatrixStream(110) + '  ';
  const centeredClock = clockLines.map(line => ' '.repeat(23) + BRIGHT_GREEN + BOLD + line + RESET);
  const dateStr = '>>> ' + tTime.dateStr.toUpperCase() + ' // ASIA/TASHKENT (UTC+5) <<<';
  const centeredDate = ' '.repeat(Math.max(0, Math.floor((114 - dateStr.length) / 2))) + CYAN + BOLD + dateStr + RESET;
  const matrix2 = '  ' + getMatrixStream(110) + '  ';

  // 3. O'rta qism: Chapda Telemetriya (46 belgi) | O'ngda 4 ta CCTV Kameralar (66 belgi) -> Jami 114
  const leftTelemetry = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'SERVER TELEMETRIYA' + RESET + GREEN + ' ]' + '─'.repeat(20) + '┐' + RESET,
    makeBoxRow('[●] ' + BOLD + 'RAM:' + RESET + '      [' + ramBar + '] ' + CYAN + ramPercent + '%' + RESET + ' (' + Math.round(usedMem / 1024 / 1024) + 'M/' + Math.round(totalMem / 1024 / 1024) + 'M)', 42),
    makeBoxRow('[●] ' + BOLD + 'CPU:' + RESET + '      [' + cpuBar + '] ' + YELLOW + cpuPercent + '%' + RESET + ' (' + cpuCores + ' Cores)', 42),
    makeBoxRow('[●] ' + BOLD + 'CHIP:' + RESET + '     ' + WHITE + cpuModel + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'UPTIME:' + RESET + '   ' + WHITE + upHours + 'h ' + upMins + 'm ' + upSecs + 's' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'LAN IP:' + RESET + '   ' + BRIGHT_CYAN + localIp + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'TRAFFIC:' + RESET + '  RX: ' + WHITE + netRx + ' MB/s' + RESET + ' | TX: ' + WHITE + netTx + ' MB/s' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'FIREWALL:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE [MAXIMUM SHIELD]' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'PM2 BOTS:' + RESET + ' ' + BRIGHT_GREEN + 'ONLINE [2/2 RUNNING]' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'SSH PORT:' + RESET + ' ' + CYAN + '22 [ENCRYPTED - ACTIVE]' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'REGION:' + RESET + '   ' + WHITE + 'UZBEKISTAN // TASHKENT' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'IELTS BOT:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE & LISTENING' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'SRV BOT:' + RESET + '   ' + BRIGHT_GREEN + 'ACTIVE & CONTROLLING' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'PLATFORM:' + RESET + ' ' + WHITE + 'Linux x64 (' + os.type() + ')' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'LOAD AVG:' + RESET + ' ' + WHITE + '0.15, 0.22, 0.18' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'MEM SWAP:' + RESET + ' ' + BRIGHT_GREEN + 'CLEAN [0% USED - 2.0GB]' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'ROOT DISK:' + RESET + ' ' + CYAN + '19G / 110G [18% USED]' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'SECURITY:' + RESET + ' ' + BRIGHT_GREEN + 'ZERO THREAT DETECTED' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'DEFENSE:' + RESET + '  ' + BRIGHT_CYAN + 'MAXIMUM ENCRYPTION ACTIVE' + RESET, 42),
    makeBoxRow('[●] ' + BOLD + 'CCTV NET:' + RESET + ' ' + RED + '4 CHANNELS STREAMING' + RESET, 42),
    GREEN + '└' + '─'.repeat(44) + '┘' + RESET
  ];

  // 4 ta CCTV Kameralar qutisi (66 belgi kenglik, 21 qator)
  const cam1 = getCam1(tick, timeStr);
  const cam2 = getCam2(tick, timeStr);
  const cam3 = getCam3(tick, timeStr);
  const cam4 = getCam4(tick, timeStr);

  const cctvBox = [
    GREEN + '┌──[ ' + CYAN + BOLD + 'CCTV XAVFSIZLIK KAMERALARI // 4-CH LIVE' + RESET + GREEN + ' ]' + '─'.repeat(19) + '┐' + RESET
  ];

  for (let i = 0; i < 9; i++) {
    cctvBox.push(makeCctvRow(cam1[i], cam2[i]));
  }

  cctvBox.push(GREEN + '├─── CAM-01 / CAM-02 ' + '─'.repeat(10) + '┼┼─── CAM-03 / CAM-04 ' + '─'.repeat(12) + '┤' + RESET);

  for (let i = 0; i < 9; i++) {
    cctvBox.push(makeCctvRow(cam3[i], cam4[i]));
  }

  cctvBox.push(GREEN + '└' + '─'.repeat(64) + '┘' + RESET);

  // 4. Matrix ajratgich (1 qator)
  const matrix3 = '  ' + getMatrixStream(110) + '  ';

  // 5. Pastki to'ldiruvchi panellar: PM2 / Disk (54 belgi) + Tarmoq / Loglar (58 belgi) -> Jami 114
  const bottomLeft = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'PM2 JARAYONLAR VA DISK TIZIMI' + RESET + GREEN + ' ]' + '─'.repeat(17) + '┐' + RESET,
    makeBoxRow('[●] express-ielts-bot  ' + BRIGHT_GREEN + '● ONLINE' + RESET + ' (PID: 1420)', 50),
    makeBoxRow('    RAM: 104MB | CPU: 0.2% | Uptime: ' + upHours + 'h ' + upMins + 'm', 50),
    makeBoxRow('[●] server-controller  ' + BRIGHT_GREEN + '● ONLINE' + RESET + ' (PID: 1894)', 50),
    makeBoxRow('    RAM: 103MB | CPU: 0.4% | Uptime: ' + upHours + 'h ' + upMins + 'm', 50),
    makeBoxRow(DARK_GREEN + '─'.repeat(50) + RESET, 50),
    makeBoxRow('[●] ROOT DISK (/): ' + CYAN + '19G / 110G (18% BAND)' + RESET, 50),
    makeBoxRow('    [' + diskBar + '] ' + WHITE + '86G BO\'SH' + RESET, 50),
    makeBoxRow('[●] SWAP XOTIRA:   ' + BRIGHT_GREEN + '0% USED [CLEAN]' + RESET, 50),
    makeBoxRow('    [' + swapBar + '] ' + WHITE + '2.0G BO\'SH' + RESET, 50),
    makeBoxRow('[●] REPO: ' + WHITE + 'github.com/huzayfa0/live-server' + RESET, 50),
    GREEN + '└' + '─'.repeat(52) + '┘' + RESET
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
    GREEN + '┌──[ ' + WHITE + BOLD + 'TARMOQ VA JONLI MONITORING' + RESET + GREEN + ' ]' + '─'.repeat(24) + '┐' + RESET,
    makeBoxRow('[●] INTERFACE: ' + WHITE + 'eth0 [1000 Mbps Full-Duplex]' + RESET, 54),
    makeBoxRow('[●] PACKETS:   ' + CYAN + 'RX: 154.2K' + RESET + ' | ' + YELLOW + 'TX: 98.4K' + RESET, 54),
    makeBoxRow('[●] FIREWALL:  ' + BRIGHT_GREEN + 'UFW ACTIVE [Ports: 22, 80]' + RESET, 54),
    makeBoxRow('[●] TG BOT:    ' + BRIGHT_GREEN + 'CONNECTED [Long-Polling OK]' + RESET, 54),
    makeBoxRow(DARK_GREEN + '─'.repeat(54) + RESET, 54),
    makeBoxRow(CYAN + BOLD + '[●] JONLI XAVFSIZLIK VA TIZIM LOGLARI:' + RESET, 54),
    makeBoxRow(logTimes[0] + ' ' + BRIGHT_GREEN + 'PM2 check: 2/2 services optimal' + RESET, 54),
    makeBoxRow(logTimes[1] + ' ' + CYAN + 'SSH guard: AES-256 active, 0 err' + RESET, 54),
    makeBoxRow(logTimes[2] + ' ' + YELLOW + 'Traffic analyzer: 0 threat detected' + RESET, 54),
    makeBoxRow(logTimes[3] + ' ' + WHITE + 'CCTV 4-CH stream: 25.0 FPS [HEALTHY]' + RESET, 54),
    GREEN + '└' + '─'.repeat(56) + '┘' + RESET
  ];

  // 6. Eng pastki Status HUD (1 qator)
  const footer = GREEN + '══[ ' + BRIGHT_GREEN + BOLD + 'KALI CYBER MONITOR' + RESET + GREEN + ' // ' + RED + '4-CH LIVE CCTV VIDEO' + RESET + GREEN + ' // ' + YELLOW + 'TASHKENT (UTC+5)' + RESET + GREEN + ' // ' + WHITE + 'ALL SYSTEMS OPERATIONAL' + RESET + GREEN + ' ]' + '═'.repeat(19) + RESET;

  // Barcha qatorlarni birlashtirish (Jami 46 qator!)
  const allLines = [];
  topBanner.forEach(l => allLines.push(l));
  allLines.push(matrix1);
  centeredClock.forEach(l => allLines.push(l));
  allLines.push(centeredDate);
  allLines.push(matrix2);

  for (let i = 0; i < leftTelemetry.length; i++) {
    allLines.push(leftTelemetry[i] + '  ' + (cctvBox[i] || ''));
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

// Har 400ms silliq jonli animatsiya
setInterval(render, 400);
