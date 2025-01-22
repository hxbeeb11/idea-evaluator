"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/solid'
import Navbar from './Navbar'
import { useEffect } from 'react'

export default function Header() {
  useEffect(() => {
    // Disable scroll restoration on navigation
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <header className="bg-[#1a237e] text-white py-4 w-full sticky top-0 left-0 z-50">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center">
          <Link href="/home" className="group flex items-center gap-2 transition-colors duration-200">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LightBulbIcon className="h-8 w-8 text-[#1ABC9C] group-hover:text-white transition-colors duration-200" />
            </motion.div>
            <motion.span 
              className="text-2xl font-bold group-hover:text-[#1ABC9C]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Idea Evaluator
            </motion.span>
          </Link>
          <Navbar />
        </div>
      </div>
    </header>
  )
}
  
  