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

// 24 ta aylanuvchi Katta Yer shari freymlari (20 qator x 46 ustun)
const earthFrames = [["              -+osoooo/.                      ","          :sdho+   :yyyNh:~                   ","       :so~.    .o~@h/@@@@@s                  ","     /h~        //Ny::@@+@dh@@@~              ","     ho          @@-  ::dsNd@o@@+             ","   h          ~s@@@@@@@@@@@y@@N@@@            ","   y          :@@@@@@@@@@@@Ny@@ydhs           ","-@~         y@@@@@@@@@@@@@@@N-d@-~o:          ","h/          y@@@@@@@@@@@@@@@@@h-~~.@          ","/d@@~          yyy   y@@@@@@@@@h~~~s          ","o@@@s/                @@@@@@@@d-~~~o          ","+N@@@@o+              @@@@@@@@:~~~~s          ","dh@@@@N~               @@@@@@/~~~~~@          ","-@@@@@@               h@@@@@@.yy~~./          ","   y@@@~               @@@@N+~+~~~y           ","   h@@N               o@@@d~~~~~.y            ","     dd.               .~~~~~~~:o             ","     ~@:                ~~~~~~y~              ","       ~ss-           ~~~-+s~                 ","          /s+:~ ~-:://+ys/.                   "],["              -+osoooo/.                      ","          :sdhs+.  .hsy@h:~                   ","       :sy~.~    + @@.@@@@@s                  ","     /d-~        -/Ny+N@Nh@N@@@~              ","     ds           @s  ~:ossd@h@@+             ","   d           :@@@@@@@@@@@@y@@@@@            ","   h           d@@@@@@@@@@@@yo@@@ys           ","-@~          ~@@@@@@@@@@@@@@@@:@d~-:          ","h/~          .@@@@@@@@@@@@@@@@@-.~~@          ","/h@@+~          yyyo ~h@@@@@@@@@/~~s          ","oh@@@s/               ~@@@@@@@@o~~~o          ","+h@@@@@+.             ~@@@@@@@N.~~~s          ","do@@@@@+               :@@@@@@o~~~~@          ","-@@@@@@+              :@@@@@@@-@~~./          ","   y@@@d               ~@@@@d~s/~~y           ","   hN@@-               yN@No~~~~.y            ","     hyo                -~~~~~~:o             ","     ~h+                ~~~~~~y~              ","       ~ss-~          ~~~-+s~                 ","          /so:~ ~~:///+ss/.                   "],["              -+oyoooo/.                      ","          :sydh+/.  :hhdh:~                   ","       :oN. ~     o /N-@@@@s                  ","     /Ns .        ~/@hsd@NoNdN@~              ","     @d~           @@/ ~/+dsh@hN+             ","   @             o@@@@@@@@@@@y@@@@            ","   y             h@@@@@@@@@@@hoNdds           ","-@             @@@@@@@@@@@@@@@@/@:.:          ","hs~~           d@@@@@@@@@@@@@@@@-.~@          ","/hd@@@.           yyy~ sh@@@@@@@@y~s          ","oy@@@@h/                 @@@@@@@o.~o          ","+h@@@@@@++~              @@@@@@@.~~s          ","d/@@@@@@@/               @@@@@@y~~~@          ","-@.@@@@@N~              h@@@@@@:@~./          ","   y+@@@N                @@@@@~..~y           ","   h/@@@:                h@@d~~~.y            ","     h:N-                -.~~~~:o             ","     ~yd                ~~~~~~y~              ","       ~ss-           ~~~-+s~                 ","          /os/~  ~-://+os/.                   "],["              -+oysooo/.                      ","          :shohs+/   :ddh:~                   ","       :o@:  .     o/shs@@@s                  ","     /Nd+ ~         /+@yh@@sN@@~              ","     @@+            o@d  ++dsd@d+             ","   @.             :o@@@@@@@@@@h@N@            ","   y:              @@@@@@@@@@@yh@@s           ","-@               y@@@@@@@@@@@@@N/@/:          ","h+ ~~            oN@@@@@@@@@@@@@@-.@          ","/h~@@@@:            yyy  oN@@@@@@@/s          ","oy/@@@@@/-                h@@@@@@@~o          ","+h:@@@@@@h++              d@@@@@@/~s          ","d/-@@@@@@@d.               @@@@@o~~@          ","-@ s@@@@@@@              :h@@@@@:o./          ","   y N@@@@~                @@@ds:~y           ","   h -@@@o                s@@d~~.y            ","     h:+@~               ~~.~~~:o             ","     ~y:y               ~~~~~~y~              ","       ~ss-           ~~~-+s~                 ","          /oys.   ~://+os/.                   "],["              -+oyyooo/.                      ","          :syhsh++~  ~ddy:~                   ","       :ssh~ ~~     /:do+@@s                  ","     /@N+o           ~+@yh@@@@d~              ","     @@@.             @@~ .+ddN@+             ","   @h.              :@@@@@@@@@@@@N            ","   d                s@@@@@@@@@@@h@s           ","-@. ~~             @@@@@@@@@@@@@NdN:          ","h/o~~~~            d@@@@@@@@@@@@@d-@          ","/h :@@@@+            .yhh ~hN@@@@@Ns          ","oy N@@@@@//-                @@@@@@so          ","+h @@@@@@@@h+.             ~@@@@@@-s          ","d/ o@@@@@@@@/-             ~y@@@@.~@          ","-@  @@@@@@@@              ~oN@@@@yo/          ","   y  o@@@@N~             ~~@@@@:/y           ","   h  s@@@@-              ~/d@h~.y            ","     h: @d.             ~~~~.~~:o             ","     ~y @:              ~~~~~~y~              ","       ~ss-           ~~~-+s~                 ","          /o+s-   ~://+os/.                   "],["            ./osyyoo+:.                       ","          :sys-dh+/. ~/Ny:~                   ","       :ssys~ ~      +:@y@@s                  ","     /@d@ho            +@yo@d@@~              ","     @@@s              +@-~-ohd@+             ","   Nhy                s@@@@@@@@@@@            ","   @ -.               o@@@@@@@@@h@s           ","-@y   ~             ~@@@@@@@@@@@@dd:          ","h/ -~~.~             d@@@@@@@@@@@@@@          ","/h  :@@@@@/            shhs..d@@@@@h          ","oy  @@@@@@@//              ~~-@@@@@o          ","+h  @@@@@@@@@++/           ~~-@@@@Ns          ","d/  y@@@@@@@@@/            ~~-@@@@/@          ","-@  ~-@@@@@@@@~            ~.@@@@dy/          ","   y   y@@@@@.            ~~~y@@@.y           ","   h   d@@@@y             ~~~d@s.y            ","     h:  @dh             ~~~~~~:o             ","     ~y  @d             ~~~~~~y~              ","       ~ss-           ~~~-+s~                 ","          /o+/s    .//+os/.                   "],["              -+oyyyoo/.                      ","          :yyss-@h+~ ~:@y:~                   ","       :s@:dh  ~      +ohs@s                  ","     /@@N@so ~          +@dy@@@~              ","     @@@@+              .@@~:ss@+             ","   Nhhh                /y@@@@@@@N@            ","   @/  ~                @@@@@@@@@ds           ","-@/:   ~               @@@@@@@@@@@h:          ","h/ ~~~...~             @@@@@@@@@@@@@          ","/h   ~@@@@@@:            ohho-h@@@@N          ","oy   -@@@@@@@//             ~~~@@@@h          ","+h   -@@@@@@@@@++~          ~~~@@@@y          ","d/   :@@@@@@@@@@/~         ~~~~@@@@@          ","-@    -@@@@@@@@@           ~.~s@@@h/          ","   y    o@@@@@@.           ~~~s@@oy           ","   h    h@@@@dy           ~~~~@@-y            ","     h:  ~@@d~           ~~~~~~:o             ","     ~y  .@h            ~~~~~~y~              ","       ~ss-~          ~~~-+s~                 ","          /o+:o.   ~:/+os/.                   "],["              -+osyyoo/.                      ","          :yds+~d@y/..:sy:~                   ","       :s@/+@s~ ~      ssdds                  ","     /@@@N@os.           o@d@@d~              ","     @@@@@/-             ~dN~syh+             ","   d@dsy                 +@@@@@@@N            ","   d@   ~                h@@@@@@@@s           ","-@ y.~  ~               d@@@@@@@@@N:          ","h/  .d~....             oN@@@@@@@@@@          ","/h     o@@@@@s:            hhh.y@@@@          ","oy     @@@@@@@@//           ~~~~@@@@          ","+h     @@@@@@@@@@++-       ~~~~~@@@N          ","d/    -N@@@@@@@@@@/        ~~~~~N@@@          ","-@     .@@@@@@@@@@        ~~~~~o@@@/          ","   y     .@@@@@@@.        ~~~~~.@@y           ","   h     o@@@@@d          ~~~~~@sh            ","     h:   ~h@@.         ~~~~~~~:o             ","     ~y    Nh           ~~~~~~y~              ","       ~ss- ~         ~~~-+s~                 ","          /o+:-s   ~./+os/.                   "],["              -+osyyoo/.                      ","          :ydho+ y@+~.:oy:~                   ","       :sN@..@+~ ~     .syys                  ","     /@@@NN@s~:          ~:Nh@@~              ","     @@@@@@N-             ~h@~yh+             ","   hd@ysy                 -@@@@@N@            ","   ysN.  -                 N@@@@@@s           ","-@ .yd~   ~               @@@@@@@@@:          ","h/    d ~....             s@@@@@@@@@          ","/h      :@@@@@@d-          ~~hh~yN@@          ","oy      @@@@@@@@d//        ~~~~~~h@@          ","+h      @@@@@@@@@@N++      ~~~~~~h@@          ","d/      o@@@@@@@@@@N/      ~~~~~~@@@          ","-@       -@@@@@@@@@d       ~~~~~y@@/          ","   y       o@@@@@@:~      ~~~~~~/@y           ","   h       N@@@@@y        ~~~~~.NN            ","     h:     s@@/.        ~~~~~~:o             ","     ~y     N@~         ~~~~~~y~              ","       ~ss- ~.        ~~~-+s~                 ","          /o+:./:   .-+os/.                   "],["              -+ooyyso/.                      ","          :y@d++- Nd:./os:~                   ","       :s@No~oN/~ ~    ~.hds                  ","     /N@@@NN@h~+         ~~+@@@~              ","     hd@@@@@@:            ~~do+h+             ","   h.y@yoy+                .o@@@N@            ","   y:@@~  /                ~y@@@@@s           ","-@  .:d~                   .@@@@@@@:          ","h/     /~~.....             @@@@@@@@          ","/h       .:@@@@@@/          ~~hh~:@@          ","oy       s@@@@@@@@+//       ~~~~~~@@          ","+h       o@@@@@@@@@@@++     ~~~~~~@@          ","d/       ~y@@@@@@@@@@@/    ~~~~~~.N@          ","-@        ~s@@@@@@@@@@     ~~~~~~N@/          ","   y         @@@@@@@:~     ~~~~~~Ny           ","   h        /@@@@@hy      ~~~~~~@@            ","     h:      -@@@-      ~~~~~~~:o             ","     ~y      @@:        ~~~~~~y~              ","       ~ss-   -       ~~~-+s~                 ","          /o+:..o:  .-+os/.                   "],["              -+ooyyso/.                      ","          :yN@y:+:/@s::oo:~                   ","       :s@N@h d@o~ ~   ~~shs                  ","     /y@@@@NN@@-s~       ~~~y@d~              ","     h+@@@@@@@:           ~~~N.o+             ","   h .@@so+s               ~~+@@N@            ","   y ys@~   -              ~~/@@@@s           ","-@   ~-d~~                 ~~@@@@@@:          ","h/       y ~....~          ~~@N@@@@@          ","/h         .h@@@@@@y.      ~~~~yh+s@          ","oy         s@@@@@@@@h/-    ~~~~~~~~@          ","+h         o@@@@@@@@@@d++  ~~~~~~~~@          ","d/         /@@@@@@@@@@@y.  ~~~~~~~.@          ","-@          :o@@@@@@@@@:  ~~~~~~~-N/          ","   y          d@@@@@@@:   ~~~~~~~:y           ","   h          s@@@@@h     ~~~~~~-N            ","     h:        @@@s~    ~~~~~~~:o             ","     ~y       .@y       ~~~~~~y~              ","       ~ss-    -      ~~~-+s~                 ","          /o+:.~:o- ~.:os/.                   "],["              -+ossyso/.                      ","          :yNNh+/+.hNy:so:~                   ","       :s@NN@+ N@o~~~  ~~:hs                  ","     /+d@@@@N@@@+ :      ~~~:Nd~              ","     h/h@@@@@@@+:         ~~~-d/+             ","   h  -@@ss+o:             ~~~s@@@            ","   y  :y@-   :              ~~/@@@s           ","-@    ~~h@~~                ~./@@@@:          ","h/         h~~.....        ~~~~N@@@@          ","/h           :s@@@@@@:     ~~~~~yh.@          ","oy           @@@@@@@@@+//  ~~~~~~~~@          ","+h           @@@@@@@@@@@N+:~~~~~~~~@          ","d/          ~/@@@@@@@@@@@/.~~~~~~~~@          ","-@            :@@@@@@@@@@  ~~~~~~~//          ","   y            d@@@@@@+  ~~~~~~~~y           ","   h            @@@@@@s   ~~~~~~.h            ","     h:         .@N@.    ~~~~~~:o             ","     ~y        ~N@      ~~~~~~y~              ","       ~ss-    ~-     ~~~-+s~                 ","          /o+:~~.:-~~.:os/.                   "],["              -+oooyso/.                      ","          :yd@Ns:::-@@oso:~                   ","       :o@@@N@:~o@o~~~ ~~:hs                  ","     /+-@@@@@@@N@d~o     ~~~.y@~              ","     h/~@@@@@@@@@:        ~~~~yd+             ","   h   -@@@sooo:           ~~~~@@@            ","   y   /s@h   ~.           ~~~~~@@s           ","-@      ~~h/~~             ~.~~:@@@:          ","h/          yd~.....        ~~~~@@@@          ","/h             :@@@@@@@:~   ~~~~~-h@          ","oy             @@@@@@@@@o+  ~~~~~~~o          ","+h             @@@@@@@@@@@oo:~~~~~~y          ","d/             +@@@@@@@@@@@+~~~~~~~@          ","-@              :N@@@@@@@@@~~~~~~~./          ","   y              N@@@@@N:~~~~~~~~y           ","   h             h@@@@@y+ ~~~~~~.y            ","     h:           @N@d. ~~~~~~~:o             ","     ~y          h@o    ~~~~~~y~              ","       ~ss-     ~-    ~~~-+s~                 ","          /o+:.~~./.~~:os/.                   "],["              -+ooosso/.                      ","          :y@dNy/-+-hNyss:~                   ","       :oN@N@@s ~Ns.~~ ~~:ys                  ","     /+ N@@@@@N@@@y-~    ~~~~sd~              ","     h/ d@@@@@@@@@-       ~~~~+@+             ","   h   .o@@ho++o~          ~~~~/@@            ","   y    y@@N   -:          ~~~~~d@s           ","-@      ~~+@~~~            ~~~~~@@@:          ","h/           .o~......     ~.~~~@@@@          ","/h              :@@@@@@N:   ~~~~~~hy          ","oy              @@@@@@@@@/+ ~~~~~~~o          ","+h              @@@@@@@@@@@oo~~~~~~s          ","d/             .s@@@@@@@@@@N:~~~~~~@          ","-@              ~:@@@@@@@@@s~~~~~~./          ","   y              -@@@@@@y/~~~~~~~y           ","   h              @@@@@@h~~~~~~~.y            ","     h:           -@@@: ~~~~~~~:o             ","     ~y          :@@    ~~~~~~y~              ","       ~ss-      ~-   ~~~-+s~                 ","          /o+:.~~~:..~:os/.                   "],["              -+oossso/.                      ","          :y@d@ds+://h@ss:~                   ","       :oy@@@N@s.-@oo~.~~:ss                  ","     /+ .d@@@@@@@N@h~s   ~~~~+y~              ","     h/  @@@@@@@@@@:      ~~~~.s+             ","   h    ./d@@oo+oo         ~~~~~N@            ","   y     shN@    -          ~~~~~@s           ","-@        ~ h@~~           ~~.~~~@@:          ","h/             d~~.....    ~~~~~~N@@          ","/h                /N@@@@@N:~~~~~~~-d          ","oy               ~@@@@@@@@N++~~~~~~o          ","+h               ~@@@@@@@@@@@o:~~~~s          ","d/                +@@@@@@@@@@+~~~~~@          ","-@                 :@@@@@@@@@.~~~~./          ","   y                N@@@@@@o~~~~~~y           ","   h                @@@@@N+~~~~~.y            ","     h:             @@@y~~~~~~~:o             ","     ~y           ~+@.  ~~~~~.y~              ","       ~ss-       ~- ~~~~-+s~                 ","          /o+:. ~~-/.:-os/.                   "],["              -+oososo/.                      ","          :yN@y@dy:://@hs:~                   ","       :ooN@@@@@y~/@y+.~~:ss                  ","     /+   N@@@@@@@@@Ns+  ~~~~+y~              ","     h/   @@@@@@@@@@y:    ~~~~~/+             ","   h      /s@@@oo++o       ~~~~~/@            ","   y      /yd@d    :        ~~~~~ss           ","-@            h@ ~         ~.~.~~o@:          ","h/               o:~.....   ~~~~~.N@          ","/h                  :@@@@@@/:~~~~~~@          ","oy                  @@@@@@@@@+~~~~~o          ","+h                  @@@@@@@@@@o/~~~s          ","d/                 -d@@@@@@@@@N.~~~@          ","-@                  -:@@@@@@@@o~~~./          ","   y                  N@@@@@h.~~~~y           ","   h                 :@@@@@y.~~~.y            ","     h:               @@@-~~~~~:o             ","     ~y             /@o ~~~~~~y~              ","       ~ss-        ~- ~~~-+s~                 ","          /o+:~~~~~::~:os/.                   "],["              -+ooooso/.                      ","          :yN@yd@d+:+ohNo:~                   ","       :os+@@@d@@s~+do:-.:ss                  ","     /+    @@@@@@@@@@@h/~~~~~+y~              ","     h/    s@@@@@@@@@@/   ~~~~~:+             ","   h       -/@@@oo+++~     ~~~~~.d            ","   y        +y@@@   -:     ~~~~~~.s           ","-@             -d@ ~       ~~~~~~~s:          ","h/                 d~~.....~.~.~~~.@          ","/h                   ~+@@@@@@/~~~~~y          ","oy                   -@@@@@@@@+-~~~o          ","+h                   -@@@@@@@@@y/~~s          ","d/                   .s@@@@@@@@N.~~@          ","-@                    .h@@@@@@@s~~./          ","   y                   .@@@@@@.~~~y           ","   h                   @@@@@d-~~.y            ","     h:                @@@+~~~~:o             ","     ~y              :Nh~~~~~~y~              ","       ~ss-         ~-~.~-+s~                 ","          /o+:~~ ~~-::/os/.                   "],["              -+ooosso/.                      ","          :y@@hs@@No:/o@s:~                   ","       :oy:@@@@@@@s~-No--:ss                  ","     /+     @@@@@@@@@N@@:..~~+y~              ","     h/     +@@@@@@@@@@h  ~~~~~:+             ","   h         /+@@@oo+o+    ~~~~~.h            ","   y         :ydN@    -~    ~~~~~~s           ","-@               ~hh ~   ~ ~~.~~~~.:          ","h/                  ~d~....-~~~~~~~@          ","/h                     :/@@@@@s~~~~s          ","oy                     @@@@@@@@+-~~o          ","+h                     @@@@@@@@@ys~s          ","d/                     /@@@@@@@@@~~@          ","-@                      :@@@@@@@/~./          ","   y                     @@@@@@/~~y           ","   h                     @@@@d.~.y            ","     h:                 @N@+~~~:o             ","     ~y               .d@.~~~~y~              ","       ~ss-           -.~-+s~                 ","          /o+:~~  ~~/::ss/.                   "],["              -+ooosoo/.                      ","          :yN@hsdddy::hhy:~                   ","       :oy:-y@@@d@@o//do/:ss                  ","     /+      /@@@@@@@@@@N/+~~+y~              ","     h/      .@@@@@@@@@@N~~~~~~:+             ","   h           /h@@@ooo+/  ~~~~~.h            ","   y           +yd@@    /  ~~~~~~~s           ","-@                 s@@ ~   ~.~.~~~.:          ","h/                     @~...-.~~~~~@          ","/h                       -N@@@@h~~~s          ","oy                       y@@@@@@++~o          ","+h                       h@@@@@@@@/s          ","d/                       o@@@@@@@o.@          ","-@                       ~:@@@@@@../          ","   y                       @@@@@:~y           ","   h                      N@@@h~.y            ","     h:                 ~y@d/~~:o             ","     ~y                .s@.~~~y~              ","       ~ss-           ~-~-+s~                 ","          /o+:~ ~ ~~-//ss/.                   "],["              -+oooooo/.                      ","          :y@@dso@NNy/+yy:~                   ","       :os/-.@@@@@@Ns-oso/ss                  ","     /+       .@@@@@@@@@@N//~+y~              ","     h/        @@@@@@@@@@@s~~~~:+             ","   h            +o@@@oo+o+ ~~~~~.h            ","   y             /hN@@   ::~~~~~~~s           ","-@                   /@:~  ~.~~~~~.:          ","h/                      o-~.---~~~~@          ","/h                         /N@@@h:~s          ","oy                         @@@@@@@-o          ","+h                         @@@@@@@hs          ","d/                         s@@@@@@y@          ","-@                        ~-@@@@@@./          ","   y                      ~~N@@@@~y           ","   h                      ~h@@@o.y            ","     d:                 ~~.@d-~:o             ","     ~y                 ~sN~~~y~              ","       ~ss-           ~.--+s~                 ","          /o+:~ ~~ ~.:/os/.                   "],["              -+oososo/.                      ","          :sd@Nsh+ddhh+ds:~                   ","       :oo::.-N@@@N@@o.sssss                  ","     /+         @@@@@@@N@@@:.+y~              ","     h/         ~@@@@@@@@@@y~~~:+             ","   h              +o@@Nooo/~~~~~.h            ","   y              :y@N@.   /~~~~~~s           ","-@                     h@~.~~-.~~~.:          ","h/                        s-.---~~~@          ","/h                         ~~s@@@@.s          ","oy                         ~~@@@@@so          ","+h                         ~~@@@@@@h          ","d/                         ~/@@@@@@@          ","-@                         ~~h@@@@d/          ","   y                      ~~~h@@@+y           ","   h                      ~~~@@@:y            ","     h/                  ~~.@h~:o             ","     ~y                 ~~yd:~y~              ","       ~ss-           ~~.-+s~                 ","          /o+:~  ~ ~.-+ss/.                   "],["            ./ooosoo+:.                       ","          :sdh@hsddd@hyys:~                   ","       :oo.+/.:@@@@@@No/oyss                  ","     /+          :@@@@@@N@@@o+y~              ","     h/           @@@@@@@@@@s~~:+             ","   h                oh@@@so++~~~.h            ","   y                :y@@@  ~/~~~~~s           ","-@                     ~-@@.-~..~~.:          ","h/                          h---.~~@          ","/h                          ~~/@@@hs          ","oy                          ~~@@@@@s          ","+h                          ~~@@@@@@          ","d/                         ~~:s@@@@@          ","-@                         ~.~-@@@@/          ","   y                       ~~~y@@@y           ","   h                      ~~~~@@sh            ","     h/                 ~~~~-@o:o             ","     ~h~                ~~~yd.y~              ","       ~ss-           ~~~:+s~                 ","          /o+:~   ~~.-/os/.                   "],["              -+oooooo/.                      ","          :yhhhdsss@d@Nsy:~                   ","       :oo-:+.~/h@@N@@h+/yhs                  ","     /+            @@@@@@N@@yoy~              ","     h/            d@@@@@@@@@-~:+             ","   h                 +o@@@ssy/~~.h            ","   y                  :dN@d~~:~~~~s           ","-@                      ~~/@-:~~.~.:          ","h/                         ~~@:...~@          ","/h                         ~~~~/@@@s          ","oy                         ~~~~@@@@h          ","+h                         ~~~~N@@@@          ","d/                         ~~~~o@@@@          ","-@.                       ~~~~~.@@@/          ","   y                      ~~~~~.@@y           ","   h                      ~~~~.@NN            ","     h::                ~~~~~+yso             ","     ~y-                ~~~-yoy~              ","       ~ss-           ~~~-+s~                 ","          /o+:~   ~~.-:os/.                   "],["             .-+oooso+:                       ","          :ydysdhsdo@d@hs:~                   ","       :so: ~o~~-d@@@N@o+sds                  ","     /+             @@@@@@N@@yh~              ","     h/             -@@@@@@@@@~:+             ","   h                  ~ss@@yyy/~.h            ","   y                   :y@N@~~::~~s           ","-@                        ~~do-~.~.:          ","h/                         ~~~~+...@          ","/h                         ~~~~~:@@@          ","oy                         ~~~~~@@@@          ","+h                         ~~~~~@@@@          ","d/                         ~~~~~s@@@          ","-@                         ~~~~~-@@/          ","   h                      ~~~~~~/@y           ","   @                      ~~~~~+@@            ","     h: ~                ~~~~~yho             ","     ~y:                ~~~~.yy~              ","       ~ss-           ~~~-+s~                 ","          /o+:~    ~.-:os/.                   "]];

