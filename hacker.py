#!/usr/bin/env python3
"""
███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝
██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗
██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
TTY Hacker Dashboard - No X11 needed!
"""

import curses
import random
import time
import os
import subprocess
import threading

# Kanji/Matrix symbols + hacker chars
MATRIX_CHARS = (
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?"
    "アイウエオカキクケコサシスセソタチツテトナニヌネノ"
    "ハヒフヘホマミムメモヤユヨラリルレロワヲン"
    "αβγδεζηθικλμνξοπρστυφχψω"
    "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
)

# Hacker status messages
HACK_MESSAGES = [
    "BYPASSING FIREWALL..................",
    "ACCESSING MAINFRAME.................",
    "DECRYPTING SSH KEYS.................",
    "SCANNING NETWORK PORTS..............",
    "INJECTING PAYLOAD...................",
    "EXPLOITING CVE-2024-1337............",
    "ROOT ACCESS GRANTED.................",
    "EXTRACTING DATABASE.................",
    "ROUTING THROUGH TOR.................",
    "SPOOFING MAC ADDRESS................",
    "CRACKING WPA2 HANDSHAKE.............",
    "DUMPING MEMORY.....................",
    "PIVOTING TO INTERNAL NETWORK.......",
    "COVERING TRACKS.....................",
    "UPLOADING BACKDOOR..................",
    "PRIVILEGE ESCALATION...............",
    "DISABLING ANTIVIRUS................",
    "INTERCEPTING PACKETS...............",
    "BRUTE FORCING SSH..................",
    "ESTABLISHING REVERSE SHELL.........",
]

IP_LIST = [
    "192.168.0.{}", "10.0.0.{}", "172.16.0.{}",
    "185.220.{}.{}", "45.33.{}.{}", "198.51.{}.{}"
]

def get_sys_info():
    """Get real system info"""
    info = {}
    try:
        uptime = subprocess.check_output(['uptime', '-p'], stderr=subprocess.DEVNULL).decode().strip()
        info['uptime'] = uptime
    except:
        info['uptime'] = "up 3 hours"
    try:
        cpu = subprocess.check_output(
            "top -bn1 | grep 'Cpu(s)' | awk '{print $2}'",
            shell=True, stderr=subprocess.DEVNULL
        ).decode().strip()
        info['cpu'] = cpu + "%"
    except:
        info['cpu'] = str(random.randint(20, 80)) + "%"
    try:
        mem = subprocess.check_output(
            "free | grep Mem | awk '{printf \"%.0f%%\", $3/$2 * 100.0}'",
            shell=True, stderr=subprocess.DEVNULL
        ).decode().strip()
        info['mem'] = mem
    except:
        info['mem'] = str(random.randint(30, 70)) + "%"
    try:
        ip = subprocess.check_output(
            "hostname -I | awk '{print $1}'",
            shell=True, stderr=subprocess.DEVNULL
        ).decode().strip()
        info['ip'] = ip
    except:
        info['ip'] = "192.168.0.71"
    try:
        user = os.environ.get('USER', 'huzayfa')
        info['user'] = user
    except:
        info['user'] = 'huzayfa'
    return info

