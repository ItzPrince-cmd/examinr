import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement>
      { src: string;
  alt: string;
  placeholder?: string;
  className?: string
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="%23f3f4f6"/%3E%3C/svg%3E',
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef) { 
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { 
              setIsInView(true);
              observer.unobserve(entry.target);
            }
          });
        }, 
        { 
          threshold: 0.01, 
          rootMargin: '50px' 
        }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && observer.disconnect) { 
        observer.disconnect();
      }
    };
  }, [imageRef]);
  useEffect(() => {
    if (isInView && src) { 
      const imageLoader = new Image();
      imageLoader.src = src;
      imageLoader.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    } 
  }, [isInView, src]);
  return (
    <img 
      ref={setImageRef} 
      src={imageSrc} 
      alt={alt} 
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )} 
      loading="lazy" 
      {...props} 
    />
  );
};

export default LazyImage;
