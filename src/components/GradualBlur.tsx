"use client";

import React from 'react';

interface GradualBlurProps {
  target?: "parent" | string;
  position?: "top" | "bottom" | "left" | "right";
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: "linear" | "bezier";
  exponential?: boolean;
  opacity?: number;
}

const GradualBlur: React.FC<GradualBlurProps> = ({
  position = "bottom",
  height = "100%",
  strength = 10,
  divCount = 10,
  curve = "linear",
  exponential = false,
  opacity = 1,
}) => {
  const blurLayers = [];

  for (let i = 1; i <= divCount; i++) {
    let progress = i / divCount;

    if (curve === "bezier") {
      progress = progress * progress * (3 - 2 * progress); // smoothstep-like
    }

    if (exponential) {
      progress = Math.pow(progress, 2);
    }

    const blurValue = progress * strength;
    
    // Calculate the percentage where this blur layer starts and ends
    // We create a mask that reveals more of the blur as we go
    const maskStart = ((i - 1) / divCount) * 100;
    const maskEnd = (i / divCount) * 100;

    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      backdropFilter: `blur(${blurValue}px)`,
      WebkitBackdropFilter: `blur(${blurValue}px)`,
      pointerEvents: 'none',
      maskImage: `linear-gradient(to ${position}, transparent ${maskStart}%, black ${maskEnd}%)`,
      WebkitMaskImage: `linear-gradient(to ${position}, transparent ${maskStart}%, black ${maskEnd}%)`,
      opacity: opacity,
    };

    blurLayers.push(<div key={i} style={layerStyle} />);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position]: 0,
        height: height,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {blurLayers}
    </div>
  );
};

export default GradualBlur;
