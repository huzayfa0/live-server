#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"
git pull origin main
bash start_dashboard.sh
