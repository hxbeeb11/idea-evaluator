"use client"

import { useState } from "react"
import useFormValidation from "../../hooks/useFormValidation"
import ParticleBackground from "../../components/ParticleBackground"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedInput, AnimatedTextarea, AnimatedButton } from "../../components/AnimatedFormElements"
import { BeakerIcon, LightBulbIcon, ChartBarIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

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

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)
  const { values, errors, handleChange, isValid } = useFormValidation({
    email: "",
    idea: "",
  })
  const [analysis, setAnalysis] = useState(null)

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          idea: values.idea,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        setAnalysis(null);
        setNotification({
          type: "success",
          message: "Analysis complete! A comprehensive evaluation of your idea has been sent to your email. Please check your inbox for detailed analytical results and recommendations.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error processing your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const features = [
    {
      icon: BeakerIcon,
      title: "AI Analysis",
      description: "Advanced artificial intelligence evaluates your idea's potential across multiple dimensions."
    },
    {
      icon: ChartBarIcon,
      title: "Market Insights",
      description: "Get detailed market analysis and competitive landscape evaluation."
    },
    {
      icon: RocketLaunchIcon,
      title: "Growth Strategy",
      description: "Receive actionable recommendations for successful implementation and scaling."
    }
  ]

  return (
    <>
      <ParticleBackground />
      <main className="min-h-[calc(100vh-64px)] container mx-auto px-4 py-12" ref={containerRef}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-6xl mx-auto space-y-16"
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
              Evaluate Your Ideas
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform your innovative concepts into reality with our AI-powered evaluation platform. 
              Get comprehensive analysis and actionable insights.
            </p>
          </motion.section>

          {/* Features Section */}
          <motion.section 
            style={{ opacity, scale }}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  variants={iconAnimation}
                  className="mb-4"
                >
                  <feature.icon className="h-12 w-12 text-[#1a237e]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* Form Section */}
          <motion.section
            variants={fadeInUp}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Submit Your Idea</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatedInput
                    type="email"
                    id="email"
                    name="email"
                    label="Email Address"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    error={errors.email}
                    required
                  />
                  <AnimatedTextarea
                    id="idea"
                    name="idea"
                    label="Idea Description"
                    value={values.idea}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe your business/project idea in detail (minimum 100 words)."
                    error={errors.idea}
                    required
                  />
                  <AnimatedButton
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Submit for Analysis
                  </AnimatedButton>
                </form>
              </div>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#1a237e] to-[#1d4ed8] rounded-xl shadow-xl p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-6">What You'll Get</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Market Analysis",
                    description: "Comprehensive evaluation of market potential and competitive landscape."
                  },
                  {
                    title: "Technical Assessment",
                    description: "Detailed analysis of technical feasibility and implementation requirements."
                  },
                  {
                    title: "Financial Insights",
                    description: "Projected costs, revenue streams, and funding requirements."
                  },
                  {
                    title: "Strategic Recommendations",
                    description: "Actionable steps and strategies for successful execution."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="border-l-2 border-white/30 pl-4 hover:border-white transition-colors duration-300"
                  >
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-4 p-4 rounded-xl text-center backdrop-blur-sm max-w-md mx-auto ${
              notification.type === "success" 
                ? "bg-[#1a237e]/10 text-[#1a237e]" 
                : "bg-red-100/80 text-red-700"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </main>
    </>
  )
}

