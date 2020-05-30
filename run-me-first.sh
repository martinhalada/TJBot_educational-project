#!/bin/bash

sudo apt-get install espeak
cd Desktop
git clone https://github.com/tjbotcz/tjbotcz_lite.git 
cd tjbotcz_lite
npm install
cd ~/
if grep -Fq "ipButton.js" ~/.bashrc
then
    echo "the ipButton is already setup in bashrc"
else
    echo "ipButton autostart added"
    echo "# automatically run ipButton program" >> ~/.bashrc
    echo "sudo node ~/Desktop/tjbotcz_lite/ipButton.js" >> ~/.bashrc
fi
cd Desktop/tjbotcz_lite
sudo node easy.js

