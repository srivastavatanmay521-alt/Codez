#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

install_panel() {
    echo -e "\n${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║      Installing CodeZ Dependencies   ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}\n"

    echo -e "${PURPLE}[→] Updating system packages...${NC}"
    sudo apt update -qq

    echo -e "${PURPLE}[→] Installing curl & git...${NC}"
    sudo apt install curl git -y -qq

    echo -e "${PURPLE}[→] Setting up Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
    sudo apt install -y nodejs -qq

    echo -e "${PURPLE}[→] Installing PM2 process manager...${NC}"
    sudo npm install -g pm2 --silent

    echo -e "\n${CYAN}[→] Cloning CodeZ panel from GitHub...${NC}"

    if [ -d "CodeZ" ]; then
        echo -e "${YELLOW}[!] 'CodeZ' folder already exists.${NC}"
        echo -e "${YELLOW}    Delete it first, or choose Update (Option 2).${NC}"
        return
    fi

    git clone https://github.com/srivastavatanmay521-alt/Codez CodeZ

    cd CodeZ || { echo -e "${RED}[✗] Failed to enter directory!${NC}"; return; }

    echo -e "${PURPLE}[→] Installing node modules...${NC}"
    npm install

    echo -e "${PURPLE}[→] Creating admin user...${NC}"
    npm run createuser

    echo -e "${PURPLE}[→] Building panel (this may take a moment)...${NC}"
    npm run build

    echo -e "${PURPLE}[→] Starting with PM2...${NC}"
    pm2 start ecosystem.config.cjs
    pm2 save

    echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓  CodeZ Panel installed successfully!  ║${NC}"
    echo -e "${GREEN}║     CodeZ | Game Server Management       ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"

    cd ..
}

update_panel() {
    echo -e "\n${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║         Updating CodeZ Panel         ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}\n"

    if [ -d "CodeZ" ]; then
        cd CodeZ || { echo -e "${RED}[✗] Failed to enter directory!${NC}"; return; }

        echo -e "${PURPLE}[→] Fetching latest updates from GitHub...${NC}"
        git stash
        git pull

        echo -e "${PURPLE}[→] Installing updated dependencies...${NC}"
        npm install

        echo -e "${PURPLE}[→] Rebuilding panel...${NC}"
        npm run build

        echo -e "${PURPLE}[→] Restarting services...${NC}"
        pm2 restart all
        pm2 save

        echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║   ✓  CodeZ Panel updated & restarted!   ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"

        cd ..
    else
        echo -e "${RED}[✗] 'CodeZ' directory not found!${NC}"
        echo -e "${RED}    Please install the panel first (Option 1).${NC}"
    fi
}

# Main menu loop
while true; do
    echo -e "\n${PURPLE}╔══════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║   ░▒▓█  CodeZ Panel Manager  █▓▒░   ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════╝${NC}"
    echo -e "  ${CYAN}[1]${NC} Install Panel"
    echo -e "  ${CYAN}[2]${NC} Update Panel"
    echo -e "  ${RED}[3]${NC} Exit"
    echo -e "${PURPLE}════════════════════════════════════════${NC}"

    read -p "  Choose an option (1/2/3): " choice

    case $choice in
        1)
            install_panel
            ;;
        2)
            update_panel
            ;;
        3)
            echo -e "${YELLOW}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}[!] Invalid option! Please enter 1, 2, or 3.${NC}"
            ;;
    esac
done
