'use client';

import Link from "next/link"
import { FaRocket, FaChartLine, FaBrain, FaQuoteLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground'

const quotes = [
  {
    text: "Ideas are the beginning points of all fortunes.",
    author: "Napoleon Hill"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Everything begins with an idea. A single thought can transform your world.",
    author: "Albert Einstein"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Ideas are worthless until you get them out of your head and see what they can do.",
    author: "Michael Dell"
  },
  {
    text: "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: "Mark Zuckerberg"
  },
  {
    text: "Chase the vision, not the money; the money will end up following you.",
    author: "Tony Hsieh"
  },
  {
    text: "Your most unhappy customers are your greatest source of learning.",
    author: "Bill Gates"
  },
  {
    text: "Make every detail perfect and limit the number of details to perfect.",
    author: "Jack Dorsey"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "If you can dream it, you can do it.",
    author: "Walt Disney"
  }
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <div className="h-screen overflow-hidden flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center relative w-full"
            >
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#1d4ed8]"
              >
                Idea Evaluator
              </motion.h1>

              {/* Quotes Carousel */}
              <div className="w-full overflow-hidden mb-12">
                <div className="flex space-x-8 animate-scroll">
                  {[...quotes, ...quotes, ...quotes].map((quote, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[400px] bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-[#2563eb]/20 p-4"
                    >
                      <div className="text-[#1a237e] mb-2">
                        <FaQuoteLeft className="text-xl" />
                      </div>
                      <p className="text-gray-700 italic text-lg">{quote.text}</p>
                      <p className="text-[#1a237e] text-sm mt-2">- {quote.author}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/home"
                  className="inline-block bg-[#1a237e] text-white px-8 py-4 rounded-full text-lg font-semibold 
                             hover:bg-[#1d4ed8] transition-all duration-300 shadow-lg 
                             hover:shadow-[#2563eb]/25 transform hover:-translate-y-1"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#1a237e] text-3xl mb-3">
                  <FaBrain />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">Get comprehensive insights powered by advanced artificial intelligence</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#1a237e] text-3xl mb-3">
                  <FaChartLine />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Market Insights</h3>
                <p className="text-gray-600 text-sm">Understand market potential and growth opportunities</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#1a237e] text-3xl mb-3">
                  <FaRocket />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Strategic Planning</h3>
                <p className="text-gray-600 text-sm">Get actionable recommendations for success</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}