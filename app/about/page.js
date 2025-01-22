"use client"

import { motion } from 'framer-motion'
import ParticleBackground from "../components/ParticleBackground"
import { RocketLaunchIcon, CogIcon, ChartBarIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const iconAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: "spring", stiffness: 260, damping: 20 }
}

const stepAnimation = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100 }
}

export default function About() {
  return (
    <>
      <ParticleBackground />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-6 transform-gpu hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex items-center justify-center mb-6"
            >
              <RocketLaunchIcon className="h-16 w-16 text-[#1ABC9C]" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp} 
              className="text-3xl font-bold text-[#2C3E50] mb-6 text-center"
            >
              Welcome to Idea Evaluator
            </motion.h2>
            
            <motion.section variants={fadeInUp} className="mb-8">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">What We Do</h3>
              <p className="text-gray-700 leading-relaxed">
                Idea Evaluator is an AI-powered platform that provides comprehensive analysis and evaluation of business and project ideas. Our system uses advanced AI technology to assess the viability, potential, and requirements of your ideas.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <motion.div variants={iconAnimation}>
                  <CogIcon className="h-6 w-6 text-[#1ABC9C]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#2C3E50]">How It Works</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Submit your idea through our user-friendly form along with your email address.",
                  "Our AI system analyzes your idea across multiple dimensions including market potential, technical requirements, and financial aspects.",
                  "Receive a detailed evaluation report in your email with actionable insights and recommendations."
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    variants={stepAnimation}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors duration-200"
                  >
                    <div className="bg-[#1ABC9C] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <motion.div variants={iconAnimation}>
                  <PresentationChartLineIcon className="h-6 w-6 text-[#1ABC9C]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#2C3E50]">Visual Analytics</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Our analysis includes comprehensive visual insights to help you better understand your idea's potential:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={fadeInUp}
                  className="bg-white/50 p-4 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <h4 className="text-[#2C3E50] font-medium mb-2">Market Potential</h4>
                  <div className="relative h-32 w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "60%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute bottom-0 left-0 w-1/3 bg-[#1ABC9C]/60 rounded-t-lg"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "80%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="absolute bottom-0 left-[33.33%] w-1/3 bg-[#1ABC9C]/80 rounded-t-lg"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "40%" }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="absolute bottom-0 left-[66.66%] w-1/3 bg-[#1ABC9C]/40 rounded-t-lg"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Current</span>
                    <span>Potential</span>
                    <span>Competition</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white/50 p-4 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <h4 className="text-[#2C3E50] font-medium mb-2">Success Metrics</h4>
                  <div className="relative h-32">
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <motion.path
                          d="M0,50 Q25,20 50,50 T100,50"
                          fill="none"
                          stroke="#1ABC9C"
                          strokeWidth="4"
                          className="drop-shadow-md"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Launch</span>
                    <span>Growth</span>
                    <span>Maturity</span>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-3">
                <motion.div variants={iconAnimation}>
                  <ChartBarIcon className="h-6 w-6 text-[#1ABC9C]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#2C3E50]">What You Get</h3>
              </div>
              <motion.ul 
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                variants={staggerContainer}
              >
                {[
                  "Comprehensive market analysis",
                  "Technical requirements assessment",
                  "Financial projections and cost analysis",
                  "Implementation challenges and solutions",
                  "Marketing strategy recommendations",
                  "Growth and scaling insights",
                  "Overall viability score with detailed justification"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors duration-200"
                  >
                    <div className="h-2 w-2 bg-[#1ABC9C] rounded-full mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          </motion.div>
        </motion.div>
      </main>
    </>
  )
}
