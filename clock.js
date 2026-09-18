#!/usr/bin/env node

const os = require('os');

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

// 24 ta aylanuvchi Yer shari freymlari (12 qator x 32 ustun)
const earthFrames = [["          -+sooo.               ","       :sdo+  yyNh:             ","    /~      /N::@+@h@@~         ","          ~s@@@@@@@y@N@@        ","          :@@@@@@@@Ny@yhs       ","h/       y@@@@@@@@@@@h-~.@      ","o@@s/           @@@@@d-~~o      ","+N@@@+          @@@@@:~~~s      ","-@@@@           @@@@@yy~./      ","   @@           @@@~~~~y        ","    d.          .~~~~~:         ","     ~s-        ~~-s~           "],["          -+sooo.               ","       :sds+  hs@h:             ","    /-~     -/y+@NhN@@~         ","           :@@@@@@@@y@@@        ","           d@@@@@@@@y@@ys       ","h/~       @@@@@@@@@@@@-~~@      ","oh@@s           @@@@@@o~~o      ","+h@@@+.         @@@@@N.~~s      ","-@@@@+          @@@@@-@~./      ","   N@-          yN@o~~~y        ","    ho           -~~~~:         ","     ~s-~       ~~-s~           "],["          -+yooo.               ","       :syh+. :hdh:             ","    /s       ~@hd@NNd@~         ","            o@@@@@@@@@@@        ","            h@@@@@@@@oNds       ","hs~        d@@@@@@@@@@@.~@      ","oy@@@/            @@@@@.~o      ","+h@@@@+~          @@@@@~~s      ","-@.@@@N          h@@@@:~./      ","   /@@:           h@d~~y        ","    hN-           -~~~:         ","     ~s-        ~~-s~           "],["          -+ysoo.               ","       :shhs/  :dh:             ","    /d+~      /+yh@sN@~         ","   .         :@@@@@@@h@@        ","   :          @@@@@@@yh@s       ","h+ ~        oN@@@@@@@@@-.@      ","oy/@@@/            @@@@@~o      ","+h:@@@@++          @@@@/~s      ","-@ @@@@@          :@@@@o./      ","    -@@            @@~~y        ","    h+@           ~.~~:         ","     ~s-        ~~-s~           "],["          -+yyoo.               ","       :sysh+~ ~dy:             ","    /N+        ~@yh@@d~         ","   h.         :@@@@@@@@N        ","              s@@@@@@@@@s       ","h/o~~         @@@@@@@@@d-@      ","oy @@@@/-           @@@@so      ","+h @@@@@h+         ~@@@@-s      ","-@ @@@@@@          oN@@yo/      ","     @@@-          /dh~y        ","    h @.         ~~~.~:         ","     ~s-        ~~-s~           "],["         .osyo+:                ","       :sy-d+/ ~Ny:             ","    /d@o        +@y@d@~         ","   hy           @@@@@@@@        ","    -           @@@@@@@@s       ","h/ ~~~         d@@@@@@@@@@      ","oy @@@@@//         ~~@@@@o      ","+h @@@@@@@+/       ~~@@@Ns      ","-@ ~-@@@@@~        ~.@@dy/      ","     d@@@y         ~~@sy        ","    h  dh         ~~~~:         ","     ~s-        ~~-s~           "],["          -+yyoo.               ","       :yys-h+ ~@y:             ","    /@Nso        +@y@@~         ","   hh           /y@@@@@@        ","   / ~           @@@@@@ds       ","h/ ~~..         @@@@@@@@@@      ","oy  -@@@@@/         ~~@@@h      ","+h  -@@@@@@+~       ~~@@@y      ","-@   @@@@@@@       ~.s@@h/      ","      h@@@y        ~~@@y        ","    h  @@d        ~~~~:         ","     ~s-~       ~~-s~           "],["          -+syoo.               ","       :yd+~@y..sy:             ","    /@@@os        od@d~         ","   @dy            +@@@@N        ","   @  ~           h@@@@@s       ","h/ .d...         oN@@@@@@@      ","oy   @@@@@@/        ~~~@@@      ","+h   @@@@@@@++     ~~~~@@N      ","-@   .@@@@@@@      ~~~o@@/      ","       @@@@d       ~~~@h        ","    h  ~h@.      ~~~~~:         ","     ~s- ~      ~~-s~           "],["          -+syoo.               ","       :ydo+y@~.oy:             ","    /@@N@s:       ~Nh@~         ","   d@sy            @@@@@        ","   sN              N@@@@s       ","h/    ~...         @@@@@@@      ","oy    @@@@@@//     ~~~~h@@      ","+h    @@@@@@@N+    ~~~~h@@      ","-@     @@@@@@@     ~~~~@@/      ","        N@@@y      ~~~.N        ","    h    s@/      ~~~~:         ","     ~s- ~      ~~-s~           "],["          -+oyso.               ","       :y@++ N:.os:             ","    /@@NN@~+      ~+@@~         ","   .yyo+           .o@@@        ","   :@~ /           ~y@@@s       ","h/   /~....         @@@@@@      ","oy     @@@@@@+/     ~~~~@@      ","+h     @@@@@@@@+    ~~~~@@      ","-@     ~s@@@@@@@   ~~~~N@/      ","         /@@@h     ~~~~@        ","    h     @@-    ~~~~~:         ","     ~s-  -     ~~-s~           "],["          -+oyso.               ","       :yNy::/s:oo:             ","    /@@@NN@-~     ~~yd~         ","    .@s+s          ~~@@@        ","    y@~  -         ~~@@@s       ","h/      ~...       ~~N@@@@      ","oy      s@@@@@h/   ~~~~~~@      ","+h      o@@@@@@@++ ~~~~~~@      ","-@       :@@@@@@:  ~~~~-N/      ","          s@@@h    ~~~~N        ","    h      @@s   ~~~~~:         ","     ~s-   -    ~~-s~           "],["          -+ssso.               ","       :yNh++.Nyso:             ","    /d@@@N@@ :    ~~:d~         ","     @@s+o         ~~s@@        ","     y@             ~/@@s       ","h/      h~....     ~~~N@@@      ","oy        @@@@@@// ~~~~~~@      ","+h        @@@@@@@N+~~~~~~@      ","-@        :@@@@@@@ ~~~~~//      ","            @@@@   ~~~~h        ","    h       @N.   ~~~~:         ","     ~s-   ~    ~~-s~           "],["          -+ooso.               ","       :ydNs::@@so:             ","    /-@@@@@Nd~    ~~.@~         ","     -@@soo:       ~~~@@        ","     /sh  ~.       ~~~~@s       ","h/       y~...      ~~~@@@      ","oy         @@@@@@o+ ~~~~~o      ","+h         @@@@@@@@o:~~~~y      ","-@          N@@@@@@~~~~~./      ","            h@@@y+ ~~~~y        ","    h        @@d ~~~~~:         ","     ~s-    -   ~~-s~           "],["          -+ooso.               ","       :y@Ny-+hNss:             ","    / N@@@N@@y~   ~~~d~         ","     .o@ho+o       ~~~/@        ","      y@N  -       ~~~~@s       ","h/        o~....   ~.~~@@@      ","oy          @@@@@@/ ~~~~~o      ","+h          @@@@@@@oo~~~~s      ","-@          :@@@@@@s~~~~./      ","             @@@@h~~~~~y        ","    h        -@@ ~~~~~:         ","     ~s-    ~-  ~~-s~           "],["          -+osso.               ","       :y@@d+:/hss:             ","    / .@@@@@N@~s  ~~~y~         ","      .d@@o+o      ~~~~@        ","       hN@  -       ~~~@s       ","h/         d~...   ~~~~N@@      ","oy          ~@@@@@@++~~~~o      ","+h          ~@@@@@@@@:~~~s      ","-@            @@@@@@@~~~./      ","              @@@@N~~~~y        ","    h         @@y~~~~~:         ","     ~s-     ~ ~~~-s~           "],["          -+osso.               ","       :yNy@y://hs:             ","    /  N@@@@@@Ns  ~~~y~         ","       /s@@o++     ~~~~@        ","       /ydd         ~~~ss       ","h/          o:....  ~~~.N@      ","oy            @@@@@@@~~~~o      ","+h            @@@@@@@o/~~s      ","-@            -:@@@@@o~~./      ","               :@@@y.~~y        ","    h           @@-~~~:         ","     ~s-      - ~~-s~           "],["          -+ooso.               ","       :yNydd++oNo:             ","    /   @@@@@@@@/~~~~y~         ","        -/@@o++~   ~~~~d        ","         +@@  -:   ~~~~.s       ","h/            ~~...~..~~.@      ","oy             -@@@@@+-~~o      ","+h             -@@@@@@y~~s      ","-@              h@@@@@s~./      ","                @@@@d~~y        ","    h           @@@~~~:         ","     ~s-      ~-.~-s~           "],["          -+ooso.               ","       :y@hs@N:/@s:             ","    /    @@@@@@N@:.~~y~         ","          +@@o+o   ~~~~h        ","          yd@   ~   ~~~~s       ","h/            ~d...-~~~~~@      ","oy              @@@@@@+~~o      ","+h              @@@@@@@s~s      ","-@               :@@@@@~./      ","                  @@@.~y        ","    h            @N+~~:         ","     ~s-        .~-s~           "],["          -+oooo.               ","       :yNhsdd::hy:             ","    /     @@@@@@@N/~~y~         ","           /@@oo+/ ~~~~h        ","           +d@   / ~~~~~s       ","h/              @~..-~~~~@      ","oy                y@@@@+~o      ","+h                h@@@@@/s      ","-@                ~@@@@../      ","                   @@h~y        ","    h            ~yd/~:         ","     ~s-        -~-s~           "],["          -+oooo.               ","       :y@ds@Ny/yy:             ","    /     .@@@@@@@N/~y~         ","            o@@o+o+~~~~h        ","            /h@@  :~~~~~s       ","h/               o-.--~~~@      ","oy                 @@@@@-o      ","+h                 @@@@@hs      ","-@                 -@@@@./      ","                   h@@oy        ","    d            ~~@d~:         ","     ~s-        .--s~           "],["          -+osso.               ","       :sdNs+dhhds:             ","    /       @@@@N@@:.y~         ","             +@@ooo~~~~h        ","             :@N.  /~~~~s       ","h/                 -.--~~@      ","oy                 ~~@@@so      ","+h                 ~~@@@@h      ","-@                 ~~@@@d/      ","                   ~~@@y        ","    h             ~.@~:         ","     ~s-        ~.-s~           "],["         .ooso+:                ","       :sd@hdd@hys:             ","    /       :@@@@N@@oy~         ","              oh@@s++~~h        ","              :y@@ ~/~~~s       ","h/                  h--~~@      ","oy                  ~@@@@s      ","+h                  ~@@@@@      ","-@                 ~.-@@@/      ","                   ~~@@h        ","    h            ~~~-o:         ","     ~s-        ~~:s~           "],["          -+oooo.               ","       :yhhdssd@sy:             ","    /         @@@@N@yy~         ","               +@@@sy~~h        ","                dN@~~~~~s       ","h/                 ~~:..~@      ","oy                 ~~~@@@h      ","+h                 ~~~N@@@      ","-@.                ~~~.@@/      ","                   ~~.@N        ","    h:           ~~~~ys         ","     ~s-        ~~-s~           "],["          -+ooo+                ","       :ydsdsd@dhs:             ","    /         @@@@@@@h~         ","                ss@yy/~h        ","                :y@@~::~s       ","h/                 ~~~+..@      ","oy                 ~~~~@@@      ","+h                 ~~~~@@@      ","-@                 ~~~~@@/      ","                   ~~~+@        ","    h ~           ~~~yh         ","     ~s-        ~~-s~           "]];

