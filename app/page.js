"use client"

import { useState } from "react"
import useFormValidation from "./hooks/useFormValidation"
import ParticleBackground from "./components/ParticleBackground"
import { motion } from "framer-motion"
import { AnimatedInput, AnimatedTextarea, AnimatedButton } from "./components/AnimatedFormElements"

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)
  const { values, errors, handleChange, isValid } = useFormValidation({
    email: "",
    idea: "",
  })
  const [analysis, setAnalysis] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)

    try {
      console.log('Submitting form with:', { email: values.email, idea: values.idea });  // Debug log
      
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

      console.log('Response received:', response.status);  // Debug log
      
      const data = await response.json();
      console.log('Response data:', data);  // Debug log

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
      console.error('Error in submission:', error);  // Debug log
      setNotification({
        type: "error",
        message: "Error processing your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ParticleBackground />
      <main className="h-[calc(100vh-64px)] container mx-auto px-4 py-4">
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
                rows="5"
                placeholder="Describe your business/project idea in detail (minimum 100 words)."
                error={errors.idea}
                required
              />
              <AnimatedButton
                type="submit"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
              >
                Submit
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

