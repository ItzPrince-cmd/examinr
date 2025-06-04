import React, { useState } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2, Move } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

  interface DraggableWidgetProps { id: string;
  title?: string;
  children: React.ReactNode;
  isVisible: boolean;
    position: { x: number;
  y: number };

  isMinimized?: boolean;
  onClose: () => void;
    onPositionChange: (position: { x: number;
  y: number }) => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  showControls?: boolean;
  zIndex?: number;
  sidebarOpen?: boolean
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  title,
  children,
  isVisible,
  position,
  isMinimized = false,
  onClose,
  onPositionChange,
  onMinimize,
  onMaximize,
  className,
  showControls = true,
  zIndex = 9999,
  sidebarOpen = true
    }) => {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Define safe boundaries 
  const SIDEBAR_WIDTH = sidebarOpen ? 256 : 0;
  const TOP_NAV_HEIGHT = 80;
  const MARGIN = 20;
  const BOTTOM_MARGIN = 100; // Account for bottom controls and spacing 
  const MIN_WIDGET_SIZE = 100; // Minimum widget size to ensure visibility 
  
  // Provide default position if undefined 
  const safePosition = position || {
    x: SIDEBAR_WIDTH + MARGIN,
    y: TOP_NAV_HEIGHT + MARGIN
  };

    const handleDragEnd = (event: any, info: any) => {
      setIsDragging(false);
      const newPosition = {
        x: safePosition.x + info.offset.x,
        y: safePosition.y + info.offset.y
      };
      onPositionChange(newPosition);
    };

  if (!isVisible) return null;

  return (
    <motion.div 
      key={id} 
      drag 
      dragControls={dragControls} 
      dragMomentum={false} 
      dragElastic={0.1} 
      dragConstraints={{
        left: SIDEBAR_WIDTH + MARGIN - safePosition.x,
        right: window.innerWidth - MIN_WIDGET_SIZE - MARGIN - safePosition.x,
        top: TOP_NAV_HEIGHT + MARGIN - safePosition.y,
        bottom: window.innerHeight - MIN_WIDGET_SIZE - BOTTOM_MARGIN - safePosition.y
      }} 
      onDragStart={() => setIsDragging(true)} 
      onDragEnd={handleDragEnd} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{
        opacity: 1,
        scale: 1,
        x: safePosition.x,
        y: safePosition.y
      }} 
      exit={{ opacity: 0, scale: 0.8 }} 
      transition={{ type: "spring", damping: 25, stiffness: 300 }} 
      className={cn(
        "fixed",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )} 
      style={{
        zIndex: isDragging ? zIndex + 1000 : zIndex,
        touchAction: 'none'
      }} 
    >
      <div className={cn("relative", isDragging && "opacity-90" )}>
      {
    /* Widget Controls */} {showControls && (isHovered || isDragging) && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -top-8 right-0 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border" >
      {
      /* Drag Handle */
      }
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-6 w-6 cursor-move" 
        onPointerDown={(e) => {
          dragControls.start(e);
        }} 
      >
        <Move className="h-3 w-3" />
      </Button>
      {
      /* Minimize/Maximize */} {(onMinimize || onMaximize) && ( <Button size="icon" variant="ghost" className="h-6 w-6" onClick={isMinimized ? onMaximize : onMinimize} >{isMinimized ? ( <Maximize2 className="h-3 w-3" /> ) : ( <Minimize2 className="h-3 w-3" /> )}
      </Button> )} {
      /* Close */
      }<Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose} ><X className="h-3 w-3" />
    </Button>
    </motion.div> )} {
    /* Widget Content */
    }
      <motion.div animate={{height: isMinimized ? 'auto' : 'auto',
      scale: isMinimized ? 0.9 : 1}} transition={{ type:"spring", damping: 20, stiffness: 300 }} >{isMinimized && title ? ( <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border"><p className="text-sm font-medium">
      {title}
    </p>
  </div> ) : ( children )}
    </motion.div>
      </div>
    </motion.div>
  );
};