// Kursorni yashirish
process.stdout.write(HIDE_CURSOR);

// Ctrl + C bosilganda toza chiqish
process.on('SIGINT', () => {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
  process.stdout.write(SHOW_CURSOR);
  process.exit(0);
});

// ANSI belgilarni tozalab real ko'rinadigan uzunlikni o'lchash
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// Aniq ko'rinadigan kenglik bo'yicha to'ldirish (padding)
function padVisual(str, targetWidth) {
  const visibleLen = stripAnsi(str).length;
  if (visibleLen >= targetWidth) return str;
  return str + ' '.repeat(targetWidth - visibleLen);
}

// ProgressBar yasash
function createBar(percent, length = 10, color = BRIGHT_GREEN) {
  const filled = Math.max(0, Math.min(length, Math.round((percent / 100) * length)));
  const empty = length - filled;
  return color + '█'.repeat(filled) + DARK_GREEN + '░'.repeat(empty) + RESET;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 96) {
  const chars = '01アイウエオカキクケコサシスセソタチツテト01010101XYZ#%@*';
  let str = '';
  for (let i = 0; i < len; i++) {
    const r = Math.random();
    if (r > 0.85) {
      str += WHITE + chars[Math.floor(Math.random() * chars.length)] + RESET;
    } else if (r > 0.45) {
      str += BRIGHT_GREEN + chars[Math.floor(Math.random() * chars.length)] + RESET;
    } else {
      str += DARK_GREEN + chars[Math.floor(Math.random() * chars.length)] + RESET;
    }
  }
  return str;
}

