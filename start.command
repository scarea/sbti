#!/bin/zsh
cd "$(dirname "$0")"
python3 -m http.server 5173 &
SERVER_PID=$!
sleep 1
open http://localhost:5173
wait $SERVER_PID
