"use client"

import { useState } from "react"
import ParticleBackground from "../components/ParticleBackground"
import { motion } from "framer-motion"
import { AnimatedInput, AnimatedTextarea, AnimatedButton } from "../components/AnimatedFormElements"

export default function Contact() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

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

  return (
    <>
      <ParticleBackground />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden"
            whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                rows="4"
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
          </motion.div>
        </motion.div>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-4 p-4 rounded-xl text-center backdrop-blur-sm ${
              notification.type === "success" 
                ? "bg-green-100/80 text-green-700" 
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
