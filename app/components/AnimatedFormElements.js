"use client"

import { motion } from "framer-motion"

export const AnimatedInput = ({ label, error, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <motion.div
        whileTap={{ scale: 0.995 }}
      >
        <input
          {...props}
          className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm 
          transition-all duration-200 ease-in-out
          focus:border-[#1ABC9C] focus:ring focus:ring-[#1ABC9C] focus:ring-opacity-50
          hover:border-gray-400"
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

export const AnimatedTextarea = ({ label, error, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <motion.div
        whileTap={{ scale: 0.995 }}
      >
        <textarea
          {...props}
          className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm 
          transition-all duration-200 ease-in-out
          focus:border-[#1ABC9C] focus:ring focus:ring-[#1ABC9C] focus:ring-opacity-50
          hover:border-gray-400"
        />
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
    </motion.div>
  )
}

export const AnimatedButton = ({ children, isLoading, ...props }) => {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg 
        shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1a237e] to-[#283593]
        transition-all duration-200 ease-in-out
        hover:shadow-lg hover:from-[#283593] hover:to-[#1a237e]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1ABC9C] 
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        children
      )}
    </motion.button>
  )
} 