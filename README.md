#### /etc/default/grub

```
# If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'

GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash vga=current fbcon=nodefer vt.cur_default=1 i915.fastboot=1"
GRUB_CMDLINE_LINUX="quiet"

# Uncomment to enable BadRAM filtering, modify to suit your needs
# This works with Linux (no patch required) and with any kernel that obtains
# the memory map information from GRUB (GNU Mach, kernel of FreeBSD ...)
#GRUB_BADRAM="0x01234567,0xfefefefe,0x89abcdef,0xefefefef"

# Uncomment to disable graphical terminal (grub-pc only)
#GRUB_TERMINAL=console

# The resolution used on graphical terminal
# note that you can use only modes which your graphic card supports via VBE
# you can see them in real GRUB with the command `vbeinfo'
#GRUB_GFXMODE=640x480

# Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
#GRUB_DISABLE_LINUX_UUID=true

# Uncomment to disable generation of recovery mode menu entries
#GRUB_DISABLE_RECOVERY="true"

# Uncomment to get a beep at grub start
#GRUB_INIT_TUNE="480 440 1"
```

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

DISPLAY=:0.0 /usr/bin/chromium-browser file:///home/wubmans/test2.html --kiosk --user-data-dir="/home/wubmans/cb1" &
DISPLAY=:0.1 /usr/bin/chromium-browser file:///home/wubmans/test1.html --kiosk --user-data-dir="/home/wubmans/cb0"
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

#### time control

```
timedatectl set-timezone Europe/Amsterdam
```

#### Plymouth

```
sudo apt install plymouth-theme-ubuntu-logo
sudo ln -s  /usr/share/plymouth/themes/vk-d/vk-d.plymouth /etc/alternatives/default.plymouth
sudo ln -s  /etc/alternatives/default.plymouth /usr/share/plymouth/themes/default.plymouth
sudo update-initramfs -u
```
