#!/usr/bin/env bash
npm install
grunt build
sudo su
forever restart server.js
forever restart scheduler.js
exit