class MatrixRain:
    def __init__(self, stdscr):
        self.scr = stdscr
        self.height, self.width = stdscr.getmaxyx()
        self.columns = []
        self.init_colors()
        self.init_columns()
        self.hack_messages = []
        self.msg_timer = 0
        self.sys_info = get_sys_info()
        self.sys_timer = 0
        self.scan_log = []
        self.packet_count = random.randint(10000, 50000)
        self.bytes_stolen = random.randint(1, 99)
        
    def init_colors(self):
        curses.start_color()
        curses.use_default_colors()
        curses.init_pair(1, curses.COLOR_GREEN, -1)       # Bright green
        curses.init_pair(2, curses.COLOR_WHITE, -1)        # White (head char)
        curses.init_pair(3, curses.COLOR_CYAN, -1)         # Cyan (panel)
        curses.init_pair(4, curses.COLOR_RED, -1)          # Red (alert)
        curses.init_pair(5, curses.COLOR_YELLOW, -1)       # Yellow (warning)
        curses.init_pair(6, curses.COLOR_GREEN, curses.COLOR_BLACK)  # Green on black
        curses.init_pair(7, curses.COLOR_BLACK, curses.COLOR_GREEN)  # Reverse (highlight)
        curses.init_pair(8, curses.COLOR_MAGENTA, -1)      # Magenta

    def init_columns(self):
        # Matrix rain columns — only in left 2/3 of screen
        rain_width = int(self.width * 0.62)
        self.columns = []
        for x in range(0, rain_width, 2):
            self.columns.append({
                'x': x,
                'y': random.randint(-self.height, 0),
                'speed': random.uniform(0.3, 1.2),
                'length': random.randint(5, 25),
                'chars': [random.choice(MATRIX_CHARS) for _ in range(30)],
                'last_update': 0,
                'bright_pos': 0,
            })

    def draw_matrix_rain(self, now):
        rain_width = int(self.width * 0.62)
        for col in self.columns:
            if now - col['last_update'] < col['speed'] * 0.1:
                continue
            col['last_update'] = now

            # Move column down
            col['y'] += 1
            col['bright_pos'] = col['y']

            # Draw trail
            for i in range(col['length']):
                y = col['y'] - i
                if 0 <= y < self.height - 1:
                    char = random.choice(MATRIX_CHARS) if random.random() < 0.1 else col['chars'][i % len(col['chars'])]
                    try:
                        if i == 0:
                            # Head — bright white
                            self.scr.addstr(y, col['x'], char, curses.color_pair(2) | curses.A_BOLD)
                        elif i < 3:
                            # Near head — bright green bold
                            self.scr.addstr(y, col['x'], char, curses.color_pair(1) | curses.A_BOLD)
                        elif i < col['length'] // 2:
                            # Middle — normal green
                            self.scr.addstr(y, col['x'], char, curses.color_pair(1))
                        else:
                            # Tail — dim green
                            self.scr.addstr(y, col['x'], char, curses.color_pair(6))
                    except curses.error:
                        pass

            # Erase tail
            erase_y = col['y'] - col['length']
            if 0 <= erase_y < self.height - 1:
                try:
                    self.scr.addstr(erase_y, col['x'], ' ')
                except curses.error:
                    pass

            # Reset column when it goes off screen
            if col['y'] - col['length'] > self.height:
                col['y'] = random.randint(-self.height, -5)
                col['speed'] = random.uniform(0.3, 1.2)
                col['length'] = random.randint(5, 25)
                col['chars'] = [random.choice(MATRIX_CHARS) for _ in range(30)]

    def draw_panel(self, now):
        """Right panel — hacker dashboard"""
        panel_x = int(self.width * 0.64)
        panel_w = self.width - panel_x - 1
        h = self.height

        # Panel border
        border = '│'
        try:
            for y in range(0, h - 1):
                self.scr.addstr(y, panel_x - 1, border, curses.color_pair(3) | curses.A_BOLD)
        except curses.error:
            pass

        def safe_addstr(y, x, text, attr=0):
            try:
                if y < h - 1 and x < self.width - 1:
                    max_len = self.width - x - 1
                    self.scr.addstr(y, x, text[:max_len], attr)
            except curses.error:
                pass

        # === HEADER ===
        row = 0
        safe_addstr(row, panel_x, "╔" + "═" * (panel_w - 1), curses.color_pair(3) | curses.A_BOLD)
        row += 1
        title = " ██╗  ██╗ █████╗  ██████╗██╗  ██╗"
        safe_addstr(row, panel_x, title[:panel_w], curses.color_pair(1) | curses.A_BOLD)
        row += 1
        title2 = " ██║  ██║██╔══██╗██╔════╝██║ ██╔╝"
        safe_addstr(row, panel_x, title2[:panel_w], curses.color_pair(1) | curses.A_BOLD)
        row += 1
        title3 = " ███████║███████║██║     █████╔╝ "
        safe_addstr(row, panel_x, title3[:panel_w], curses.color_pair(2) | curses.A_BOLD)
        row += 1
        title4 = " ██╔══██║██╔══██║██║     ██╔═██╗ "
        safe_addstr(row, panel_x, title4[:panel_w], curses.color_pair(1) | curses.A_BOLD)
        row += 1
        title5 = " ██║  ██║██║  ██║╚██████╗██║  ██╗"
        safe_addstr(row, panel_x, title5[:panel_w], curses.color_pair(1) | curses.A_BOLD)
        row += 1
        safe_addstr(row, panel_x, "╠" + "═" * (panel_w - 1), curses.color_pair(3) | curses.A_BOLD)
        row += 1

        # === TIME ===
        t = time.strftime("%H:%M:%S")
        d = time.strftime("%Y-%m-%d")
        safe_addstr(row, panel_x, f" 🕐 {d}  {t}", curses.color_pair(2) | curses.A_BOLD)
        row += 1

        # === SYSTEM INFO ===
        safe_addstr(row, panel_x, "├── SYSTEM INFO ──────────────", curses.color_pair(3))
        row += 1
        if now - self.sys_timer > 3:
            self.sys_info = get_sys_info()
            self.sys_timer = now
        safe_addstr(row, panel_x, f" USER : {self.sys_info.get('user','huzayfa')}@kali", curses.color_pair(1))
        row += 1
        safe_addstr(row, panel_x, f" IP   : {self.sys_info.get('ip','192.168.0.71')}", curses.color_pair(5))
        row += 1
        safe_addstr(row, panel_x, f" CPU  : {self.sys_info.get('cpu','??%')}", curses.color_pair(4) | curses.A_BOLD)
        row += 1
        safe_addstr(row, panel_x, f" MEM  : {self.sys_info.get('mem','??%')}", curses.color_pair(4) | curses.A_BOLD)
        row += 1
        safe_addstr(row, panel_x, f" UP   : {self.sys_info.get('uptime','??')}", curses.color_pair(1))
        row += 1

        # === NETWORK SCAN ===
        safe_addstr(row, panel_x, "├── NETWORK SCAN ────────────", curses.color_pair(3))
        row += 1

        # Live packet counter
        self.packet_count += random.randint(10, 200)
        self.bytes_stolen += random.uniform(0.01, 0.5)
        safe_addstr(row, panel_x, f" PKT  : {self.packet_count:,}", curses.color_pair(1))
        row += 1
        safe_addstr(row, panel_x, f" DATA : {self.bytes_stolen:.2f} GB", curses.color_pair(5) | curses.A_BOLD)
        row += 1

        # Random IP being "scanned"
        ip_template = random.choice(IP_LIST)
        if ip_template.count('{}') == 2:
            fake_ip = ip_template.format(random.randint(1, 254), random.randint(1, 254))
        else:
            fake_ip = ip_template.format(random.randint(1, 254))
        safe_addstr(row, panel_x, f" SCAN : {fake_ip}", curses.color_pair(8))
        row += 1

        # Port status
        port = random.choice([22, 80, 443, 3306, 8080, 21, 25, 3389])
        status = random.choice(["OPEN ✓", "CLOSED", "FILTERED"])
        color = curses.color_pair(4) if "OPEN" in status else curses.color_pair(1)
        safe_addstr(row, panel_x, f" PORT : {port} [{status}]", color)
        row += 1

        # === HACK STATUS ===
        safe_addstr(row, panel_x, "├── OPERATION STATUS ────────", curses.color_pair(3))
        row += 1

        # Scroll hack messages
        if now - self.msg_timer > 1.5:
            msg = random.choice(HACK_MESSAGES)
            progress = random.randint(60, 100)
            self.hack_messages.append((msg, progress))
            if len(self.hack_messages) > 6:
                self.hack_messages.pop(0)
            self.msg_timer = now

        for i, (msg, prog) in enumerate(self.hack_messages[-6:]):
            if row >= h - 2:
                break
            if i == len(self.hack_messages[-6:]) - 1:
                color = curses.color_pair(4) | curses.A_BOLD
                status_char = "▶"
            else:
                color = curses.color_pair(1)
                status_char = "✓"
            line = f" {status_char} {msg[:panel_w-5]}"
            safe_addstr(row, panel_x, line, color)
            row += 1

        # === PROGRESS BAR ===
        if row < h - 3:
            safe_addstr(row, panel_x, "├── INFILTRATION ───────────", curses.color_pair(3))
            row += 1
            bar_w = panel_w - 4
            fill = int(bar_w * (now % 60) / 60)
            bar = "█" * fill + "░" * (bar_w - fill)
            pct = int((now % 60) / 60 * 100)
            safe_addstr(row, panel_x, f" [{bar[:bar_w]}] {pct}%", curses.color_pair(4) | curses.A_BOLD)
            row += 1

        # === BOTTOM ALERT ===
        if row < h - 2:
            blink = int(now * 2) % 2
            alert_text = " ⚠ SYSTEM COMPROMISED - ROOT ACCESS ACTIVE ⚠ "
            attr = (curses.color_pair(4) | curses.A_BOLD) if blink else curses.color_pair(5)
            safe_addstr(row, panel_x, alert_text[:panel_w], attr)
            row += 1

        # Bottom border
        try:
            safe_addstr(h - 1, panel_x - 1, "└" + "─" * panel_w, curses.color_pair(3))
        except curses.error:
            pass

    def draw_bottom_bar(self):
        """Bottom status bar"""
        h, w = self.height, self.width
        try:
            t = time.strftime("%H:%M:%S  %d/%m/%Y")
            bar = f" [KALI LINUX] | huzayfa@kali | {t} | PRESS Q TO EXIT "
            self.scr.addstr(h - 1, 0, bar[:int(w * 0.62)], curses.color_pair(7) | curses.A_BOLD)
        except curses.error:
            pass

    def run(self):
        curses.curs_set(0)
        self.scr.nodelay(True)
        self.scr.timeout(50)

        while True:
            now = time.time()

            try:
                key = self.scr.getch()
                if key in (ord('q'), ord('Q'), 27):
                    break
            except:
                pass

            try:
                # Resize check
                new_h, new_w = self.scr.getmaxyx()
                if new_h != self.height or new_w != self.width:
                    self.height, self.width = new_h, new_w
                    self.init_columns()
                    self.scr.clear()

                self.draw_matrix_rain(now)
                self.draw_panel(now)
                self.draw_bottom_bar()
                self.scr.refresh()
            except curses.error:
                pass

            time.sleep(0.05)


def main(stdscr):
    rain = MatrixRain(stdscr)
    rain.run()


if __name__ == '__main__':
    try:
        curses.wrapper(main)
    except KeyboardInterrupt:
        pass
    finally:
        print("\033[0m\033[2J\033[H")
        print("Matrix session ended.")
