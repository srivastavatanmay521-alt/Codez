#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

install_panel() {
    echo -e "\n${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║      Installing CodeZ Panel          ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}\n"

    # Only run apt update if we have sudo and it works
    if command -v sudo &>/dev/null && command -v apt &>/dev/null; then
        echo -e "${PURPLE}[→] Updating package lists...${NC}"
        sudo apt-get update -qq 2>/dev/null || true

        # Install curl only if missing
        if ! command -v curl &>/dev/null; then
            echo -e "${PURPLE}[→] Installing curl...${NC}"
            sudo apt-get install -y curl 2>/dev/null || true
        fi

        # Install git only if missing
        if ! command -v git &>/dev/null; then
            echo -e "${PURPLE}[→] Installing git...${NC}"
            sudo apt-get install -y --no-upgrade git 2>/dev/null || true
        fi
    fi

    # Check that git is available
    if ! command -v git &>/dev/null; then
        echo -e "${RED}[✗] git is not available. Please install git manually and retry.${NC}"
        return 1
    fi

    # Install Node.js if missing
    if ! command -v node &>/dev/null; then
        echo -e "${PURPLE}[→] Installing Node.js 20.x...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
        sudo apt-get install -y nodejs 2>/dev/null || true
    else
        echo -e "${GREEN}[✓] Node.js $(node -v) already installed.${NC}"
    fi

    # Install PM2 if missing
    if ! command -v pm2 &>/dev/null; then
        echo -e "${PURPLE}[→] Installing PM2...${NC}"
        sudo npm install -g pm2 --silent 2>/dev/null || npm install -g pm2 --silent
    else
        echo -e "${GREEN}[✓] PM2 already installed.${NC}"
    fi

    echo -e "\n${CYAN}[→] Cloning CodeZ panel...${NC}"

    if [ -d "CodeZ" ]; then
        echo -e "${YELLOW}[!] 'CodeZ' folder already exists.${NC}"
        echo -e "${YELLOW}    Delete it first, or choose Update (Option 2).${NC}"
        return
    fi

    git clone https://github.com/srivastavatanmay521-alt/Codez CodeZ
    if [ $? -ne 0 ]; then
        echo -e "${RED}[✗] git clone failed! Check your internet connection.${NC}"
        return 1
    fi

    cd CodeZ || { echo -e "${RED}[✗] Failed to enter directory!${NC}"; return 1; }

    echo -e "${PURPLE}[→] Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[✗] npm install failed!${NC}"
        cd ..
        return 1
    fi

    echo -e "${PURPLE}[→] Creating admin user...${NC}"
    npm run createuser

    echo -e "${PURPLE}[→] Building panel...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}[✗] Build failed! Check errors above.${NC}"
        cd ..
        return 1
    fi

    echo -e "${PURPLE}[→] Starting with PM2...${NC}"
    pm2 start ecosystem.config.cjs
    pm2 save

    echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓  CodeZ Panel installed successfully!  ║${NC}"
    echo -e "${GREEN}║     Open: http://YOUR_IP:6767             ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"

    cd ..
}

update_panel() {
    echo -e "\n${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║         Updating CodeZ Panel         ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}\n"

    if [ -d "CodeZ" ]; then
        cd CodeZ || { echo -e "${RED}[✗] Failed to enter directory!${NC}"; return 1; }

        echo -e "${PURPLE}[→] Pulling latest changes...${NC}"
        git stash
        git pull

        echo -e "${PURPLE}[→] Installing updated dependencies...${NC}"
        npm install

        echo -e "${PURPLE}[→] Rebuilding panel...${NC}"
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}[✗] Build failed! Check errors above.${NC}"
            cd ..
            return 1
        fi

        echo -e "${PURPLE}[→] Restarting with PM2...${NC}"
        pm2 restart all
        pm2 save

        echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║   ✓  CodeZ Panel updated & restarted!   ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"

        cd ..
    else
        echo -e "${RED}[✗] 'CodeZ' directory not found!${NC}"
        echo -e "${RED}    Run Install (Option 1) first.${NC}"
    fi
}

# Main menu
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
        1) install_panel ;;
        2) update_panel ;;
        3) echo -e "${YELLOW}Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${RED}[!] Invalid option!${NC}" ;;
    esac
done
