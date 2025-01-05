#!/bin/sh

# /etc/X11/xinit/xinitrc
#
# global xinitrc file, used by all X sessions started by xinit (startx)

# invoke global X session script

xset -dpms
xset s off
xset s noblank

unclutter -idle 0.01 -root &

#DISPLAY=:0.0 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk --user-data-dir="/home/wubmans/cb0" &
#DISPLAY=:0.1 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk --user-data-dir="/home/wubmans/cb1" &
#DISPLAY=:0.2 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk 

DISPLAY=:0.0 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk --user-data-dir="/home/wubmans/cb0" --window-size=1680,1050 &
DISPLAY=:0.1 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk --user-data-dir="/home/wubmans/cb1" --window-size=1680,1050 &
DISPLAY=:0.2 /usr/bin/chromium-browser file:///home/wubmans/tempus.html --kiosk --user-data-dir="/home/wubmans/cb2" --window-size=1680,1050
