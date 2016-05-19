#!/usr/bin/env bash
git pull
npm install
grunt build
forever restart server.js
forever restart scheduler.js
