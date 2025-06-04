#!/bin/bash

# Remove unused Chakra UI packages
echo "Removing unused Chakra UI packages..."
npm uninstall @chakra-ui/accordion @chakra-ui/alert @chakra-ui/avatar @chakra-ui/breadcrumb @chakra-ui/button @chakra-ui/card @chakra-ui/checkbox @chakra-ui/color-mode @chakra-ui/form-control @chakra-ui/icons @chakra-ui/input @chakra-ui/layout @chakra-ui/menu @chakra-ui/modal @chakra-ui/popover @chakra-ui/progress @chakra-ui/provider @chakra-ui/radio @chakra-ui/react @chakra-ui/react-env @chakra-ui/select @chakra-ui/skeleton @chakra-ui/slider @chakra-ui/spinner @chakra-ui/stat @chakra-ui/switch @chakra-ui/system @chakra-ui/table @chakra-ui/tabs @chakra-ui/tag @chakra-ui/textarea @chakra-ui/theme @chakra-ui/theme-tools @chakra-ui/toast @chakra-ui/tooltip @emotion/react @emotion/styled

# Remove react-icons if not used (we're using lucide-react)
echo "Removing react-icons..."
npm uninstall react-icons

echo "Bundle optimization complete!"