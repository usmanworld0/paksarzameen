'use client'
import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Marquee from './components/Marquee'
import About from './components/About'
import Eyes from './components/Eyes'
import Featured from './components/Featured'
import Cards from './components/Cards'
import Start from './components/Start'
import Footer from './components/Footer'


const page = () => {
  useEffect(() => {
    let locomotiveScroll;
    
    // Dynamic import to ensure it only runs on client side
    const initLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      locomotiveScroll = new LocomotiveScroll();
    };
    
    initLocomotiveScroll();
    
    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
    }
  }, []);

  return (
    <div className='w-full min-h-screen  text-white bg-zinc-900'>
      <Navbar/>
      <Landing/>
      <Marquee/>
      <About/>
      <Eyes/>
      <Featured/>
      <Cards/>
      <Start/>
      <Footer/>
    </div>
  )
}

export default page