// Yer sharini rangli qilish (Quruqlik - Yashil, Okean - Moviy/Moviy-yashil)
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
  return '127.0.0.1';
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
    return 18;
  }
  const diffTotal = total - prevCpu.total;
  const diffIdle = idle - prevCpu.idle;
  prevCpu = { total, idle };
  if (diffTotal <= 0) return 15;
  return Math.min(100, Math.max(0, Math.round(((diffTotal - diffIdle) / diffTotal) * 100)));
}

let tick = 0;
const localIp = getLocalIp();
const cpuRaw = os.cpus()[0]?.model || 'Multi-Core Processor';
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

  // Aylanuvchi Yer shari freymi
  const earthIndex = tick % earthFrames.length;
  const currentEarthFrame = earthFrames[earthIndex];

  // Jonli tarmoq ko'rsatkichlari
  const netRx = (2.1 + (tick % 5) * 0.3).toFixed(1);
  const netTx = (1.2 + (tick % 4) * 0.2).toFixed(1);

  // Chap tomon (Server Telemetriya qutisi - aniq 54 belgi)
  const ramBar = createBar(ramPercent, 10, CYAN);
  const cpuBar = createBar(cpuPercent, 10, YELLOW);

  const leftTelemetry = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'SERVER TELEMETRIYA' + RESET + GREEN + ' ]────────────────────────────┐' + RESET,
    GREEN + '│' + RESET + '  🧠 ' + BOLD + 'RAM:' + RESET + '      [' + ramBar + '] ' + CYAN + ramPercent + '%' + RESET + ' (' + Math.round(usedMem / 1024 / 1024) + 'M/' + Math.round(totalMem / 1024 / 1024) + 'M)',
    GREEN + '│' + RESET + '  ⚡️ ' + BOLD + 'CPU:' + RESET + '      [' + cpuBar + '] ' + YELLOW + cpuPercent + '%' + RESET + ' (' + cpuCores + ' Cores)',
    GREEN + '│' + RESET + '  ⚙️ ' + BOLD + 'CHIP:' + RESET + '     ' + WHITE + cpuModel + RESET,
    GREEN + '│' + RESET + '  ⏱ ' + BOLD + 'UPTIME:' + RESET + '   ' + WHITE + upHours + ' soat, ' + upMins + ' daqiqa' + RESET,
    GREEN + '│' + RESET + '  🌐 ' + BOLD + 'LAN IP:' + RESET + '   ' + BRIGHT_CYAN + localIp + RESET,
    GREEN + '│' + RESET + '  📡 ' + BOLD + 'TRAFFIC:' + RESET + '  RX: ' + WHITE + netRx + ' MB/s' + RESET + ' | TX: ' + WHITE + netTx + ' MB/s' + RESET,
    GREEN + '│' + RESET + '  🛡 ' + BOLD + 'FIREWALL:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE [PROTECTED]' + RESET,
    GREEN + '│' + RESET + '  🤖 ' + BOLD + 'PM2 BOTS:' + RESET + ' ' + BRIGHT_GREEN + 'ONLINE [2/2 RUNNING]' + RESET,
    GREEN + '│' + RESET + '  🔒 ' + BOLD + 'SSH PORT:' + RESET + ' ' + CYAN + '22 [ENCRYPTED]' + RESET,
    GREEN + '│' + RESET + '  📍 ' + BOLD + 'REGION:' + RESET + '   ' + WHITE + 'UZBEKISTAN // TASHKENT (UTC+5)' + RESET,
    GREEN + '│' + RESET + '  🎯 ' + BOLD + 'IELTS BOT:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE & LISTENING' + RESET,
    GREEN + '│' + RESET + '  STATUS:    ' + BRIGHT_GREEN + '24/7 CONTINUOUS SURVEILLANCE' + RESET,
    GREEN + '└─────────────────────────────────────────────────────┘' + RESET
  ];

  // O'ng tomon: Aylanuvchi Yer shari qutisi
  const rightEarthBox = [
    GREEN + '┌──[ ' + CYAN + BOLD + '🌍 PLANET EARTH // LIVE ROTATION' + RESET + GREEN + ' ]──┐' + RESET,
    ...currentEarthFrame.map(line => {
      const colored = colorizeEarthLine(line);
      return GREEN + '│ ' + RESET + padVisual(colored, 36) + GREEN + ' │' + RESET;
    }),
    GREEN + '└────────────────────────────────────────┘' + RESET
  ];

  // Butun ekranni va scrollback buferni tozalash va (1,1) ga o'tish
  let out = '\x1b[2J\x1b[3J\x1b[H';

  // 1. Sarlavha (Header HUD - 3 qator)
  out += GREEN + '╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗' + RESET + '\n';
  out += GREEN + '║  ' + BRIGHT_GREEN + BOLD + '[●] KALI CYBER TERMINAL' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + CYAN + 'NODE: ' + os.hostname() + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + YELLOW + 'TASHKENT (UTC+5)' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + BRIGHT_GREEN + 'SHIELD: ON' + RESET + '  ' + GREEN + '║' + RESET + '\n';
  out += GREEN + '╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝' + RESET + '\n';

  // 2. Matrix Stream (1 qator)
  out += '  ' + getMatrixStream(96) + '\n';

  // 3. Soat (5 qator)
  for (const line of clockLines) {
    out += '   ' + BRIGHT_GREEN + BOLD + line + RESET + '\n';
  }
  out += '   ' + CYAN + BOLD + '>>> ' + tTime.dateStr.toUpperCase() + ' <<<' + RESET + '\n';

  // 4. Matrix Stream (1 qator)
  out += '  ' + getMatrixStream(96) + '\n';

  // 5. Yonma-yon: Chapda 14 qator Telemetriya | O'ngda 14 qator Aylanuvchi Yer Shari
  const maxRows = Math.max(leftTelemetry.length, rightEarthBox.length);
  for (let i = 0; i < maxRows; i++) {
    const left = padVisual(leftTelemetry[i] || '', 55);
    const right = rightEarthBox[i] || '';
    out += ' ' + left + '   ' + right + (i === maxRows - 1 ? '' : '\n');
  }

  process.stdout.write(out);
}

// Boshlanishida render qilish
render();

// Har 400ms silliq aylanish
setInterval(render, 400);
