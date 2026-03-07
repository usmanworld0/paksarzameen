'use client'
import React, { useEffect, useState } from 'react'

const Eyes = () => {
   const [rotate, setRotate] = useState(0);
   const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      let deltaX = mouseX - window.innerWidth / 2;
      let deltaY = mouseY - window.innerHeight / 2;
      var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 180);

      // Calculate pupil position (move towards mouse direction)
      // Normalize the distance to keep pupil within eye bounds
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 15; // Maximum distance pupil can move from center
      const normalizedDistance = Math.min(distance / 100, 1); // Normalize based on screen distance
      
      const pupilX = (deltaX / distance) * maxDistance * normalizedDistance || 0;
      const pupilY = (deltaY / distance) * maxDistance * normalizedDistance || 0;
      
      setPupilPosition({ x: pupilX, y: pupilY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div className='eyes w-full h-screen overflow-hidden relative'>
      <div data-scroll data-scroll-section data-scroll-speed="-.7" className='absolute inset-0 h-full w-full bg-cover bg-center bg-[url("https://ochi.design/wp-content/uploads/2022/05/Top-Viewbbcbv-1-scaled.jpg")]'></div>
      <div className='relative top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4'>
        <div className='w-[25vw] h-[25vw] sm:w-[20vw] sm:h-[20vw] md:w-[18vw] md:h-[18vw] lg:w-[15vw] lg:h-[15vw] max-w-[150px] max-h-[150px] rounded-full bg-zinc-200 flex justify-center items-center overflow-hidden'>
          <div className='relative w-2/3 h-2/3 rounded-full bg-zinc-900 flex justify-center items-center overflow-hidden'>
            <div 
              style={{
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`
              }} 
              className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-zinc-200 transition-transform duration-100 ease-out'
            ></div>
          </div>
        </div>
        <div className='w-[25vw] h-[25vw] sm:w-[20vw] sm:h-[20vw] md:w-[18vw] md:h-[18vw] lg:w-[15vw] lg:h-[15vw] max-w-[150px] max-h-[150px] rounded-full bg-zinc-200 flex justify-center items-center overflow-hidden'>
          <div className='relative w-2/3 h-2/3 rounded-full bg-zinc-900 flex justify-center items-center overflow-hidden'>
            <div 
              style={{
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`
              }} 
              className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-zinc-200 transition-transform duration-100 ease-out'
            ></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Eyes
