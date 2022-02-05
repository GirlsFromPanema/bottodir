Echo off
title Bottodir DevOps
color 4
cls
Echo Bottodir Dev - Panel
Echo ============================Bottodir Panel============================
Echo 1 Install Modules           Installs Required modules to load app!  (AFTER INSTALL RELAUNCH APP)          
Echo 2 Start Node App            Launches Gen on [PORT Specified] - DC API
Echo 3 Nodemon Setup             Required downloads of Nodemon (Server)
Echo 4 Exit Launcher/Close       Closes this menu
Echo =====================================================================
Choice /C 1234 /M "Select a choice below "

If Errorlevel 5 Goto 5
If Errorlevel 4 Goto 4
If Errorlevel 3 Goto 3
If Errorlevel 2 Goto 2
If Errorlevel 1 Goto 1

Goto End


:4
:End

:3
npm i nodemon
pause
:End

:2
node .
pause
:End

:1
npm install
pause
:End
