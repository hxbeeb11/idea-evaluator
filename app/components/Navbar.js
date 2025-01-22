"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { InformationCircleIcon, EnvelopeIcon, HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      path: '/',
      label: 'Landing',
      icon: HomeIcon,
    },
    {
      path: '/about',
      label: 'About',
      icon: InformationCircleIcon,
    },
    {
      path: '/contact',
      label: 'Contact',
      icon: EnvelopeIcon,
    },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const NavLink = ({ item, isMobile = false }) => {
    const isActive = pathname === item.path
    const Icon = item.icon

    return (
      <Link 
        key={item.path} 
        href={item.path}
        className={`relative group ${isMobile ? 'w-full' : ''}`}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <motion.div
          className={`flex items-center gap-1 ${isMobile ? 'p-4' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={`h-5 w-5 ${
            isActive ? 'text-[#1ABC9C]' : 'text-white group-hover:text-[#1ABC9C]'
          } transition-colors duration-200`} />
          <span className={`${
            isActive ? 'text-[#1ABC9C]' : 'text-white group-hover:text-[#1ABC9C]'
          } transition-colors duration-200`}>
            {item.label}
          </span>
        </motion.div>
        {isActive && !isMobile && (
          <motion.div
            layoutId="activeTab"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1ABC9C]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2 hover:text-[#1ABC9C] transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full right-0 mt-2 w-48 bg-[#1a237e] rounded-lg shadow-lg overflow-hidden md:hidden"
          >
            <div className="py-2 flex flex-col">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} isMobile={true} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 