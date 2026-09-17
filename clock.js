#!/usr/bin/env node

const os = require('os');

// ANSI rang kodlari
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92m';
const DARK_GREEN = '\x1b[38;5;22m';
const CYAN = '\x1b[96m';
const BRIGHT_CYAN = '\x1b[96;1m';
const BLUE = '\x1b[94m';
const WHITE = '\x1b[97m';
const YELLOW = '\x1b[93m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CLEAR = '\x1b[2J\x1b[H';
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

// 24 ta aylanuvchi Yer shari (Earth) freymlari (ascii.live/earth)
const earthFrames = [["          ./sooo/.                ","       ~sdy+  :yyNh~              ","     -@-    :-@@@@@@@N:           ","    h       ~@- ::dNd@@N          ","  /       ~s@@@@@@@@y@N@@         ","+:       o@@@@@@@@@@Ny@@~@        ","h        y@@@@@@@@@@@@h-~.@       ","/N@~       yyy sN@@@@@@h~~s       ","+@@@N+          h@@@@@:~~~s       ","d@@@@/           @@@@@~~~~@       ","o:@@N           /@@@N.@~~s        ","  +@@            @@N~~~~.         ","    d.           .~~~~~y~         ","     :h          ~~~~s/           ","       .s+- ~::/+ys.              "],["          ./syoo/.                ","       ~syh+/  :hdh~              ","     -@d.     ~y@@@@@N:           ","    @~        @@ ~/dsNdN          ","  /          N@@@@@@@N@@@         ","+ -        /@@@@@@@@@@+@Ny        ","h ~        d@@@@@@@@@@@@-~@       ","/~@@o        yyy sN@@@@@@~s       ","+/@@@@++          @@@@@@.~s       ","d:@@@@@.           @@@@y~~@       ","o s@@@/          ~d@@@oN~s        ","  +/@@:           /@@s~~.         ","    hN-            .~~~y~         ","     :h          ~~~~s/           ","       .os-  ~:/+os.              "],["          ./syoo/.                ","       ~shoh+.  N@y~              ","     -@dh-     :y@@@@N:           ","    @s          @/ o+hN@          ","  /o          ~@@@@@@@N@N         ","+:           o@@@@@@@@@:@d        ","h/~~          @@@@@@@@@@N-@       ","/ -@@N.        syy .@@@@@hs       ","+ y@@@@@+/          @@@@@~s       ","d /@@@@@+           ~@@@/~@       ","o  @@@@@s          ~@@@/ds        ","  + /@@@           ~@@o~.         ","    h.@~          ~~.~~y~         ","     :s+         ~~~~s/           ","       .oo/   :/+os.              "],["         .+syoo+.                 ","       ~syydh+. /Ny~              ","     -@dNo~     :hNN@N:           ","    @@s          +@~-syN          ","  /h+           /@@@@@@@@         ","+o- s          s@@@@@@@@o@        ","h o~~.          @@@@@@@@@@@       ","/  :@@@@         shh.y@@@@h       ","+  @@@@@@@+/        ~~@@@Ns       ","d  y@@@@@@N         ~~@@@/@       ","o   .@@@@@.         ~-@@+@        ","  +  d@@@y          ~-@s.         ","    h  @h          ~~.~y~         ","     :s:o        ~~~~s/           ","       .o+o   ./+os.              "],["          ./syyo/.                ","       ~yhs Nh-.:hy~              ","     -NNh@os     ::@NN:           ","    @@@+           @:+sN          ","  /@y.            o@@@@@N         ","+o.              s@@@@@@@@        ","h  d~...         .@@@@@@@@@       ","/    @@@@d         .hh-@@@@       ","+   ~@@@@@@@+/       ~~y@@h       ","d   -@@@@@@@@/      ~~~~@@@       ","o     @@@@@@       ~~~~@@y        ","  +    @@@N:       ~~~-@+         ","    h  ~@@.       ~~~~~y~         ","     :s -d       ~~~~s/           ","       .o+-+  ~-+os.              "],["          ./oyyo/.                ","       ~ydo+ @+~:oy~              ","     -N@Nh@+y     ~oNN:           ","    @@@@N-         ~h.+@          ","  /d@sy             @@@@N         ","+ y s  d           s@@@@@@        ","h    /~...         s@@@@@@@       ","/     :@@@@d-       ~yh~y@@       ","+     @@@@@@@@++    ~~~~~@@       ","d     o@@@@@@@N/    ~~~~/@@       ","o      .@@@@@@h     ~~~~@@        ","  +     N@@@@       ~~~.N         ","    h    sN@       ~~~~y~         ","     :s   h      ~~~~s/           ","       .o+-/:  .+os.              "],["          ./ssys/.                ","       ~y@y+/~N+/os~              ","     -N@@h@@+y     ++N:           ","    h@@@@@:        ~~@:d          ","  /~@ds+-           ~o@@N         ","+  @-~   d          -N@@@@        ","h     @ ...~        ~@@@@@@       ","/       +@@@@@:      ~.hs@@       ","+       @@@@@@@@++   ~~~~s@       ","d       N@@@@@@@@:  ~~~~~o@       ","o        .@@@@@@o  ~.~~~.@        ","  +       @@@@@    ~~~~~o         ","    h     ~@@/    ~~~~~y~         ","     :s    N     ~~~~s/           ","       .o+-~/: ~/os.              "],["          ./ooys/.                ","       ~yN@+/:hN:so~              ","     -y@@@dd@@o.   ~+N:           ","    hh@@@@@@       ~~~dh          ","  / ~@@s+o          ~~s@@         ","+  ~:@ d   d        ~~+@@@        ","h       h~....      ~~~N@@@       ","/         s@@@@N:   ~~~~y.@       ","+         @@@@@@@@++~~~~~~@       ","d        ~o@@@@@@@@.~~~~~~@       ","o          .@@@@@@~ ~~~~~h        ","  +         @@@@h   ~~~~.         ","    h       @@@.   ~~~~y~         ","     :s     N.   ~~~~s/           ","       .o+-~.+~~:os.              "],["          ./osss/.                ","       ~y@dh+::s@os~              ","     -sy@@@@@N@dd  ~~y:           ","    h :@@@@@@@     ~~~~@          ","  /   :N@o+oo       ~~~~@         ","+     /@~-+   @     ~~~.@@        ","h          -~...~   ~~~~N@@       ","/            h@@@@y.~~~~~sy       ","+            @@@@@@@No~~~~s       ","d           :d@@@@@@@/~~~~@       ","o             -@@@@@o~~~~s        ","  +           h@@@@:~~~~.         ","    h         @@@-~~~~~y~         ","     :s       @. ~~~~s/           ","       .o+- ~~/::os.              "],["          ./ooos/.                ","       ~yNh@d+:/@hs~              ","     -s h@@@@oN@@o-~~y:           ","    h  s@@@@@@@y   ~~~~h          ","  /     s@@oooo     ~~~~/         ","+      -.@  -   d   ~~~~.@        ","h            d~....  ~~~~N@       ","/              y@@@@/~~~~~@       ","+              @@@@@@@o/~~s       ","d             -d@@@@@@N.~~@       ","o               -@@@@@.~~s        ","  +             @@@@y~~~.         ","    h           @@@~~~~y~         ","     :s        N.~~~~s/           ","       .o+-~~~:::os.              "],["          ./ooss/.                ","       ~y@ds@N:-sNs~              ","     -s  o@@@@+@@@o.~s:           ","    h    @@@@@@@@. ~~~~h          ","  /      +N@@o++:   ~~~~.         ","+        .o@  d  -/ ~~~~~d        ","h              d~....~~~~~@       ","/                h@@@@:~~~s       ","+                @@@@@@@s~s       ","d               -@@@@@@@.~@       ","o                 y@@@@.~s        ","  +              ~@@@@~~.         ","    h            -@@-~~y~         ","     :s         @o.~~s/           ","       .o+-~ ~./:os.              "],["          ./ooso/.                ","       ~yN@sdNy:hhy~              ","     -s~  h@@@@@@@@o-s:           ","    h     N@@@@@@@N~~~~h          ","  /        /h@@o++  ~~~~.         ","+          .h@. h  ~~~~~~y        ","h                @~..-~~~~@       ","/                  :@@@h~~s       ","+                  @@@@@@/s       ","d                  @@@@@@.@       ","o                  ~@@@N-s        ","  +                .@@h~.         ","    h             ~@d.~y~         ","     :s          -@.~s/           ","       .o+- ~ ~-/ss.              "],["          ./ooos/.                ","       ~s@Nsod@h/hy~              ","     -s    -@@@@@hN@os:           ","    h       @@@@@@@@.~~h          ","  /          +N@hoo/~~~~.         ","+            ..@ :/ ~d~~~y        ","h                  s.---~~@       ","/                   .h@@@~s       ","+                   :@@@@@s       ","d                   -@@@@N@       ","o                  ~.-@@Ns        ","  +                ~~@@d.         ","    d              ~sh.y~         ","     :s          ~~s.s/           ","       .o+- ~~~./ss.              "],["         .+oooo+.                 ","       ~sddhsod@yys~              ","     -s     :d@@@@h@Nh:           ","    h        +@@@@@@@~~h          ","  /            o@@os+-~~.         ","+              .:@ .~~~~~y        ","h                    .--.~@       ","/                    ~/@@hs       ","+                    ~@@@@@       ","d                   ~~s@@@@       ","o                  ~~.~@@N        ","  +                ~~~@@s         ","    h             ~~~hyy~         ","     :s          ~~/ss/           ","       .o+-  ~~./os.              "],["          ./ooso/.                ","       ~yhydyyhdNyy~              ","     -s       d@@@@y@d:           ","    h          @@@@@@@.h          ","  /             -y@@yy.~.         ","+                .h@~d~-~y        ","h                   ~.@...@       ","/                   ~~~~d@h       ","+                   ~~~~@@@       ","d                   ~~~.@@@       ","o                  ~~~~.@@        ","  +                 ~~~@@         ","    h-             ~~~yh~         ","     :s          ~~~/s/           ","       .o+-   ~.:os.              "],["          ./oooo/.                ","       ~y@oy@sd@NNs~              ","     -y~       +@@@@yN:           ","    h           s@@@@@@h          ","  /               +y@hy:.         ","+                  -@+.~-y        ","h                   ~~.~..@       ","/                    ~~~~@@       ","+~                   ~~~~@@       ","d                   ~~~~-@@       ","o.                 ~~~~~-@        ","  +~               ~~~~~N         ","    h ~           ~~~~~N~         ","     :s          ~~~~d/           ","       .o+-   ~~:os.              "],["          ./oooo/.                ","       ~y@h-s@sdNNy~              ","     -d-        -h@@@N:           ","    h              @@@@@          ","  /                 od@h:         ","+                   ~:@~:h        ","h                    ~~~.-@       ","/                   ~~~~~~@       ","+s                  ~~~~~~@       ","d+                  ~~~~~.@       ","o@~                 ~~~~~s        ","  +@.               ~~~~.         ","    h   o          ~~~~h~         ","     :s          ~~~~s/           ","       .oo-    .:os.              "],["          ./oooo/.                ","       ~y@@:.yhydNh~              ","     -N :         s@@N:           ","    d              ~@@@N          ","  /                 ~~@@h         ","+                   ~~-N.y        ","h                   ~~~~..@       ","/~                   ~~~~~y       ","+ s                 ~~~~~~y       ","dys                 ~~~~~~@       ","o@@                ~.~~~~s        ","  +@@              ~~~~~.         ","    ho            ~~~~~y~         ","     :s          ~~~~s/           ","       .so/    ~-os.              "],["          ./oooo/.                ","       ~y@@y:.@y@Ny~              ","     -Nh /        ~h@N:           ","    @~             ~~@@N          ","  /                 ~~~@@         ","+.                  ~~~/dh        ","h                    ~~~~.@       ","/~                  ~~~~~~s       ","+- +~               ~~~~~~s       ","d h-                ~~~~~~@       ","oN@N   ~            ~~~~~s        ","  +@@@o             ~~~~.         ","    h h    y       ~~~~y~         ","     :s   ~      ~~~~s/           ","       .ss/~   ~:os.              "],["          ./oooo/.                ","       ~y@Nyh:+d@Nh~              ","     -N@h -        -hN:           ","    @d             ~~~NN          ","  /y                ~~~~N         ","++~                 ~~~~/N        ","h                   ~~~~~~@       ","//                  ~~~~~~s       ","+-~ d/              ~~~~~~s       ","d  sy               ~~~~~~@       ","o @N@h   ~         ~.~~~~s        ","  +N@@@@           ~~~~~.         ","    h  d    :     ~~~~~y~         ","     :s    .     ~~~~s/           ","       .oy+:   ~:os.              "],["          ./oooo/.                ","       ~y@@@sh:odNy~              ","     -@@@N /       ~/N:           ","    @@@            ~~~.N          ","  /@y               ~~~~/         ","+y-                 ~~~~~y        ","hy                   ~~~~~@       ","/:o~                ~~~~~~s       ","+/-  @++            ~~~~~~s       ","d   y./             ~~~~~~@       ","o ~@@@@    ~        ~.~~~s        ","  +~@@@@@N         ~~~~~.         ","    h  ~d/    s    ~~~~y~         ","     :s     ~~   ~~~~s/           ","       .ssy:-  ~-os.              "],["          ./oooo/.                ","       ~y@@d@ss:NNh~              ","     -NN@@@ /     ~~.d:           ","    @@@@           ~~~~@          ","  /@@+              ~~~~-         ","+Ns ~               ~~~~~y        ","hso                 ~~~~~~@       ","/..@ .              ~.~~~~s       ","+ : :  N+:          ~.~~~~s       ","d     y             ~~~~~~@       ","o  -@@NN@    ~     ~.~~~~s        ","  +  @@@@@@-       ~~~~~.         ","    h    -@       ~~~~~y~         ","     :s       ~  ~~~~s/           ","       .sso/:. ~-os.              "],["          ./oooo/.                ","       ~y@@@N@hssNh~              ","     -N@N@@@       ~~y:           ","    @@@@o:         ~~~~h          ","  /@@@y             ~~~~.         ","+s@@-.              ~~~~~y        ","h d.                 ~~~~~@       ","/ :~:  -             ~~~~~s       ","+  .oo   @+-~       ~~~~~~s       ","d      o+:+         ~~~~~~@       ","o    h@@@@d    .   ~~.~~~s        ","  +  ~@@@@@@@      ~~~~~.         ","    h     .@-    o ~~~~y~         ","     :s        . ~~~~s/           ","       .sh+s/: ~-os.              "],["          ./oooo/.                ","       ~y@@@@@yyydh~              ","     -N@@@@@@/ -   ~~s:           ","    @@@@@dh        ~~~~h          ","  /@@@@@:           ~~~~.         ","+@/@:h .            ~~~~~y        ","h/ N@               ~~~~~~@       ","/  :/:@ .~          ~.~~~~s       ","+   +-~o   @+:~     ~.~~~~s       ","d        ys+/       ~~~~~~@       ","o     ~N@@N@d    . ~.~~~~s        ","  +    o@@@@@@@    ~~~~~.         ","    h   ~   s@~   ~.~~~y~         ","     :s         ~.~~~s/           ","       .shy+s:-~-os.              "]];

// Kursorni yashirish
process.stdout.write(HIDE_CURSOR);

// Ctrl + C bosilganda toza chiqish
process.on('SIGINT', () => {
  process.stdout.write(CLEAR);
  process.stdout.write(SHOW_CURSOR);
  process.exit(0);
});

// ProgressBar yasash
function createBar(percent, length = 15, color = BRIGHT_GREEN) {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return color + '█'.repeat(filled) + DARK_GREEN + '░'.repeat(empty) + RESET;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 92) {
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
const cpuModel = cpuRaw.split('@')[0].trim().slice(0, 26);
const cpuCores = os.cpus().length;

function render() {
  tick++;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  // Har sekundda ikki nuqta miltillashi
  const colon = (tick % 2 === 0) ? ':' : ' ';
  const timeStr = hh + colon + mm + colon + ss;

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

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const dateStr = now.getDate() + '-' + months[now.getMonth()] + ', ' + now.getFullYear() + ' // ' + days[now.getDay()];

  // Aylanuvchi Yer shari freymi (har tick'da aylanadi)
  const earthIndex = tick % earthFrames.length;
  const earthLines = earthFrames[earthIndex];

  // Jonli tarmoq ko'rsatkichlari (simulyatsiya)
  const netRx = (2.4 + (tick % 7) * 0.4).toFixed(1);
  const netTx = (1.1 + (tick % 5) * 0.3).toFixed(1);

  // Chap tomon (Server Telemetriya qatorlari - 15 qator)
  const ramBar = createBar(ramPercent, 14, CYAN);
  const cpuBar = createBar(cpuPercent, 14, YELLOW);

  const leftTelemetry = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'SERVER TELEMETRIYA' + RESET + GREEN + ' ]────────────────────────────┐' + RESET,
    GREEN + '│' + RESET + '  🧠 ' + BOLD + 'RAM:' + RESET + '   [' + ramBar + '] ' + CYAN + ramPercent + '%' + RESET + ' (' + Math.round(usedMem / 1024 / 1024) + 'M/' + Math.round(totalMem / 1024 / 1024) + 'M)',
    GREEN + '│' + RESET + '  ⚡️ ' + BOLD + 'CPU:' + RESET + '   [' + cpuBar + '] ' + YELLOW + cpuPercent + '%' + RESET + ' (' + cpuCores + ' Cores)',
    GREEN + '│' + RESET + '  ⚙️ ' + BOLD + 'CHIP:' + RESET + '  ' + WHITE + cpuModel + RESET,
    GREEN + '│' + RESET + '  ⏱ ' + BOLD + 'UPTIME:' + RESET + ' ' + WHITE + upHours + 's, ' + upMins + 'm, ' + upSecs + 's' + RESET,
    GREEN + '│' + RESET + '  🌐 ' + BOLD + 'LAN IP:' + RESET + ' ' + BRIGHT_CYAN + localIp + RESET,
    GREEN + '│' + RESET + '  📡 ' + BOLD + 'TRAFFIC:' + RESET + ' RX: ' + WHITE + netRx + ' MB/s' + RESET + ' | TX: ' + WHITE + netTx + ' MB/s' + RESET,
    GREEN + '│' + RESET + '  🛡 ' + BOLD + 'FIREWALL:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE [PROTECTED]' + RESET,
    GREEN + '│' + RESET + '  🤖 ' + BOLD + 'PM2 BOTS:' + RESET + ' ' + BRIGHT_GREEN + 'ONLINE [2/2 RUNNING]' + RESET,
    GREEN + '│' + RESET + '  🔒 ' + BOLD + 'SSH PORT:' + RESET + ' ' + CYAN + '22 [ENCRYPTED]' + RESET,
    GREEN + '│' + RESET + '  📍 ' + BOLD + 'LOCATION:' + RESET + ' ' + WHITE + 'UZBEKISTAN // TASHKENT' + RESET,
    GREEN + '│' + RESET + '  💾 ' + BOLD + 'OS KERNEL:' + RESET + ' ' + WHITE + os.type() + ' ' + os.arch() + RESET,
    GREEN + '│' + RESET + '  ⚡️ ' + BOLD + 'SECURITY:' + RESET + ' ' + BRIGHT_GREEN + 'ZERO THREAT DETECTED' + RESET,
    GREEN + '│' + RESET + '  🎯 ' + BOLD + 'IELTS BOT:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE & LISTENING' + RESET,
    GREEN + '└─────────────────────────────────────────────────────┘' + RESET
  ];

  let out = CLEAR;

  // 1. Sarlavha (Header HUD)
  out += GREEN + '╔══════════════════════════════════════════════════════════════════════════════════════════════╗' + RESET + '\n';
  out += GREEN + '║  ' + BRIGHT_GREEN + BOLD + '[●] KALI CYBER TERMINAL' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + CYAN + 'NODE: ' + os.hostname() + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + YELLOW + 'SYSTEM: 24/7 ONLINE' + RESET + '  ' + GREEN + '║' + RESET + '\n';
  out += GREEN + '╚══════════════════════════════════════════════════════════════════════════════════════════════╝' + RESET + '\n\n';

  // 2. Matrix Stream 1
  out += '  ' + getMatrixStream(88) + '\n\n';

  // 3. Soat (Katta yashil raqamlar)
  for (const line of clockLines) {
    out += '   ' + BRIGHT_GREEN + BOLD + line + RESET + '\n';
  }
  out += '\n   ' + CYAN + BOLD + '>>> ' + dateStr.toUpperCase() + ' <<<' + RESET + '\n\n';

  // 4. Matrix Stream 2
  out += '  ' + getMatrixStream(88) + '\n\n';

  // 5. Yonma-yon: Chapda boyitilgan Telemetriya | O'ngda Aylanuvchi Yer shari (Earth)
  for (let i = 0; i < 15; i++) {
    const leftPart = leftTelemetry[i] || ' '.repeat(55);
    const earthPart = earthLines[i] || '';
    out += ' ' + leftPart + '  ' + BRIGHT_CYAN + earthPart + RESET + '\n';
  }
  out += ' '.repeat(58) + CYAN + BOLD + '[ 🌍 PLANET EARTH // ORBIT 24/7 ]' + RESET + '\n';

  process.stdout.write(out);
}

// Boshlanishida render qilish
render();

// Har 500ms (yarim sekundda) silliq aylanish
setInterval(render, 500);
