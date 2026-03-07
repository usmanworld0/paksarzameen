import React from 'react'

const About = () => {
    return (
                <div className='px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-20 bg-[#CDEA68] rounded-t-xl sm:rounded-t-2xl text-black'>
                        <h1 className='font-[Neue_Montreal] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-snug md:leading-tight tracking-tight'>
                            Ochi is a strategic presentation agency for forward-thinking businesses that need to raise funds, sell prod­ucts, ex­plain com­plex ideas, and hire great peo­ple.
                        </h1>
                        <div className='w-full border-t border-[#748239] py-4 sm:py-6 md:py-8 mt-6 sm:mt-8 md:mt-12 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8'>
                                <div className='md:w-1/2 pt-2 md:pt-7'>
                                        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>Our approach:</h2>
                                        <button className='px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-zinc-900 rounded-full text-white mt-4 sm:mt-5 md:mt-7 flex gap-2 sm:gap-3 md:gap-4 leading-none items-center text-sm sm:text-base'>
                                            Read More
                                                <div className='w-2 h-2 bg-zinc-100 rounded-full'></div>
                                        </button>
                                </div>
                                <div className='h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] bg-[url("https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-1326x939.jpg")] bg-cover bg-center md:w-1/2 rounded-xl sm:rounded-2xl mt-2 md:mt-7'></div>
                        </div>
                </div>
    )
}

export default About
