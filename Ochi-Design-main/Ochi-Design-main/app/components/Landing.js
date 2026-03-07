'use client'
import React from 'react'
import { motion } from "framer-motion"
import { MdArrowOutward } from "react-icons/md"
const Landing = () => {
    return (
        <div data-scroll data-scroll-speed="-.3" className='bg-zinc-900 w-full h-screen pt-1'>
            <div className='textstructure mt-20 sm:mt-32 md:mt-40 px-6 sm:px-10 md:px-15'>

                {["We Create", "Eye Opening", "Presentations"].map((items, index) => {
                    return <div key={index} className='textmasker'>
                        <div  className='w-fit flex items-center'>
                            {index===1 &&(
                                <motion.div initial={{width:0}} animate={{width:"9vw"}} transition={{ease:[0.76, 0, 0.24, 1],duration:0.7}} className='mr-2 sm:mr-3 md:mr-5 w-[6vw] sm:w-[8vw] md:w-[9vw] rounded-md h-[4vw] sm:h-[5vw] md:h-[6vw] bg-[url("https://ochi.design/wp-content/uploads/2022/04/content-image01.jpg")] bg-cover bg-center relative -top-[1vw] sm:-top-[1.5vw] md:-top-[2vw]'></motion.div>
                            )}
<h1 className="leading-[10vw] sm:leading-[9vw] md:leading-[7.5vw] text-[12vw] sm:text-[10vw] md:text-8xl lg:text-9xl xl:text-[8rem] uppercase font-[Founders_Grotesk_X-Cond] font-medium">{items}</h1>
                        </div>

                        
                    </div>
                })}
            </div>
            <div className='border-t-[1px] border-zinc-800 mt-10 sm:mt-16 md:mt-20 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 py-4 sm:py-5 px-6 sm:px-10 md:px-15'>
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12'>
                    {["For public & private companies only","From the first pitch to IPO"].map((items,index)=>{
                        return <p key={index} className='text-base sm:text-lg md:text-xl leading-tight font-light tracking-tight'>{items}</p>
                    })}
                </div>
                <div className='start flex items-center gap-2'>
                    <div className='py-2 px-3 sm:py-2 sm:px-4 rounded-full border-[1px] uppercase border-zinc-400 font-light text-sm sm:text-base leading-none'>Start the Project</div>
                    <div className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1px] border-zinc-400 flex items-center justify-center'>
                        <MdArrowOutward className="text-sm sm:text-base" />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Landing 