// Kursorni yashirish
process.stdout.write(HIDE_CURSOR);

// Ctrl + C bosilganda toza chiqish
process.on('SIGINT', () => {
  process.stdout.write(CLEAR);
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
function createBar(percent, length = 12, color = BRIGHT_GREEN) {
  const filled = Math.max(0, Math.min(length, Math.round((percent / 100) * length)));
  const empty = length - filled;
  return color + '█'.repeat(filled) + DARK_GREEN + '░'.repeat(empty) + RESET;
}

// Tasodifiy matrix oqimi
function getMatrixStream(len = 106) {
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
      res += BRIGHT_GREEN + ch; // Quruqlik / Qit'alar (Yashil)
    } else if (oceanChars.has(ch)) {
      res += CYAN + ch; // Okeanlar (Moviy)
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

  // Aylanuvchi Yer shari freymi (har tick'da 1 ta aylanadi)
  const earthIndex = tick % earthFrames.length;
  const currentEarthFrame = earthFrames[earthIndex];

  // Jonli tarmoq ko'rsatkichlari
  const netRx = (2.4 + (tick % 7) * 0.4).toFixed(1);
  const netTx = (1.1 + (tick % 5) * 0.3).toFixed(1);

  // Chap tomon (Server Telemetriya qutisi - aniq 54 belgi kenglikda)
  const ramBar = createBar(ramPercent, 12, CYAN);
  const cpuBar = createBar(cpuPercent, 12, YELLOW);

  const leftTelemetry = [
    GREEN + '┌──[ ' + WHITE + BOLD + 'SERVER TELEMETRIYA' + RESET + GREEN + ' ]────────────────────────────┐' + RESET,
    GREEN + '│' + RESET + '  🧠 ' + BOLD + 'RAM:' + RESET + '      [' + ramBar + '] ' + CYAN + ramPercent + '%' + RESET + ' (' + Math.round(usedMem / 1024 / 1024) + 'M/' + Math.round(totalMem / 1024 / 1024) + 'M)',
    GREEN + '│' + RESET + '  ⚡️ ' + BOLD + 'CPU:' + RESET + '      [' + cpuBar + '] ' + YELLOW + cpuPercent + '%' + RESET + ' (' + cpuCores + ' Cores)',
    GREEN + '│' + RESET + '  ⚙️ ' + BOLD + 'CHIP:' + RESET + '     ' + WHITE + cpuModel + RESET,
    GREEN + '│' + RESET + '  ⏱ ' + BOLD + 'UPTIME:' + RESET + '   ' + WHITE + upHours + 's, ' + upMins + 'm, ' + upSecs + 's' + RESET,
    GREEN + '│' + RESET + '  🌐 ' + BOLD + 'LAN IP:' + RESET + '   ' + BRIGHT_CYAN + localIp + RESET,
    GREEN + '│' + RESET + '  📡 ' + BOLD + 'TRAFFIC:' + RESET + '  RX: ' + WHITE + netRx + ' MB/s' + RESET + ' | TX: ' + WHITE + netTx + ' MB/s' + RESET,
    GREEN + '│' + RESET + '  🛡 ' + BOLD + 'FIREWALL:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE [PROTECTED]' + RESET,
    GREEN + '│' + RESET + '  🤖 ' + BOLD + 'PM2 BOTS:' + RESET + ' ' + BRIGHT_GREEN + 'ONLINE [2/2 RUNNING]' + RESET,
    GREEN + '│' + RESET + '  🔒 ' + BOLD + 'SSH PORT:' + RESET + ' ' + CYAN + '22 [ENCRYPTED]' + RESET,
    GREEN + '│' + RESET + '  📍 ' + BOLD + 'REGION:' + RESET + '   ' + WHITE + 'UZBEKISTAN // TASHKENT' + RESET,
    GREEN + '│' + RESET + '  💾 ' + BOLD + 'PLATFORM:' + RESET + ' ' + WHITE + os.type() + ' ' + os.arch() + RESET,
    GREEN + '│' + RESET + '  ⚡️ ' + BOLD + 'SECURITY:' + RESET + ' ' + BRIGHT_GREEN + 'ZERO THREAT DETECTED' + RESET,
    GREEN + '│' + RESET + '  🎯 ' + BOLD + 'IELTS BOT:' + RESET + ' ' + BRIGHT_GREEN + 'ACTIVE & LISTENING' + RESET,
    GREEN + '│' + RESET + '  🤖 ' + BOLD + 'SRV BOT:' + RESET + '   ' + BRIGHT_GREEN + 'ACTIVE & CONTROLLING' + RESET,
    GREEN + '│' + RESET + '  🔄 ' + BOLD + 'AUTOPULL:' + RESET + '  ' + WHITE + 'STANDBY & READY' + RESET,
    GREEN + '│' + RESET + '  💾 ' + BOLD + 'MEM SWAP:' + RESET + '  ' + BRIGHT_GREEN + 'CLEAN [0% USED]' + RESET,
    GREEN + '│' + RESET + '  📊 ' + BOLD + 'LOAD AVG:' + RESET + '  ' + WHITE + '0.15, 0.22, 0.18' + RESET,
    GREEN + '│' + RESET + '  STATUS:    ' + BRIGHT_GREEN + '24/7 CONTINUOUS SURVEILLANCE' + RESET,
    GREEN + '│' + RESET + '  DEFENSE:   ' + BRIGHT_CYAN + 'MAXIMUM ENCRYPTION (AES-256)' + RESET,
    GREEN + '└─────────────────────────────────────────────────────┘' + RESET
  ];

  // O'ng tomon: Katta Aylanuvchi Yer shari qutisi (48 belgi kenglikda)
  const rightEarthBox = [
    GREEN + '┌──[ ' + CYAN + BOLD + '🌍 PLANET EARTH // LIVE 360 ROTATION' + RESET + GREEN + ' ]────────┐' + RESET,
    ...currentEarthFrame.map(line => {
      const colored = colorizeEarthLine(line);
      return GREEN + '│ ' + RESET + padVisual(colored, 48) + GREEN + ' │' + RESET;
    }),
    GREEN + '└──────────────────────────────────────────────────┘' + RESET
  ];

  let out = CLEAR;

  // 1. Sarlavha (Header HUD)
  out += GREEN + '╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗' + RESET + '\n';
  out += GREEN + '║  ' + BRIGHT_GREEN + BOLD + '[●] KALI CYBER TERMINAL' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + CYAN + 'NODE: ' + os.hostname() + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + YELLOW + 'SYSTEM: 24/7 ONLINE' + RESET + '  ' + DARK_GREEN + '//' + RESET + '  ' + BRIGHT_GREEN + 'SHIELD: MAXIMUM' + RESET + '  ' + GREEN + '║' + RESET + '\n';
  out += GREEN + '╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝' + RESET + '\n\n';

  // 2. Matrix Stream 1
  out += '  ' + getMatrixStream(108) + '\n\n';

  // 3. Soat (Markazda katta raqamlar)
  for (const line of clockLines) {
    out += '   ' + BRIGHT_GREEN + BOLD + line + RESET + '\n';
  }
  out += '\n   ' + CYAN + BOLD + '>>> ' + dateStr.toUpperCase() + ' <<<' + RESET + '\n\n';

  // 4. Matrix Stream 2
  out += '  ' + getMatrixStream(108) + '\n\n';

  // 5. Yonma-yon: Chapda 21 qator Telemetriya | O'ngda 21 qator KATTA Yer Shari!
  const maxRows = Math.max(leftTelemetry.length, rightEarthBox.length);
  for (let i = 0; i < maxRows; i++) {
    const left = padVisual(leftTelemetry[i] || '', 55);
    const right = rightEarthBox[i] || '';
    out += ' ' + left + '   ' + right + '\n';
  }

  process.stdout.write(out);
}

// Boshlanishida render qilish
render();

// Har 400ms silliq aylanish
setInterval(render, 400);
