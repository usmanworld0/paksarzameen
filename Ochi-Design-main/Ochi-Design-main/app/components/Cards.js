import React from 'react'

const Cards = () => {
  return (
    <div className='w-full min-h-screen flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 pt-16 sm:pt-20 md:pt-24 lg:pt-30 px-4 sm:px-6 md:px-8 lg:px-10 pb-8 lg:pb-0'>
      <div className='cardcontainer w-full lg:w-1/2 h-[40vh] sm:h-[45vh] md:h-[50vh] bg-[#004D43] rounded-xl sm:rounded-2xl'>
        <div className='card relative h-full w-full flex items-center justify-center'>
          <img className="w-24 sm:w-28 md:w-32 lg:w-auto" src='https://ochi.design/wp-content/uploads/2022/04/logo001.svg' alt="Ochi logo"></img>
        <button className='absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-4 sm:left-6 md:left-8 lg:left-10 border-[1.5px] border-[#CDEA68] text-[#CDEA68] py-1 px-3 sm:px-4 rounded-full text-xs sm:text-sm'>©2025</button>
        </div>
      </div>
      
      <div className='cardcontainer w-full lg:w-1/2 flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10'>
        <div className='card relative h-[40vh] sm:h-[45vh] md:h-[50vh] w-full sm:w-1/2 rounded-xl sm:rounded-2xl bg-[#192826] flex items-center justify-center'>
          <img className="w-20 sm:w-24 md:w-28 lg:w-auto" src='https://ochi.design/wp-content/uploads/2022/04/logo002.svg' alt="Logo 2"></img>
        <button className='absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 md:left-6 lg:left-auto lg:right-4 lg:translate-x-0 border-[1.5px] border-zinc-300 py-1 px-3 sm:px-4 rounded-full text-xs sm:text-sm'>Rating 5.0 on Clutch</button>
        </div>
        
        <div className='card relative h-[40vh] sm:h-[45vh] md:h-[50vh] w-full sm:w-1/2 rounded-xl sm:rounded-2xl bg-stone-800 flex items-center justify-center'>
          <img className='w-16 sm:w-20 md:w-24 lg:w-30' src='https://ochi.design/wp-content/uploads/2022/04/logo003.png' alt="Logo 3"></img>
          <button className='absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 md:left-6 lg:left-auto lg:right-4 lg:translate-x-0 border-[1.5px] border-zinc-300 py-1 px-3 sm:px-4 rounded-full text-xs sm:text-sm'>BUSINESS BOOTCAMP ALUMNI</button>
        </div>
      </div>
    </div>
  )
}

export default Cards
