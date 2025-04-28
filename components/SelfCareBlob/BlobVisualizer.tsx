"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BlobVisualizerProps {
  state: "healthy" | "neutral" | "sick";
}

const blobVisuals = {
  healthy: ["#A9F1DF", "#FFBBBB"],
  neutral: ["#E0C3FC", "#8EC5FC"],
  sick: ["#C1C1C1", "#A1A1A1"],
};

const blobShapes = {
  healthy: "M55.3,-57.3C66.4,-41.8,66.8,-20.9,66.5,-0.6C66.1,19.7,65.1,39.4,54.1,51.6C43.1,63.9,22,68.8,2.3,66.1C-17.5,63.5,-35,53.4,-50.7,40.2C-66.4,27,-80.4,10.7,-81.3,-7.7C-82.2,-26.1,-70,-46.6,-53.6,-61.3C-37.1,-75.9,-18.5,-84.7,0.7,-85.4C19.9,-86.2,39.8,-78.9,55.3,-57.3Z",
  neutral: "M60.3,-58.9C76.3,-46.5,86.3,-23.2,84.2,-1.3C82.2,20.7,68.2,41.4,52.2,54.4C36.1,67.4,18.1,72.7,-3.4,76.3C-24.9,80,-49.8,81.9,-61.5,69.6C-73.2,57.2,-71.7,30.6,-66.3,9.3C-61,-12.1,-51.9,-27.9,-41.1,-41.7C-30.2,-55.4,-18.6,-67.1,-2.5,-65.2C13.7,-63.3,27.3,-47.2,60.3,-58.9Z",
  sick: "M53.6,-61.6C66.3,-44.9,72.6,-22.4,72.3,-0.6C72,21.1,65.1,42.2,52.4,58.1C39.8,74,21.4,84.6,1.6,82.7C-18.2,80.8,-36.5,66.3,-52.3,50.1C-68.1,33.9,-81.5,16,-83.1,-3.4C-84.8,-22.8,-74.7,-43.6,-58.7,-59.7C-42.7,-75.8,-21.3,-87.2,0.7,-87.7C22.8,-88.2,45.7,-77.8,53.6,-61.6Z",
};

export default function BlobVisualizer({ state }: BlobVisualizerProps) {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const [start, end] = blobVisuals[state];
  const shape = blobShapes[state];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / 100; // smaller number = less sensitive
      const offsetY = (e.clientY - centerY) / 100;
      setEyeOffset({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 6 }}
    >
      <defs>
        <radialGradient id="gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={start} />
          <stop offset="100%" stopColor={end} />
        </radialGradient>
      </defs>

      {/* Blob background */}
      <motion.path
        fill="url(#gradient)"
        transform="translate(100 100)"
        animate={{ d: shape }}
        transition={{ duration: 1 }}
      />

      {/* Eyes following cursor */}
      <motion.circle
        cx={80 + eyeOffset.x}
        cy={90 + eyeOffset.y}
        r="5"
        fill="black"
      />
      <motion.circle
        cx={120 + eyeOffset.x}
        cy={90 + eyeOffset.y}
        r="5"
        fill="black"
      />

      {/* Mouth */}
      {state === "healthy" && (
        <path
          d="M80,120 Q100,135 120,120"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
        />
      )}
      {state === "neutral" && (
        <line
          x1="85"
          y1="120"
          x2="115"
          y2="120"
          stroke="black"
          strokeWidth="2"
        />
      )}
      {state === "sick" && (
        <path
          d="M80,125 Q100,110 120,125"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
        />
      )}
    </motion.svg>
  );
}
