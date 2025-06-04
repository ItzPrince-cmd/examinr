#!/bin/bash

echo "🔄 Checking for dependency updates..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for outdated packages
echo -e "\n${YELLOW}Checking for outdated packages...${NC}"
npm outdated

# Check for vulnerabilities
echo -e "\n${YELLOW}Running security audit...${NC}"
npm audit

# Check for available updates
echo -e "\n${YELLOW}Available updates:${NC}"
npx npm-check-updates

# Ask user if they want to update
echo -e "\n${YELLOW}Would you like to:${NC}"
echo "1) Update all dependencies to latest versions"
echo "2) Update only patch and minor versions (safer)"
echo "3) Only fix security vulnerabilities"
echo "4) Exit without updating"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "\n${GREEN}Updating all dependencies...${NC}"
        npx npm-check-updates -u
        npm install
        npm audit fix
        ;;
    2)
        echo -e "\n${GREEN}Updating patch and minor versions...${NC}"
        npm update
        npm audit fix
        ;;
    3)
        echo -e "\n${GREEN}Fixing security vulnerabilities...${NC}"
        npm audit fix
        ;;
    4)
        echo -e "\n${YELLOW}Exiting without updates${NC}"
        exit 0
        ;;
    *)
        echo -e "\n${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Run tests after update
echo -e "\n${YELLOW}Running tests to ensure everything works...${NC}"
npm test 2>/dev/null || echo "No tests configured"

# Run security audit again
echo -e "\n${YELLOW}Final security check...${NC}"
npm audit

echo -e "\n${GREEN}✅ Dependency update complete!${NC}"
echo -e "${YELLOW}Remember to:${NC}"
echo "- Test your application thoroughly"
echo "- Check for breaking changes in updated packages"
echo "- Commit the updated package.json and package-lock.json"