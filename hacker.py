#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KALI CYBER TERMINAL v4.0
  - Rotating Earth Globe (pre-rendered frames)
  - 4-CH CCTV AI Detection Simulation
  - Live Clock (HH:MM:SS) + Date + Kun + Yil
  - Server Telemetry (real CPU/RAM/IP/Disk)
  - No X11 / DISPLAY needed — pure TTY curses
Press Q or ESC to exit
"""

import curses, random, time, math, subprocess, os, json, sys

# ─────────────────────────────────────────────────────────────
#  LOCALIZATION
# ─────────────────────────────────────────────────────────────
DAYS_UZ   = ['DUSHANBA','SESHANBA','CHORSHANBA','PAYSHANBA',
              'JUMA','SHANBA','YAKSHANBA']
MONTHS_UZ = ['YANVAR','FEVRAL','MART','APREL','MAY','IYUN',
              'IYUL','AVGUST','SENTABR','OKTYABR','NOYABR','DEKABR']

# ─────────────────────────────────────────────────────────────
#  LARGE DIGITS  (5 rows × 5 cols each)
# ─────────────────────────────────────────────────────────────
DIGITS = {
    '0':["▓▓▓▓▓","▓   ▓","▓   ▓","▓   ▓","▓▓▓▓▓"],
    '1':["  ▓  ","  ▓  ","  ▓  ","  ▓  ","  ▓  "],
    '2':["▓▓▓▓▓","    ▓","▓▓▓▓▓","▓    ","▓▓▓▓▓"],
    '3':["▓▓▓▓▓","    ▓","▓▓▓▓▓","    ▓","▓▓▓▓▓"],
    '4':["▓   ▓","▓   ▓","▓▓▓▓▓","    ▓","    ▓"],
    '5':["▓▓▓▓▓","▓    ","▓▓▓▓▓","    ▓","▓▓▓▓▓"],
    '6':["▓▓▓▓▓","▓    ","▓▓▓▓▓","▓   ▓","▓▓▓▓▓"],
    '7':["▓▓▓▓▓","    ▓","    ▓","    ▓","    ▓"],
    '8':["▓▓▓▓▓","▓   ▓","▓▓▓▓▓","▓   ▓","▓▓▓▓▓"],
    '9':["▓▓▓▓▓","▓   ▓","▓▓▓▓▓","    ▓","▓▓▓▓▓"],
    ':':["     ","  ▓  ","     ","  ▓  ","     "],
}

# ─────────────────────────────────────────────────────────────
#  MATRIX CHARS
# ─────────────────────────────────────────────────────────────
MCHARS = (
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ"
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"
)

# ─────────────────────────────────────────────────────────────
#  EARTH FRAMES — inline compact set (20 frames, 20 rows each)
# ─────────────────────────────────────────────────────────────
EARTH_FRAMES = [
    # Frame 0
    [
        "              -+osoooo/.                    ",
        "          :sdho+   :yyyNh:~                 ",
        "       :so~.    .o~@h/@@@@@s                ",
        "     /h~        //Ny::@@+@dh@@@~            ",
        "     ho          @@-  ::dsNd@o@@+           ",
        "   h           ~s@@@@@@@@@@@y@@N@@@         ",
        "   y           :@@@@@@@@@@@@Ny@@ydhs        ",
        "-@~         y@@@@@@@@@@@@@@@N-d@-~o:        ",
        "h/          y@@@@@@@@@@@@@@@@@h-~~.@        ",
        "/d@@~          yyy   y@@@@@@@@@h~~~s        ",
        "o@@@s/                @@@@@@@@d-~~~o        ",
        "+N@@@@o+              @@@@@@@@:~~~~s        ",
        "dh@@@@N~               @@@@@@/~~~~~@        ",
        "-@@@@@@               h@@@@@@.yy~~./        ",
        "   y@@@~               @@@@N+~+~~~y         ",
        "   h@@N               o@@@d~~~~~.y          ",
        "     dd.               .~~~~~~~:o           ",
        "     ~@:                ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /s+:~ ~-:://+ys/.                 ",
    ],
    # Frame 1
    [
        "              -+osoooo/.                    ",
        "          :sdhs+.  .hsy@h:~                 ",
        "       :sy~.~    + @@.@@@@@s                ",
        "     /d-~        -/Ny+N@Nh@N@@@~            ",
        "     ds           @s  ~:ossd@h@@+           ",
        "   d           :@@@@@@@@@@@@y@@@@@          ",
        "   h           d@@@@@@@@@@@@yo@@@ys         ",
        "-@~          ~@@@@@@@@@@@@@@@@:@d~-:        ",
        "h/~          .@@@@@@@@@@@@@@@@@-.~~@        ",
        "/h@@+~          yyyo ~h@@@@@@@@@/~~s        ",
        "oh@@@s/               ~@@@@@@@@o~~~o        ",
        "+h@@@@@+.             ~@@@@@@@N.~~~s        ",
        "do@@@@@+               :@@@@@@o~~~~@        ",
        "-@@@@@@+              :@@@@@@@-@~~./        ",
        "   y@@@d               ~@@@@d~s/~~y         ",
        "   hN@@-               yN@No~~~~.y          ",
        "     hyo                -~~~~~~:o           ",
        "     ~h+                ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /so:~ ~~:///+ss/.                 ",
    ],
    # Frame 2
    [
        "              -+oyoooo/.                    ",
        "          :sydh+/.  :hhdh:~                 ",
        "       :oN. ~     o /N-@@@@s                ",
        "     /Ns .        ~/@hsd@NoNdN@~            ",
        "     @d~           @@/ ~/+dsh@hN+           ",
        "   @             o@@@@@@@@@@@y@@@@          ",
        "   y             h@@@@@@@@@@@hoNdds         ",
        "-@             @@@@@@@@@@@@@@@@/@:.:        ",
        "hs~~           d@@@@@@@@@@@@@@@@-.~@        ",
        "/hd@@@.           yyy~ sh@@@@@@@@y~s        ",
        "oy@@@@h/                 @@@@@@@o.~o        ",
        "+h@@@@@@++~              @@@@@@@.~~s        ",
        "d/@@@@@@@/               @@@@@@y~~~@        ",
        "-@.@@@@@N~              h@@@@@@:@~./        ",
        "   y+@@@N                @@@@@~..~y         ",
        "   h/@@@:                h@@d~~~.y          ",
        "     h:N-                -.~~~~:o           ",
        "     ~yd                ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /os/~  ~-://+os/.                 ",
    ],
    # Frame 3
    [
        "              -+oysooo/.                    ",
        "          :shohs+/   :ddh:~                 ",
        "       :o@:  .     o/shs@@@s                ",
        "     /Nd+ ~         /+@yh@@sN@@~            ",
        "     @@+            o@d  ++dsd@d+           ",
        "   @.             :o@@@@@@@@@@h@N@          ",
        "   y:              @@@@@@@@@@@yh@@s         ",
        "-@               y@@@@@@@@@@@@@N/@/:        ",
        "h+ ~~            oN@@@@@@@@@@@@@@-.@        ",
        "/h~@@@@:            yyy  oN@@@@@@@/s        ",
        "oy/@@@@@/-                h@@@@@@@~o        ",
        "+h:@@@@@@h++              d@@@@@@/~s        ",
        "d/-@@@@@@@d.               @@@@@o~~@        ",
        "-@ s@@@@@@@              :h@@@@@:o./        ",
        "   y N@@@@~                @@@ds:~y         ",
        "   h -@@@o                s@@d~~.y          ",
        "     h:+@~               ~~.~~~:o           ",
        "     ~y:y               ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /oys.   ~://+os/.                 ",
    ],
    # Frame 4
    [
        "              -+oyyooo/.                    ",
        "          :syhsh++~  ~ddy:~                 ",
        "       :ssh~ ~~     /:do+@@s                ",
        "     /@N+o           ~+@yh@@@@d~            ",
        "     @@@.             @@~ .+ddN@+           ",
        "   @h.              :@@@@@@@@@@@@N          ",
        "   d                s@@@@@@@@@@@h@s         ",
        "-@. ~~             @@@@@@@@@@@@@NdN:        ",
        "h/o~~~~            d@@@@@@@@@@@@@d-@        ",
        "/h :@@@@+            .yhh ~hN@@@@@Ns        ",
        "oy N@@@@@//-                @@@@@@so        ",
        "+h @@@@@@@@h+.             ~@@@@@@-s        ",
        "d/ o@@@@@@@@/-             ~y@@@@.~@        ",
        "-@  @@@@@@@@              ~oN@@@@yo/        ",
        "   y  o@@@@N~             ~~@@@@:/y         ",
        "   h  s@@@@-              ~/d@h~.y          ",
        "     h: @d.             ~~~~.~~:o           ",
        "     ~y @:              ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /o+s-   ~://+os/.                 ",
    ],
    # Frame 5
    [
        "            ./osyyoo+:.                     ",
        "          :sys-dh+/. ~/Ny:~                 ",
        "       :ssys~ ~      +:@y@@s                ",
        "     /@d@ho            +@yo@d@@~            ",
        "     @@@s              +@-~-ohd@+           ",
        "   Nhy                s@@@@@@@@@@@          ",
        "   @ -.               o@@@@@@@@@h@s         ",
        "-@y   ~             ~@@@@@@@@@@@@dd:        ",
        "h/ -~~.~             d@@@@@@@@@@@@@@        ",
        "/h  :@@@@@/            shhs..d@@@@@h        ",
        "oy  @@@@@@@//              ~~-@@@@@o        ",
        "+h  @@@@@@@@@++/           ~~-@@@@Ns        ",
        "d/  y@@@@@@@@@/            ~~-@@@@/@        ",
        "-@  ~-@@@@@@@@~            ~.@@@@dy/        ",
        "   y   y@@@@@.            ~~~y@@@.y         ",
        "   h   d@@@@y             ~~~d@s.y          ",
        "     h:  @dh             ~~~~~~:o           ",
        "     ~y  @d             ~~~~~~y~            ",
        "       ~ss-           ~~~-+s~               ",
        "          /o+/s    .//+os/.                 ",
    ],
    # Frame 6
    [
        "              -+oyyyoo/.                    ",
        "          :yyss-@h+~ ~:@y:~                 ",
        "       :s@:dh  ~      +ohs@s                ",
        "     /@@N@so ~          +@dy@@@~            ",
        "     @@@@+              .@@~:ss@+           ",
        "   Nhhh                /y@@@@@@@N@          ",
        "   @/  ~                @@@@@@@@@ds         ",
        "-@/:   ~               @@@@@@@@@@@h:        ",
        "h/ ~~~...~             @@@@@@@@@@@@@        ",
        "/h   ~@@@@@@:            ohho-h@@@@N        ",
        "oy   -@@@@@@@//             ~~~@@@@h        ",
        "+h   -@@@@@@@@@++~          ~~~@@@@y        ",
        "d/   :@@@@@@@@@@/~         ~~~~@@@@@        ",
        "-@    -@@@@@@@@@           ~.~s@@@h/        ",
        "   y    o@@@@@@.           ~~~s@@oy         ",
        "   h    h@@@@dy           ~~~~@@-y          ",
        "     h:  ~@@d~           ~~~~~~:o           ",
        "     ~y  .@h            ~~~~~~y~            ",
        "       ~ss-~          ~~~-+s~               ",
        "          /o+:o.   ~:/+os/.                 ",
    ],
    # Frame 7
    [
        "              -+osyyoo/.                    ",
        "          :yds+~d@y/..:sy:~                 ",
        "       :s@/+@s~ ~      ssdds                ",
        "     /@@@N@os.           o@d@@d~            ",
        "     @@@@@/-             ~dN~syh+           ",
        "   d@dsy                 +@@@@@@@N          ",
        "   d@   ~                h@@@@@@@@s         ",
        "-@ y.~  ~               d@@@@@@@@@N:        ",
        "h/  .d~....             oN@@@@@@@@@@        ",
        "/h     o@@@@@s:            hhh.y@@@@        ",
        "oy     @@@@@@@@//           ~~~~@@@@        ",
        "+h     @@@@@@@@@@++-       ~~~~~@@@N        ",
        "d/    -N@@@@@@@@@@/        ~~~~~N@@@        ",
        "-@     .@@@@@@@@@@        ~~~~~o@@@/        ",
        "   y     .@@@@@@@.        ~~~~~.@@y         ",
        "   h     o@@@@@d          ~~~~~@sh          ",
        "     h:   ~h@@.         ~~~~~~~:o           ",
        "     ~y    Nh           ~~~~~~y~            ",
        "       ~ss- ~         ~~~-+s~               ",
        "          /o+:-s   ~./+os/.                 ",
    ],
    # Frame 8
    [
        "              -+osyyoo/.                    ",
        "          :ydho+ y@+~.:oy:~                 ",
        "       :sN@..@+~ ~     .syys                ",
        "     /@@@NN@s~:          ~:Nh@@~            ",
        "     @@@@@@N-             ~h@~yh+           ",
        "   hd@ysy                 -@@@@@N@          ",
        "   ysN.  -                 N@@@@@@s         ",
        "-@ .yd~   ~               @@@@@@@@@:        ",
        "h/    d ~....             s@@@@@@@@@        ",
        "/h      :@@@@@@d-          ~~hh~yN@@        ",
        "oy      @@@@@@@@d//        ~~~~~~h@@        ",
        "+h      @@@@@@@@@@N++      ~~~~~~h@@        ",
        "d/      o@@@@@@@@@@N/      ~~~~~~@@@        ",
        "-@       -@@@@@@@@@d       ~~~~~y@@/        ",
        "   y       o@@@@@@:~      ~~~~~~/@y         ",
        "   h       N@@@@@y        ~~~~~.NN          ",
        "     h:     s@@/.        ~~~~~~:o           ",
        "     ~y     N@~         ~~~~~~y~            ",
        "       ~ss- ~.        ~~~-+s~               ",
        "          /o+:./:   .-+os/.                 ",
    ],
    # Frame 9
    [
        "              -+ooyyso/.                    ",
        "          :y@d++- Nd:./os:~                 ",
        "       :s@No~oN/~ ~    ~.hds                ",
        "     /N@@@NN@h~+         ~~+@@@~            ",
        "     hd@@@@@@:            ~~do+h+           ",
        "   h.y@yoy+                .o@@@N@          ",
        "   y:@@~  /                ~y@@@@@s         ",
        "-@  .:d~                   .@@@@@@@:        ",
        "h/     /~~.....             @@@@@@@@        ",
        "/h       .:@@@@@@/          ~~hh~:@@        ",
        "oy       s@@@@@@@@+//       ~~~~~~@@        ",
        "+h       o@@@@@@@@@@@++     ~~~~~~@@        ",
        "d/       ~y@@@@@@@@@@@/    ~~~~~~.N@        ",
        "-@        ~s@@@@@@@@@@     ~~~~~~N@/        ",
        "   y         @@@@@@@:~     ~~~~~~Ny         ",
        "   h        /@@@@@hy      ~~~~~~@@          ",
        "     h:      -@@@-      ~~~~~~~:o           ",
        "     ~y      @@:        ~~~~~~y~            ",
        "       ~ss-   -       ~~~-+s~               ",
        "          /o+:..o:  .-+os/.                 ",
    ],
    # Frame 10
    [
        "              -+ooyyso/.                    ",
        "          :yN@y:+:/@s::oo:~                 ",
        "       :s@N@h d@o~ ~   ~~shs                ",
        "     /y@@@@NN@@-s~       ~~~y@d~            ",
        "     h+@@@@@@@:           ~~~N.o+           ",
        "   h .@@so+s               ~~+@@N@          ",
        "   y ys@~   -              ~~/@@@@s         ",
        "-@   ~-d~~                 ~~@@@@@@:        ",
        "h/       y ~....~          ~~@N@@@@@        ",
        "/h         .h@@@@@@y.      ~~~~yh+s@        ",
        "oy         s@@@@@@@@h/-    ~~~~~~~~@        ",
        "+h         o@@@@@@@@@@d++  ~~~~~~~~@        ",
        "d/         /@@@@@@@@@@@y.  ~~~~~~~.@        ",
        "-@          :o@@@@@@@@@:  ~~~~~~~-N/        ",
        "   y          d@@@@@@@:   ~~~~~~~:y         ",
        "   h          s@@@@@h     ~~~~~~-N          ",
        "     h:        @@@s~    ~~~~~~~:o           ",
        "     ~y       .@y       ~~~~~~y~            ",
        "       ~ss-    -      ~~~-+s~               ",
        "          /o+:.~:o- ~.:os/.                 ",
    ],
    # Frame 11
    [
        "              -+ossyso/.                    ",
        "          :yNNh+/+.hNy:so:~                 ",
        "       :s@NN@+ N@o~~~  ~~:hs                ",
        "     /+d@@@@N@@@+ :      ~~~:Nd~            ",
        "     h/h@@@@@@@+:         ~~~-d/+           ",
        "   h  -@@ss+o:             ~~~s@@@          ",
        "   y  :y@-   :              ~~/@@@s         ",
        "-@    ~~h@~~                ~./@@@@:        ",
        "h/         h~~.....        ~~~~N@@@@        ",
        "/h           :s@@@@@@:     ~~~~~yh.@        ",
        "oy           @@@@@@@@@+//  ~~~~~~~~@        ",
        "+h           @@@@@@@@@@@N+:~~~~~~~~@        ",
        "d/          ~/@@@@@@@@@@@/.~~~~~~~~@        ",
        "-@            :@@@@@@@@@@  ~~~~~~~//        ",
        "   y            d@@@@@@+  ~~~~~~~~y         ",
        "   h            @@@@@@s   ~~~~~~.h          ",
        "     h:         .@N@.    ~~~~~~:o           ",
        "     ~y        ~N@      ~~~~~~y~            ",
        "       ~ss-    ~-     ~~~-+s~               ",
        "          /o+:~~.:-~~.:os/.                 ",
    ],
    # Frame 12
    [
        "              -+oooyso/.                    ",
        "          :yd@Ns:::-@@oso:~                 ",
        "       :o@@@N@:~o@o~~~ ~~:hs                ",
        "     /+-@@@@@@@N@d~o     ~~~.y@~            ",
        "     h/~@@@@@@@@@:        ~~~~yd+           ",
        "   h   -@@@sooo:           ~~~~@@@          ",
        "   y   /s@h   ~.           ~~~~~@@s         ",
        "-@      ~~h/~~             ~.~~:@@@:        ",
        "h/          yd~.....        ~~~~@@@@        ",
        "/h             :@@@@@@@:~   ~~~~~-h@        ",
        "oy             @@@@@@@@@o+  ~~~~~~~o        ",
        "+h             @@@@@@@@@@@oo:~~~~~~y        ",
        "d/             +@@@@@@@@@@@+~~~~~~~@        ",
        "-@              :N@@@@@@@@@~~~~~~~./        ",
        "   y              N@@@@@N:~~~~~~~~y         ",
        "   h             h@@@@@y+ ~~~~~~.y          ",
        "     h:           @N@d. ~~~~~~~:o           ",
        "     ~y          h@o    ~~~~~~y~            ",
        "       ~ss-     ~-    ~~~-+s~               ",
        "          /o+:.~~./.~~:os/.                 ",
    ],
    # Frame 13
    [
        "              -+ooosso/.                    ",
        "          :y@dNy/-+-hNyss:~                 ",
        "       :oN@N@@s ~Ns.~~ ~~:ys                ",
        "     /+ N@@@@@N@@@y-~    ~~~~sd~            ",
        "     h/ d@@@@@@@@@-       ~~~~+@+           ",
        "   h   .o@@ho++o~          ~~~~/@@          ",
        "   y    y@@N   -:          ~~~~~d@s         ",
        "-@      ~~+@~~~            ~~~~~@@@:        ",
        "h/           .o~......     ~.~~~@@@@        ",
        "/h              :@@@@@@N:   ~~~~~~hy        ",
        "oy              @@@@@@@@@/+ ~~~~~~~o        ",
        "+h              @@@@@@@@@@@oo~~~~~~s        ",
        "d/             .s@@@@@@@@@@N:~~~~~~@        ",
        "-@              ~:@@@@@@@@@s~~~~~~./        ",
        "   y              -@@@@@@y/~~~~~~~y         ",
        "   h              @@@@@@h~~~~~~~.y          ",
        "     h:           -@@@: ~~~~~~~:o           ",
        "     ~y          :@@    ~~~~~~y~            ",
        "       ~ss-      ~-   ~~~-+s~               ",
        "          /o+:.~~~:..~:os/.                 ",
    ],
    # Frame 14
    [
        "              -+oossso/.                    ",
        "          :y@d@ds+://h@ss:~                 ",
        "       :oy@@@N@s.-@oo~.~~:ss                ",
        "     /+ .d@@@@@@@N@h~s   ~~~~+y~            ",
        "     h/  @@@@@@@@@@:      ~~~~.s+           ",
        "   h    ./d@@oo+oo         ~~~~~N@          ",
        "   y     shN@    -          ~~~~~@s         ",
        "-@        ~ h@~~           ~~.~~~@@:        ",
        "h/             d~~.....    ~~~~~~N@@        ",
        "/h                /N@@@@@N:~~~~~~~-d        ",
        "oy               ~@@@@@@@@N++~~~~~~o        ",
        "+h               ~@@@@@@@@@@@o:~~~~s        ",
        "d/                +@@@@@@@@@@+~~~~~@        ",
        "-@                 :@@@@@@@@@.~~~~./        ",
        "   y                N@@@@@@o~~~~~~y         ",
        "   h                @@@@@N+~~~~~.y          ",
        "     h:             @@@y~~~~~~~:o           ",
        "     ~y           ~+@.  ~~~~~.y~            ",
        "       ~ss-       ~- ~~~~-+s~               ",
        "          /o+:. ~~-/.:-os/.                 ",
    ],
    # Frame 15
    [
        "              -+oososo/.                    ",
        "          :yN@y@dy:://@hs:~                 ",
        "       :ooN@@@@@y~/@y+.~~:ss                ",
        "     /+   N@@@@@@@@@Ns+  ~~~~+y~            ",
        "     h/   @@@@@@@@@@y:    ~~~~~/+           ",
        "   h      /s@@@oo++o       ~~~~~/@          ",
        "   y      /yd@d    :        ~~~~~ss         ",
        "-@            h@ ~         ~.~.~~o@:        ",
        "h/               o:~.....   ~~~~~.N@        ",
        "/h                  :@@@@@@/:~~~~~~@        ",
        "oy                  @@@@@@@@@+~~~~~o        ",
        "+h                  @@@@@@@@@@o/~~~s        ",
        "d/                 -d@@@@@@@@@N.~~~@        ",
        "-@                  -:@@@@@@@@o~~~./        ",
        "   y                  N@@@@@h.~~~~y         ",
        "   h                 :@@@@@y.~~~.y          ",
        "     h:               @@@-~~~~~:o           ",
        "     ~y             /@o ~~~~~~y~            ",
        "       ~ss-        ~- ~~~-+s~               ",
        "          /o+:~~~~~::~:os/.                 ",
    ],
    # Frame 16
    [
        "              -+ooooso/.                    ",
        "          :yN@yd@d+:+ohNo:~                 ",
        "       :os+@@@d@@s~+do:-.:ss                ",
        "     /+    @@@@@@@@@@@h/~~~~~+y~            ",
        "     h/    s@@@@@@@@@@/   ~~~~~:+           ",
        "   h       -/@@@oo+++~     ~~~~~.d          ",
        "   y        +y@@@   -:     ~~~~~~.s         ",
        "-@             -d@ ~       ~~~~~~~s:        ",
        "h/                 d~~.....~.~.~~~.@        ",
        "/h                   ~+@@@@@@/~~~~~y        ",
        "oy                   -@@@@@@@@+-~~~o        ",
        "+h                   -@@@@@@@@@y/~~s        ",
        "d/                   .s@@@@@@@@N.~~@        ",
        "-@                    .h@@@@@@@s~~./        ",
        "   y                   .@@@@@@.~~~y         ",
        "   h                   @@@@@d-~~.y          ",
        "     h:                @@@+~~~~:o           ",
        "     ~y              :Nh~~~~~~y~            ",
        "       ~ss-         ~-~.~-+s~               ",
        "          /o+:~~ ~~-::/os/.                 ",
    ],
    # Frame 17
    [
        "              -+ooosso/.                    ",
        "          :y@@hs@@No:/o@s:~                 ",
        "       :oy:@@@@@@@s~-No--:ss                ",
        "     /+     @@@@@@@@@N@@:..~~+y~            ",
        "     h/     +@@@@@@@@@@h  ~~~~~:+           ",
        "   h         /+@@@oo+o+    ~~~~~.h          ",
        "   y         :ydN@    -~    ~~~~~~s         ",
        "-@               ~hh ~   ~ ~~.~~~~.:        ",
        "h/                  ~d~....-~~~~~~~@        ",
        "/h                     :/@@@@@s~~~~s        ",
        "oy                     @@@@@@@@+-~~o        ",
        "+h                     @@@@@@@@@ys~s        ",
        "d/                     /@@@@@@@@@~~@        ",
        "-@                      :@@@@@@@/~./        ",
        "   y                     @@@@@@/~~y         ",
        "   h                     @@@@d.~.y          ",
        "     h:                 @N@+~~~:o           ",
        "     ~y               .d@.~~~~y~            ",
        "       ~ss-           -.~-+s~               ",
        "          /o+:~~  ~~/::ss/.                 ",
    ],
    # Frame 18
    [
        "              -+ooosoo/.                    ",
        "          :yN@hsdddy::hhy:~                 ",
        "       :oy:-y@@@d@@o//do/:ss                ",
        "     /+      /@@@@@@@@@@N/+~~+y~            ",
        "     h/      .@@@@@@@@@@N~~~~~~:+           ",
        "   h           /h@@@ooo+/  ~~~~~.h          ",
        "   y           +yd@@    /  ~~~~~~~s         ",
        "-@                 s@@ ~   ~.~.~~~.:        ",
        "h/                     @~...-.~~~~~@        ",
        "/h                       -N@@@@h~~~s        ",
        "oy                       y@@@@@@++~o        ",
        "+h                       h@@@@@@@@/s        ",
        "d/                       o@@@@@@@o.@        ",
        "-@                       ~:@@@@@@../        ",
        "   y                       @@@@@:~y         ",
        "   h                      N@@@h~.y          ",
        "     h:                 ~y@d/~~:o           ",
        "     ~y                .s@.~~~y~            ",
        "       ~ss-           ~-~-+s~               ",
        "          /o+:~ ~ ~~-//ss/.                 ",
    ],
    # Frame 19
    [
        "              -+oooooo/.                    ",
        "          :y@@dso@NNy/+yy:~                 ",
        "       :os/-.@@@@@@Ns-oso/ss                ",
        "     /+       .@@@@@@@@@@N//~+y~            ",
        "     h/        @@@@@@@@@@@s~~~~:+           ",
        "   h            +o@@@oo+o+ ~~~~~.h          ",
        "   y             /hN@@   ::~~~~~~~s         ",
        "-@                   /@:~  ~.~~~~~.:        ",
        "h/                      o-~.---~~~~@        ",
        "/h                         /N@@@h:~s        ",
        "oy                         @@@@@@@-o        ",
        "+h                         @@@@@@@hs        ",
        "d/                         s@@@@@@y@        ",
        "-@                        ~-@@@@@@./        ",
        "   y                      ~~N@@@@~y         ",
        "   h                      ~h@@@o.y          ",
        "     d:                 ~~.@d-~:o           ",
        "     ~y                 ~sN~~~y~            ",
        "       ~ss-           ~.--+s~               ",
        "          /o+:~ ~~ ~.:/os/.                 ",
    ],
]

# ─────────────────────────────────────────────────────────────
#  CCTV SIMULATION DATA
# ─────────────────────────────────────────────────────────────
CAM_TITLES = [
    "CAM-01: SHOH KO'CHA",
    "CAM-02: CHORSU CHORRAHASI",
    "CAM-03: KIRISH DARVOZASI",
    "CAM-04: AVTO TURARGOH",
]
CAM_LOCS = [
    "AMIR TEMUR KO'CHASI",
    "CHORSU CHORRAHASI",
    "ASOSIY DARVOZA",
    "AVTO TURARGOH",
]

LICENSE_PLATES = [
    "01|M555MM","01|A777AA","10|K123KK","70|B456BB",
    "01|H789HH","30|T321TT","01|L654LL","20|N987NN",
    "01|R246RR","40|P135PP","01|C888CC","50|D369DD",
]
FACE_IDS = [f"ID:{random.randint(1000,9999)}" for _ in range(20)]


# ─────────────────────────────────────────────────────────────
#  SYSTEM INFO
# ─────────────────────────────────────────────────────────────
def run_cmd(cmd):
    try:
        return subprocess.check_output(cmd, shell=True,
                                       stderr=subprocess.DEVNULL,
                                       timeout=2).decode().strip()
    except Exception:
        return ""

def get_sys_info():
    i = {}
    # RAM
    r = run_cmd("free -m | grep Mem")
    if r:
        p = r.split()
        if len(p) >= 3:
            i['ram_total'] = int(p[1])
            i['ram_used']  = int(p[2])
            i['ram_pct']   = int(int(p[2]) / max(1,int(p[1])) * 100)
        else:
            i['ram_total'],i['ram_used'],i['ram_pct'] = 7926,874,11
    else:
        i['ram_total'],i['ram_used'],i['ram_pct'] = 7926,874,11

    # CPU
    r = run_cmd("top -bn1 | grep 'Cpu' | awk '{print $2}'")
    try:    i['cpu'] = float(r)
    except: i['cpu'] = 2.0

    r = run_cmd("nproc")
    try:    i['cores'] = int(r)
    except: i['cores'] = 2

    r = run_cmd("cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d: -f2")
    i['chip'] = (r[:22] if r else 'Intel(R) Pentium(R)').strip()

    r = run_cmd("uptime -p")
    i['uptime'] = (r.replace('up ','')[:22] if r else '14h 25m 39s')

    r = run_cmd("hostname -I | awk '{print $1}'")
    i['ip'] = r if r else '192.168.0.71'

    r = run_cmd("cat /proc/loadavg")
    if r:
        p = r.split()
        i['load'] = f"{p[0]}, {p[1]}, {p[2]}" if len(p)>=3 else '0.15, 0.22, 0.18'
    else:
        i['load'] = '0.15, 0.22, 0.18'

    r = run_cmd("df / | tail -1 | awk '{print $3,$2}'")
    if r:
        p = r.split()
        if len(p)>=2:
            used_g  = round(int(p[0])/1024/1024)
            total_g = round(int(p[1])/1024/1024)
            i['disk_used'] = int(used_g)
            i['disk_total']= int(total_g)
            i['disk_pct']  = int(used_g/max(1,total_g)*100)
        else:
            i['disk_used'],i['disk_total'],i['disk_pct'] = 19,110,18
    else:
        i['disk_used'],i['disk_total'],i['disk_pct'] = 19,110,18

    # RX/TX
    r = run_cmd("cat /proc/net/dev | grep -E 'eth0|wlan0|ens' | head -1 | awk '{print $2,$10}'")
    if r:
        p = r.split()
        if len(p)>=2:
            i['rx'] = round(int(p[0])/1024/1024, 1)
            i['tx'] = round(int(p[1])/1024/1024, 1)
        else:
            i['rx'],i['tx'] = 3.4,2.1
    else:
        i['rx'],i['tx'] = 3.4,2.1

    i['user'] = os.environ.get('USER','huzayfa')
    return i


# ─────────────────────────────────────────────────────────────
#  CCTV CAMERA CLASS
# ─────────────────────────────────────────────────────────────
class Camera:
    def __init__(self, cid, w, h):
        self.cid   = cid
        self.w     = max(w, 22)
        self.h     = max(h, 10)
        self.objs  = []
        self._spawn_objects()
        self.frame = 0

    def _rand_obj(self):
        is_car = self.cid in (0,2,3) or random.random() < 0.5
        if is_car:
            ow, oh = random.randint(7,11), 3
            label  = random.choice(LICENSE_PLATES)
            conf   = random.randint(88,99)
            col    = 5   # yellow
        else:
            ow, oh = random.randint(3,5), random.randint(4,6)
            label  = random.choice(["PIYODA","YUZNI ANIQLASH","ID:"+str(random.randint(1000,9999))])
            conf   = random.randint(91,99)
            col    = 3   # cyan
        ox = float(random.randint(1, max(1, self.w - ow - 2)))
        oy = float(random.randint(1, max(1, self.h - oh - 3)))
        vx = random.choice([-1,1]) * random.uniform(0.15,0.6)
        vy = random.choice([-1,0,1]) * random.uniform(0.05,0.2)
        return dict(x=ox, y=oy, w=ow, h=oh, vx=vx, vy=vy,
                    label=label, conf=conf, col=col, age=0, is_car=is_car)

    def _spawn_objects(self):
        n = random.randint(2,3)
        self.objs = [self._rand_obj() for _ in range(n)]

    def update(self):
        self.frame += 1
        for o in self.objs:
            o['x'] += o['vx']
            o['y'] += o['vy']
            o['age'] += 1
            # Bounce
            if o['x'] < 1 or o['x']+o['w'] > self.w-2:
                o['vx'] = -o['vx']
                o['x']  = max(1.0, min(float(self.w-o['w']-2), o['x']))
            if o['y'] < 1 or o['y']+o['h'] > self.h-4:
                o['vy'] = -o['vy']
                o['y']  = max(1.0, min(float(self.h-o['h']-4), o['y']))
            # Drift conf
            if random.random() < 0.08:
                o['conf'] = max(85, min(99, o['conf']+random.randint(-1,1)))

        # Remove old, add new
        self.objs = [o for o in self.objs if o['age'] < 300 or random.random() > 0.005]
        if len(self.objs) < 4 and random.random() < 0.015:
            self.objs.append(self._rand_obj())

    def draw(self, scr, sy, sx):
        w, h = self.w, self.h
        H, W = scr.getmaxyx()

        def safe(y, x, s, attr=0):
            try:
                if 0 <= y < H-1 and 0 <= x < W-1:
                    scr.addstr(y, x, s[:max(0,W-1-x)], attr)
            except curses.error:
                pass

        def safech(y, x, c, attr=0):
            try:
                if 0 <= y < H-1 and 0 <= x < W-1:
                    scr.addch(y, x, c, attr)
            except curses.error:
                pass

        G1 = curses.color_pair(1)
        G6 = curses.color_pair(6)
        C3 = curses.color_pair(3)
        C4 = curses.color_pair(4)
        C5 = curses.color_pair(5)
        BD = curses.A_BOLD

        # Background (road/area texture)
        for r in range(1, h-2):
            for c in range(1, w-1):
                ry, rx2 = sy+r, sx+c
                if ry >= H-1 or rx2 >= W-1:
                    break
                if self.cid == 0:    ch = '─' if r==h//2 else ('│' if c%12==0 else '·')
                elif self.cid == 1:  ch = '·' if (r+c)%3 != 0 else '+'
                elif self.cid == 2:  ch = '+' if (r==h//2 or c==w//2) else '·'
                else:                ch = '│' if c%7==0 else ('─' if r==h//2 else '·')
                safech(ry, rx2, ch, G6)

        # Border
        safe(sy,    sx, '┌'+'─'*(w-2)+'┐', C3|BD)
        safe(sy+h-1,sx, '└'+'─'*(w-2)+'┘', C3|BD)
        for r in range(1, h-1):
            safech(sy+r, sx,     '│', C3)
            safech(sy+r, sx+w-1, '│', C3)

        # Bounding boxes
        for o in self.objs:
            ox2, oy2 = int(o['x']), int(o['y'])
            ow2, oh2 = o['w'], o['h']
            col = curses.color_pair(o['col']) | BD
            # Top/bot lines
            safe(sy+oy2,     sx+ox2, '┌'+'─'*(ow2-2)+'┐', col)
            if sy+oy2+oh2-1 < H-1:
                safe(sy+oy2+oh2-1, sx+ox2, '└'+'─'*(ow2-2)+'┘', col)
            # Sides
            for r in range(1, oh2-1):
                safech(sy+oy2+r, sx+ox2,      '│', col)
                safech(sy+oy2+r, sx+ox2+ow2-1,'│', col)
            # Crosshair
            cxp = ox2 + ow2//2
            cyp = oy2 + oh2//2
            safech(sy+cyp, sx+cxp, '+', col)
            # Label
            lbl = f" {o['label']} [{o['conf']}%] "
            safe(sy+oy2-1 if oy2 > 0 else sy+oy2, sx+ox2, lbl[:ow2+6], col)

        # Header
        blink = int(time.time()*2)%2
        rec = '●' if blink else '○'
        hdr = f"[{rec}] {CAM_TITLES[self.cid]}"
        safe(sy, sx+1, hdr[:w-8], C3|BD)
        safe(sy, sx+w-7, ' ●REC', C4|BD)

        # Footer
        loc = f"{CAM_LOCS[self.cid]} // 1080p 30FPS"
        ts  = time.strftime("%H:%M:%S")
        safe(sy+h-2, sx+1, loc[:w-12], C5)
        safe(sy+h-2, sx+w-9, ts, C5|BD)


# ─────────────────────────────────────────────────────────────
#  MAIN DASHBOARD
# ─────────────────────────────────────────────────────────────
class Dashboard:
    def __init__(self, scr):
        self.scr  = scr
        self.H, self.W = scr.getmaxyx()
        self._init_colors()
        self._init_matrix()
        self.sys_info  = {}
        self.sys_ts    = 0
        self.earth_idx = 0
        self.cam_ts    = 0
        self.cameras   = []
        self._init_cameras()
        self.packet_cnt = random.randint(10000,50000)

    def _init_colors(self):
        curses.start_color()
        curses.use_default_colors()
        curses.init_pair(1,  curses.COLOR_GREEN,   -1)
        curses.init_pair(2,  curses.COLOR_WHITE,   -1)
        curses.init_pair(3,  curses.COLOR_CYAN,    -1)
        curses.init_pair(4,  curses.COLOR_RED,     -1)
        curses.init_pair(5,  curses.COLOR_YELLOW,  -1)
        curses.init_pair(6,  curses.COLOR_GREEN,   curses.COLOR_BLACK)
        curses.init_pair(7,  curses.COLOR_BLACK,   curses.COLOR_GREEN)
        curses.init_pair(8,  curses.COLOR_MAGENTA, -1)
        curses.init_pair(9,  curses.COLOR_BLUE,    -1)
        curses.init_pair(10, curses.COLOR_BLACK,   curses.COLOR_CYAN)

    def _init_matrix(self):
        self.mlines = []
        for _ in range(4):
            self.mlines.append([random.choice(MCHARS) for _ in range(300)])
        self.moff = 0

    def _init_cameras(self):
        # Right portion of screen
        cam_sx = int(self.W * 0.57)
        cam_aw = self.W - cam_sx - 1
        # Content rows: 9 .. H-4
        cam_ah = self.H - 14
        cw = cam_aw // 2 - 1
        ch = cam_ah // 2 - 1
        cw = max(20, cw)
        ch = max(10, ch)
        self.cam_sx = cam_sx
        self.cam_cw = cw
        self.cam_ch = ch
        self.cameras = [Camera(i, cw, ch) for i in range(4)]

    def _safe(self, y, x, s, attr=0):
        try:
            if 0 <= y < self.H-1 and 0 <= x < self.W-1:
                self.scr.addstr(y, x, s[:max(0, self.W-1-x)], attr)
        except curses.error:
            pass

    def _draw_matrix_row(self, y, off=0):
        if y < 0 or y >= self.H-1:
            return
        ml = self.mlines[y % len(self.mlines)]
        for x in range(min(self.W-1, 280)):
            ch = ml[(x + self.moff + off) % len(ml)]
            col = random.choice([
                curses.color_pair(1),
                curses.color_pair(1)|curses.A_BOLD,
                curses.color_pair(6),
                curses.color_pair(2)|curses.A_BOLD,
            ])
            try:
                self.scr.addstr(y, x, ch, col)
            except curses.error:
                pass

    def _draw_top_bar(self):
        now = time.strftime("%H:%M:%S")
        bar = (f" [*] KALI CYBER TERMINAL  //  NODE: kali  //  "
               f"TASHKENT (UTC+5)  //  CCTV 4-CH LIVE  //  "
               f"DEFENSE: ACTIVE  //  {now} ")
        self._safe(0, 0, bar.ljust(self.W-1), curses.color_pair(7)|curses.A_BOLD)

    def _draw_clock(self, sy):
        """Draw large 7-segment clock — occupies rows sy..sy+4"""
        ts = time.strftime("%H:%M:%S")
        # Each char: 5 wide + 1 space
        char_w = 6
        clock_w = len(ts) * char_w
        # Centre in left 57% of screen
        left_w = int(self.W * 0.57)
        sx = max(0, (left_w - clock_w) // 2)
        for row in range(5):
            x = sx
            for ch in ts:
                pat = DIGITS.get(ch, ["     "]*5)[row]
                col = curses.color_pair(2)|curses.A_BOLD if row==2 else curses.color_pair(1)|curses.A_BOLD
                self._safe(sy+row, x, pat, col)
                x += 6

    def _draw_date_line(self, y):
        now   = time.localtime()
        day   = DAYS_UZ[now.tm_wday]
        mon   = MONTHS_UZ[now.tm_mon-1]
        week  = now.tm_yday // 7 + 1
        s     = (f">>> {now.tm_mday:02d}-{mon}, {now.tm_year} // "
                 f"{day} // HAFTA {week} // ASIA/TASHKENT (UTC+5) <<<")
        left_w = int(self.W * 0.57)
        sx = max(0, (left_w - len(s)) // 2)
        self._safe(y, sx, s[:left_w], curses.color_pair(5)|curses.A_BOLD)

    def _draw_server_panel(self, sy, ey):
        x  = 1
        w  = int(self.W * 0.26) - 2
        G1 = curses.color_pair(1)
        G3 = curses.color_pair(3)
        G5 = curses.color_pair(5)
        G4 = curses.color_pair(4)
        G6 = curses.color_pair(6)
        BD = curses.A_BOLD

        def s(row, txt, col=1, bold=False):
            if sy+row >= ey or sy+row >= self.H-1: return
            a = curses.color_pair(col)|(BD if bold else 0)
            self._safe(sy+row, x, txt[:w], a)

        now = time.time()
        if now - self.sys_ts > 4:
            self.sys_info = get_sys_info()
            self.sys_ts   = now
        i = self.sys_info

        s( 0,"┌─ SERVER TELEMETRIYA ─────────────┐",3,True)

        ram_pct = i.get('ram_pct',11)
        ram_bar = '█'*int(14*ram_pct/100)+'░'*(14-int(14*ram_pct/100))
        s( 1,f"  RAM: [{ram_bar}] {ram_pct}% ({i.get('ram_used',874)}M/{i.get('ram_total',7926)}M)")

        cpu = i.get('cpu',2.0)
        cpu_bar = '█'*int(14*cpu/100)+'░'*(14-int(14*cpu/100))
        s( 2,f"  CPU: [{cpu_bar}] {cpu:.0f}% ({i.get('cores',2)} Cores)")

        s( 3,f"  CHIP:   {i.get('chip','Intel Pentium')}")
        s( 4,f"  UPTIME: {i.get('uptime','14h 25m 39s')}")
        s( 5,f"  LAN IP: {i.get('ip','192.168.0.71')}",5,True)

        rx = i.get('rx',3.4)+random.uniform(-0.1,0.3)
        tx = i.get('tx',2.1)+random.uniform(-0.1,0.2)
        s( 6,f"  TRAFFIC: RX {rx:.1f} MB/s | TX {tx:.1f} MB/s")
        s( 7,f"  FIREWALL: ACTIVE [MAXIMUM SHIELD]",3)
        s( 8,f"  PM2 BOTS: ONLINE [2/2 RUNNING]")
        s( 9,f"  SSH PORT: 22 [ENCRYPTED - ACTIVE]")
        s(10,f"  REGION:   UZBEKISTAN // TASHKENT")
        s(11,f"  IELTS BOT: ACTIVE & LISTENING")
        s(12,f"  SRV BOT:   ACTIVE & CONTROLLING")
        s(13,f"  PLATFORM: Linux x64 (Linux)")
        s(14,f"  LOAD AVG: {i.get('load','0.15, 0.22, 0.18')}")
        s(15,f"  MEM SWAP: CLEAN [0% USED – 2.0GB]")

        du = i.get('disk_used',19)
        dt = i.get('disk_total',110)
        dp = i.get('disk_pct',18)
        d_bar = '█'*int(12*dp/100)+'░'*(12-int(12*dp/100))
        s(16,f"  DISK: [{d_bar}] {du}G/{dt}G [{dp}%]")
        s(17,f"  SECURITY: ZERO THREAT DETECTED",3)
        s(18,f"  DEFENSE:  MAXIMUM ENCRYPTION ACTIVE",3,True)
        s(19,f"  CCTV NET: 4 CHANNELS STREAMING",4,True)
        self.packet_cnt += random.randint(10,150)
        s(20,f"  PACKETS:  {self.packet_cnt:,}")
        s(21,f"  REPO: github.com/huzayfa0/live-server",5)
        s(22,"└──────────────────────────────────────┘",3)

        # PM2
        s(24,"┌─ PM2 JARAYONLAR ─────────────────────┐",3,True)
        s(25,"  ● express-ielts-bot  ONLINE (PID:1420)")
        s(26,"    RAM: 104MB | CPU: 0.2% | Up: 14h 25m",6)
        s(27,"  ● server-controller  ONLINE (PID:1894)")
        s(28,"    RAM: 103MB | CPU: 0.4% | Up: 14h 25m",6)
        s(29,"└──────────────────────────────────────┘",3)

    def _draw_earth(self, sy, sx, ew, eh):
        H,W = self.H, self.W
        G1=curses.color_pair(1); G3=curses.color_pair(3)
        G5=curses.color_pair(5); BD=curses.A_BOLD; G6=curses.color_pair(6)

        self._safe(sy, sx, "┌─── PLANET EARTH // LIVE 360 ──────┐", G3|BD)
        self._safe(sy+eh-1, sx, f"└─ ROT:{self.earth_idx*360//len(EARTH_FRAMES):03d}° {'─'*(ew-14)}┘", G3|BD)

        # Border sides
        for r in range(1, eh-1):
            try:
                if sy+r < H-1:
                    self.scr.addch(sy+r, sx,    '│', G3)
                    self.scr.addch(sy+r, sx+ew, '│', G3)
            except curses.error:
                pass

        # Earth frame
        frame = EARTH_FRAMES[self.earth_idx % len(EARTH_FRAMES)]
        fh = len(frame)
        fw = max(len(l) for l in frame) if frame else 1

        # Scale frame to fit area
        draw_h = min(fh, eh-2)
        for r in range(draw_h):
            fy = r * fh // draw_h
            line = frame[fy] if fy < fh else ""
            dy = sy + 1 + r
            if dy >= H-1: break
            for c in range(min(ew-1, len(line))):
                ch = line[c]
                dx = sx + 1 + c
                if dx >= W-1: break
                # Color by char type
                if ch in '@':
                    a = G1|BD
                elif ch in 'ONs':
                    a = G1
                elif ch in 'hyd':
                    a = G6
                elif ch in '.~,':
                    a = curses.color_pair(9)
                elif ch in '-+':
                    a = curses.color_pair(8)
                elif ch == ' ':
                    a = 0
                else:
                    a = G3
                try:
                    if 0<=dy<H-1 and 0<=dx<W-1:
                        self.scr.addch(dy, dx, ch, a)
                except curses.error:
                    pass

    def _draw_cctv_header(self, sy, sx):
        G3=curses.color_pair(3); G4=curses.color_pair(4); BD=curses.A_BOLD
        self._safe(sy, sx, "┌─── CCTV XAVFSIZLIK // 4-CH AI LIVE ──────────────────────────┐", G3|BD)
        blink = int(time.time()*2)%2
        rec = "● 4-CH REC" if blink else "○ 4-CH REC"
        self._safe(sy+1, sx+2, rec, G4|BD)

    def _draw_bottom_bar(self):
        t = time.strftime("%H:%M:%S  %d/%m/%Y")
        bar = (f" KALI CYBER MONITOR // 4-CH LIVE CCTV // "
               f"TASHKENT (UTC+5) // ALL SYSTEMS OPERATIONAL // {t} ")
        self._safe(self.H-1, 0, bar.ljust(self.W-1), curses.color_pair(7)|curses.A_BOLD)

    def run(self):
        curses.curs_set(0)
        self.scr.nodelay(True)
        self.scr.timeout(80)
        frame = 0

        while True:
            key = self.scr.getch()
            if key in (ord('q'), ord('Q'), 27):
                break

            # Resize
            nh, nw = self.scr.getmaxyx()
            if nh != self.H or nw != self.W:
                self.H, self.W = nh, nw
                self._init_cameras()
                self.scr.clear()

            now = time.time()

            # Scroll matrix
            if frame % 3 == 0:
                self.moff = (self.moff+1) % 300
                for ml in self.mlines:
                    for idx in random.sample(range(len(ml)), min(6,len(ml))):
                        ml[idx] = random.choice(MCHARS)

            # Advance earth frame
            if frame % 4 == 0:
                self.earth_idx = (self.earth_idx+1) % len(EARTH_FRAMES)

            # Update cameras
            if now - self.cam_ts > 0.12:
                for c in self.cameras:
                    c.update()
                self.cam_ts = now

            # ── DRAW ──
            try:
                # Top bar
                self._draw_top_bar()

                # Row 1: matrix rain
                self._draw_matrix_row(1, 0)

                # Rows 2-6: large clock
                self._draw_clock(2)

                # Row 7: date / day / year / week
                self._draw_date_line(7)

                # Row 8: matrix rain
                self._draw_matrix_row(8, 80)

                content_sy = 9
                content_ey = self.H - 3

                # LEFT: server telemetry
                self._draw_server_panel(content_sy, content_ey)

                # CENTER: rotating earth
                earth_sx = int(self.W * 0.27)
                earth_ew = int(self.W * 0.29)
                earth_eh = content_ey - content_sy
                self._draw_earth(content_sy, earth_sx, earth_ew, earth_eh)

                # RIGHT: 4-CH CCTV
                cctv_sy = content_sy
                cctv_sx = self.cam_sx

                self._draw_cctv_header(cctv_sy, cctv_sx)

                cw, ch = self.cam_cw, self.cam_ch
                positions = [
                    (cctv_sy+2, cctv_sx+1),
                    (cctv_sy+2, cctv_sx+cw+2),
                    (cctv_sy+2+ch+1, cctv_sx+1),
                    (cctv_sy+2+ch+1, cctv_sx+cw+2),
                ]
                for idx, (cy2, cx2) in enumerate(positions):
                    if idx < len(self.cameras):
                        self.cameras[idx].draw(self.scr, cy2, cx2)

                # Bottom matrix rain
                if self.H-3 > 0:
                    self._draw_matrix_row(self.H-3, 160)

                # Bottom bar
                self._draw_bottom_bar()

                self.scr.refresh()
            except curses.error:
                pass

            frame += 1
            time.sleep(0.08)


# ─────────────────────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────────────────────
def main(stdscr):
    dash = Dashboard(stdscr)
    dash.run()

if __name__ == '__main__':
    try:
        curses.wrapper(main)
    except KeyboardInterrupt:
        pass
    finally:
        # Reset terminal
        os.system('tput reset 2>/dev/null || reset 2>/dev/null || true')
        print("Kali Cyber Terminal closed.")
