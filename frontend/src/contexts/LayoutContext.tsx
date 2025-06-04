import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  );
};
