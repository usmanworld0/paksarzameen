'use client'
import { motion } from "framer-motion"
import React, { useState } from 'react'
import { FaCircle } from "react-icons/fa";

const Featured = () => {
 
   const[isHovering1,setHovering1]=useState(false)
   const[isHovering2,setHovering2]=useState(false)
  
  // ensure only one visible: derive booleans
  const show1 = isHovering1 && !isHovering2;
  const show2 = isHovering2 && !isHovering1;
  
  return (
    
    <div data-scroll data-scroll-section data-scroll-speed="0" className='w-full py-8 sm:py-12 md:py-16 lg:py-20 relative'>
      <div className='px-4 sm:px-6 md:px-10 border-b pb-4 sm:pb-6 md:pb-8 lg:pb-10 border-zinc-700 w-full'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light'>Featured projects</h1> </div>
      
      {/* Centered text overlays */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none'>
        <h1 className='flex leading-[10vw] sm:leading-[12vw] md:leading-[7.5vw] text-[10vw] sm:text-[12vw] md:text-7xl lg:text-8xl xl:text-9xl uppercase font-[Founders_Grotesk_X-Cond] font-medium text-[#CDEA68]'>
          {"SALIENCE LABS".split("").map((item,index)=>{
            return <motion.span key={index} initial={{y:"100%", opacity:0}} animate={show1 ? ({y:"0%", opacity:1}) :({y:"100%", opacity:0})} transition={{ease:[0.22,1,0.36,1],delay:index*.06}} className='inline-block'>{item}</motion.span>
          })}
        </h1>
      </div>
      
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none'>
        <h1 className='flex leading-[10vw] sm:leading-[12vw] md:leading-[7.5vw] text-[10vw] sm:text-[12vw] md:text-7xl lg:text-8xl xl:text-9xl uppercase font-[Founders_Grotesk_X-Cond] font-medium text-[#CDEA68]'>
          {"CARDBOARD SPACESHIP".split("").map((item,index)=>{
            return <motion.span key={index} initial={{y:"100%", opacity:0}} animate={show2 ? ({y:"0%", opacity:1}) :({y:"100%", opacity:0})} transition={{ease:[0.22,1,0.36,1],delay:index*.06}} className='inline-block'>{item}</motion.span>
          })}
        </h1>
      </div>
      
      <div className='px-4 sm:px-6 md:px-10 w-full flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7 pt-6 sm:pt-8 md:pt-10'>
       
        <div  onMouseEnter={()=>setHovering1(true)} onMouseLeave={()=>{setHovering1(false)}} className='card w-full lg:w-1/2 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]'>
          <div className='text flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-[1vw]'> <FaCircle className="text-[10px] sm:text-[12px]" /> SALIENCE LABS</div>
          <div className='mt-3 sm:mt-4 md:mt-7 rounded-xl sm:rounded-2xl image w-full h-full bg-[url("https://ochi.design/wp-content/uploads/2025/02/Salience_Website_cover-1326x1101.png")] bg-cover bg-center relative'> 
          </div>

        </div>
        
        <div onMouseEnter={()=>setHovering2(true)} onMouseLeave={()=>{setHovering2(false)}} className='card w-full lg:w-1/2 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]'>
          <div className='text flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-[1vw]'> <FaCircle className="text-[10px] sm:text-[12px]" /> CARDBOARD SPACESHIP</div>
          <div className='mt-3 sm:mt-4 md:mt-7 rounded-xl sm:rounded-2xl image w-full h-full bg-[url("https://ochi.design/wp-content/uploads/2024/08/CS_Website_1-1326x1101.png")] bg-cover bg-center relative'>
           </div>

        </div>
      </div>
    </div>
  )
}

export default Featured
