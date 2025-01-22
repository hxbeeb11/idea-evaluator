"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { InformationCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
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

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        const Icon = item.icon

        return (
          <Link 
            key={item.path} 
            href={item.path}
            className="relative group"
          >
            <motion.div
              className="flex items-center gap-1"
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
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1ABC9C]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
} 