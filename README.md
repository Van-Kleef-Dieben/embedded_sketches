#### bash_profile

```
if [[ -z "$DISPLAY" ]] && [[ $(tty) = /dev/tty1 ]]; then
        . startx
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

#### Stack overflow answer

# I started with just Ubuntu Server, so first install basic Xorg packages
apt-get install xserver-xorg-core -y
# next install openbox, it is pretty basic window manager
apt-get install openbox -y
# install xinit and Chromium, you can pick your browser but pls don't ask me details for them
apt-get install xinit -y
apt-get install chromium -y
# setup autologin so it acts as a kiosk
mkdir /etc/systemd/system/getty@tty1.service.d/
nano /etc/systemd/system/getty@tty1.service.d/override.conf
    [Service]
    Type=simple
    ExecStart=
    ExecStart=-/sbin/agetty --autologin YourUsername --noclear %I 38400 linux
# create or modify .profile script in your /home/YopurUsername to start X on login
nano .profile
    #Startx Automatically
    if [[ -z "$DISPLAY" ]] && [[ $(tty) = /dev/tty1 ]]; then
        . startx
        logout
    fi
# in same location create or edit .xinitrc which will start your browser, eg, Chromium
nano .xinitrc
    #!/bin/sh
    xset -dpms
    xset s off
    xset s noblank
    # the following starts Chromium in kiosk/fullscreen and forces FullHD size, disables bunch of toolbars and features etc; modify this or hte Chromium profile to lock it down to your liking, but that's more a question on it's own
    chromium https://www.bing.com --window-size=1920,1080 --start-fullscreen --kiosk --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic
reboot
