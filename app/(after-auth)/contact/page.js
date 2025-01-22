"use client"

import { useState } from "react"
import ParticleBackground from "../../components/ParticleBackground"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedInput, AnimatedTextarea, AnimatedButton } from "../../components/AnimatedFormElements"
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
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

export default function Contact() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

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
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      })

      if (result.ok) {
        setEmail("")
        setMessage("")
        setNotification({
          type: "success",
          message: "Your message has been sent successfully. We will reply to your email shortly."
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to send message. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: "mohdhabeeburrahman11@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: MapPinIcon,
      title: "Location",
      details: "Hyderabad, India",
      description: "Innovation Hub"
    }
  ]

  return (
    <>
      <ParticleBackground />
      <main className="flex-grow container mx-auto px-4 py-12" ref={containerRef}>
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
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about our AI-powered idea evaluation? We're here to help you transform your innovative concepts into reality.
            </p>
          </motion.section>

          {/* Contact Info Cards */}
          <motion.section 
            style={{ opacity, scale }}
            className="grid md:grid-cols-2 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  variants={iconAnimation}
                  className="mb-4"
                >
                  <info.icon className="h-8 w-8 text-[#1a237e]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-1">{info.title}</h3>
                <p className="text-[#1a237e] font-medium mb-1">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* Contact Form Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatedInput
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Your Email Address"
                    placeholder="your@email.com"
                    required
                  />
                  <AnimatedTextarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Message"
                    rows="6"
                    placeholder="Type your message here..."
                    required
                  />
                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Send Message
                  </AnimatedButton>
                </form>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#1a237e] to-[#1d4ed8] rounded-xl shadow-xl p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-6">Why Contact Us?</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Expert Guidance",
                    description: "Get personalized support for your idea evaluation journey."
                  },
                  {
                    title: "Technical Support",
                    description: "Need help with our platform? Our team is here to assist."
                  },
                  {
                    title: "Partnership Opportunities",
                    description: "Explore collaboration possibilities with our team."
                  },
                  {
                    title: "Custom Solutions",
                    description: "Discuss tailored evaluation approaches for your unique ideas."
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
          </div>
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
