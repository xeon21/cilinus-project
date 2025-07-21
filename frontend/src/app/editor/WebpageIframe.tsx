'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const IframeWrapper = styled.div<{ $scale: number; $height: number }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: white;
  
  iframe {
    width: 1920px;
    height: ${props => props.$height}px;
    border: none;
    transform-origin: top left;
    transform: scale(${props => props.$scale});
    position: absolute;
    top: 0;
    left: 0;
  }
`;

interface WebpageIframeProps {
  srcDoc: string;
  containerWidth?: number;
  containerHeight?: number;
  canvasHeight?: number;
}

export const WebpageIframe: React.FC<WebpageIframeProps> = ({ 
  srcDoc, 
  containerWidth, 
  containerHeight,
  canvasHeight = 158 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Process the HTML content to ensure proper viewport settings
  const processedSrcDoc = React.useMemo(() => {
    // Remove any existing viewport meta tags
    let processed = srcDoc.replace(
      /<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/gi,
      ''
    );
    
    // Add our custom viewport and scaling styles
    const customStyles = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 1920px;
          min-width: 1920px;
          transform-origin: top left;
        }
      </style>
    `;
    
    // Insert custom styles into the head
    if (processed.includes('</head>')) {
      processed = processed.replace('</head>', customStyles + '</head>');
    } else if (processed.includes('<body')) {
      processed = processed.replace('<body', customStyles + '<body');
    } else {
      processed = customStyles + processed;
    }
    
    return processed;
  }, [srcDoc]);
  
  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const containerWidth = wrapperRef.current.clientWidth;
        const contentWidth = 1920; // Fixed width of the HTML content
        const newScale = containerWidth / contentWidth;
        setScale(newScale);
      }
    };
    
    updateScale();
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Handle iframe load to ensure content is properly sized
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          // Force the body to be 1920px wide
          iframeDoc.body.style.width = '1920px';
          iframeDoc.body.style.minWidth = '1920px';
          iframeDoc.body.style.margin = '0';
          iframeDoc.body.style.padding = '0';
          
          // Force HTML element as well
          const htmlElement = iframeDoc.documentElement;
          htmlElement.style.width = '1920px';
          htmlElement.style.minWidth = '1920px';
        }
      } catch (e) {
        // Cross-origin restrictions might prevent access
        console.warn('Could not access iframe content:', e);
      }
    }
  };
  
  return (
    <IframeWrapper ref={wrapperRef} $scale={scale} $height={canvasHeight}>
      <iframe 
        ref={iframeRef}
        srcDoc={processedSrcDoc} 
        title="웹페이지 콘텐츠"
        sandbox="allow-scripts allow-same-origin"
        onLoad={handleIframeLoad}
      />
    </IframeWrapper>
  );
};