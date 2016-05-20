#!/usr/bin/env bash
npm install
grunt build
sudo forever restart server.js
sudo forever restart scheduler.js

