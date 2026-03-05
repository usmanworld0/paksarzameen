'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Animate heading text
      gsap.fromTo(
        '.footer-heading',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );

      // Animate logo
      gsap.fromTo(
        '.footer-logo-container',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: footer,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      );

      // Animate secondary heading
      gsap.fromTo(
        '.footer-secondary-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );

      // Animate middle content sections with stagger
      gsap.fromTo(
        '.footer-middle-section',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: footer,
            start: 'top 65%',
            end: 'top 25%',
            scrub: 1,
          },
        }
      );

      // Animate social links
      gsap.fromTo(
        '.footer-social-link',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: footer,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );

      // Animate copyright section
      gsap.fromTo(
        '.footer-copyright',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 50%',
            end: 'top 10%',
            scrub: 1,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className='w-full min-h-screen bg-zinc-900 p-6 sm:p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col lg:flex-row justify-start lg:justify-between gap-6 lg:gap-12 xl:gap-16' data-scroll>
      {/* Left Column */}
      <div className='lg:w-1/2 flex flex-col justify-start gap-8 lg:gap-0'>
        {/* Main Heading */}
        <div className='footer-heading mb-6 lg:mb-0'>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-tight sm:leading-snug md:leading-tight lg:leading-none font-bold text-white'>
            TRANSFORMING
          </h1>
          <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-tight sm:leading-snug md:leading-tight lg:leading-none font-bold text-white'>
            COMMUNITIES
          </h1>
        </div>

        {/* Logo */}
        <div className='footer-logo-container lg:mt-8'>
          <img
            src='/paksarzameen_logo.png'
            alt='PakSarZameen'
            className='w-24 h-auto sm:w-28 md:w-32 lg:w-32 xl:w-40'
          />
        </div>
      </div>

      {/* Right Column */}
      <div className='lg:w-1/2 flex flex-col justify-start gap-8'>
        {/* Secondary Heading */}
        <h1 className='footer-secondary-heading text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-tight sm:leading-snug md:leading-tight lg:leading-none font-bold text-white pb-6 md:pb-8 lg:pb-12 xl:pb-16'>
          SUSTAINABLE
        </h1>

        {/* Middle Content */}
        <div className='middle-content flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-8 xl:gap-12'>
          {/* Social Links */}
          <div className='footer-middle-section social-links'>
            {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((item, index) => (
              <a
                key={index}
                className='footer-social-link block font-light text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mb-3 lg:mb-4 text-white hover:text-[#00C853] transition-colors duration-300'
                href='#'
                target='_blank'
                rel='noopener noreferrer'
              >
                {item}
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className='footer-middle-section contact-info text-white'>
            <div className='address mb-6 lg:mb-8'>
              <h3 className='text-lg sm:text-xl lg:text-lg xl:text-xl font-semibold mb-3'>
                Address
              </h3>
              <p className='text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed text-zinc-300'>
                Islamabad, Pakistan
              </p>
              <p className='text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed text-zinc-300'>
                Serving grassroots communities
              </p>
            </div>

            <div className='email mb-6 lg:mb-8'>
              <h3 className='text-lg sm:text-xl lg:text-lg xl:text-xl font-semibold mb-3'>
                Contact
              </h3>
              <a
                href='mailto:hello@paksarzameen.org'
                className='text-base sm:text-lg lg:text-base xl:text-lg text-zinc-300 hover:text-[#00C853] hover:underline transition-colors duration-300 leading-relaxed'
              >
                hello@paksarzameen.org
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className='footer-middle-section navigation-links text-white'>
            {['Programs', 'About', 'Impact', 'Get_Involved', 'Contact'].map((item, index) => (
              <Link
                key={index}
                className='block font-light text-xl sm:text-2xl md:text-3xl lg:text-xl xl:text-2xl underline-offset-4 underline mb-2 lg:mb-3 text-white hover:text-[#00C853] transition-colors duration-300'
                href={`/${item.toLowerCase().replace('_', '-')}`}
              >
                {item.replace('_', ' ')}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <div className='footer-copyright mt-8 pt-8 border-t border-zinc-700'>
          <p className='text-base sm:text-lg lg:text-sm xl:text-base text-zinc-400'>
            © 2026 PakSarZameen Foundation. All rights reserved. | Serving Humanity Through Action.
          </p>
        </div>
      </div>
    </footer>
  );
}

