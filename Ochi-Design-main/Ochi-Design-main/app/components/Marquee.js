'use client'
import React from 'react'
import { motion } from "framer-motion"
function Marquee() {
  return (
    <div data-scroll data-scroll-section data-scroll-speed=".1" className='w-full py-6 sm:py-8 md:py-12 lg:py-16 xl:py-24 bg-[#004d43] border-zinc-500 rounded-t-xl sm:rounded-t-2xl'>
        <div className='flex justify-between border-y border-zinc-500 whitespace-nowrap overflow-hidden'>
            {["We are Ochi","We are Ochi","We are Ochi"].map((items,index)=>{
                return (
                  <motion.h1
                    key={index}
                    initial={{x:0}}
                    animate={{x:"-100%"}}
                    transition={{ease:"linear", repeat:Infinity , duration:5}}
                    className='leading-none text-[25vw] sm:text-[28vw] md:text-[30vw] lg:text-[28vw] xl:text-[30vw] pr-6 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-20 font-[Founders_Grotesk_X-Cond] -mb-[7vw] sm:-mb-[8vw] md:-mb-[8vw] lg:-mb-[9vw] pt-2 sm:pt-3 md:pt-4 lg:pt-5'
                  >
                    {items}
                  </motion.h1>
                )
            })}
        </div>
      
    </div>
  )
}

export default Marquee
