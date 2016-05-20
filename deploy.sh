#!/usr/bin/env bash
npm install
grunt build
forever restart server.js
forever restart scheduler.js
