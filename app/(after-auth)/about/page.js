"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import ParticleBackground from "../../components/ParticleBackground"
import { RocketLaunchIcon, LightBulbIcon, SparklesIcon, BeakerIcon, ChartBarIcon, BoltIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'
import Link from 'next/link'

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

const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

export default function About() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  return (
    <>
      <ParticleBackground />
      <main className="flex-grow container mx-auto px-4 py-12" ref={containerRef}>
        <motion.div 
          className="max-w-4xl mx-auto space-y-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Hero Section */}
          <motion.section 
            variants={fadeInUp}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-block"
            >
              <LightBulbIcon className="h-20 w-20 text-[#1a237e] mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight">
              The Power of Ideas
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ideas are the seeds of innovation that have the power to transform not just individual lives, 
              but entire generations. Every groundbreaking achievement in human history started with a single thought.
            </p>
          </motion.section>

          {/* Transformative Power Cards */}
          <motion.section className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: SparklesIcon,
                title: "Spark of Innovation",
                description: "Every revolutionary change begins with a simple idea. From the wheel to artificial intelligence, ideas have been the catalyst for human progress."
              },
              {
                icon: BoltIcon,
                title: "Generational Impact",
                description: "A single innovative idea can create lasting change, building legacies that benefit societies for generations to come."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={cardHover}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <card.icon className="h-12 w-12 text-[#1a237e] mb-4" />
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* AI Analysis Section */}
          <motion.section 
            style={{ opacity, scale }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <BeakerIcon className="h-10 w-10 text-[#1a237e]" />
              <h2 className="text-3xl font-bold text-[#2C3E50]">AI-Powered Idea Analysis</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Real-World Context",
                  description: "Our AI analyzes your idea against current market trends, technological capabilities, and economic conditions."
                },
                {
                  title: "Comprehensive Evaluation",
                  description: "Get detailed insights on market potential, technical feasibility, and implementation strategies."
                },
                {
                  title: "Actionable Insights",
                  description: "Receive specific recommendations to refine and improve your idea for maximum impact."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#1a237e] to-transparent rounded-full" />
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Process Flow */}
          <motion.section className="space-y-8">
            <h2 className="text-3xl font-bold text-[#2C3E50] text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: LightBulbIcon,
                  title: "Submit Your Idea",
                  description: "Share your innovative concept through our intuitive interface."
                },
                {
                  icon: ChartBarIcon,
                  title: "AI Analysis",
                  description: "Our advanced AI evaluates your idea across multiple dimensions."
                },
                {
                  icon: RocketLaunchIcon,
                  title: "Get Insights",
                  description: "Receive detailed analysis and actionable recommendations."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                  className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    variants={iconAnimation}
                    className="mb-4"
                  >
                    <step.icon className="h-12 w-12 text-[#1a237e]" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            variants={fadeInUp}
            className="text-center bg-gradient-to-r from-[#1a237e] to-[#1d4ed8] rounded-xl p-8 shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-white/90 mb-6">
              Let our AI-powered platform help you evaluate and refine your innovative concepts.
            </p>
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#1a237e] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.section>
        </motion.div>
      </main>
    </>
  )
}
