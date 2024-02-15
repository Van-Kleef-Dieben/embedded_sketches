#### .xinitrc

```
#!/bin/sh

# /etc/X11/xinit/xinitrc
#
# global xinitrc file, used by all X sessions started by xinit (startx)

# invoke global X session script

xset -dpms
xset s off
xset s noblank

unclutter -idle 0.001 -root &

DISPLAY=:0.0 /usr/bin/chromium-browser file:///home/wubmans/test2.html --start-fullscreen --kiosk --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic --user-data-dir="/home/wubmans/cb1" &
DISPLAY=:0.1 /usr/bin/chromium-browser file:///home/wubmans/test1.html --start-fullscreen --kiosk --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic --user-data-dir="/home/wubmans/cb0"
```

#### .bash_profile / .profile

```
if [[ -z "$DISPLAY" ]] && [[ $(tty) = /dev/tty1 ]]; then
        . startx -- vt1 &> /dev/null
        logout
fi
```

#### /etc/X11/xorg.conf.d/10-monitor.conf

```
Section "ServerLayout"
        Identifier "Layout"
        Screen "Screen0" 0 0
        Screen "Screen1" RightOf "Screen0"
EndSection

Section "Monitor"
   Identifier   "Monitor0"
   VendorName   "Monitor Vendor"
   ModelName    "Monitor Model"
   Option       "Rotate" "left"
EndSection

Section "Monitor"
   Identifier   "Monitor1"
   VendorName   "Monitor Vendor"
   ModelName    "Monitor Model"
   Option       "Rotate" "left"
EndSection

Section "Device"
        Identifier "Device0"
        Driver "intel"
        BusID "PCI:0:2:0"
        Option "ZaphodHeads" "DP2"
        Screen 0
EndSection

Section "Device"
        Identifier "Device1"
        Driver "intel"
        BusID "PCI:0:2:0"
        Option "ZaphodHeads" "DP3"
        Screen 1
EndSection

Section "Screen"
        Identifier "Screen0"
        Device "Device0"
        Monitor "Monitor0"
EndSection

Section "Screen"
        Identifier "Screen1"
        Device "Device1"
        Monitor "Monitor1"
EndSection
```

##### setup autologin so it acts as a kiosk
```
mkdir /etc/systemd/system/getty@tty1.service.d/
nano /etc/systemd/system/getty@tty1.service.d/override.conf
    [Service]
    Type=simple
    ExecStart=
    ExecStart=-/sbin/agetty --skip-login --nonewline --noissue --autologin $USERNAME --noclear %I $TERM
```
Enable:

```
 systemctl -f enable multi-user.target
```

#### don't wait for network

https://askubuntu.com/questions/972215/a-start-job-is-running-for-wait-for-network-to-be-configured-ubuntu-server-17-1

```
# This is the network config written by 'subiquity'
network:
  ethernets:
    eno1:
      dhcp4: true
      optional: true
  version: 2
```

```
sudo netplan apply
```
