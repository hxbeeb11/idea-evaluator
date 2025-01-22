"use client"

import { useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import useFormValidation from "./hooks/useFormValidation"

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
        setAnalysis(data.analysis);
        setNotification({
          type: "success",
          message: "Analysis complete! During testing, all results are being sent to the developer's email. In production, they will be sent to your email address.",
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
    <div className="min-h-screen flex flex-col bg-[#ECF0F1]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1ABC9C] focus:ring focus:ring-[#1ABC9C] focus:ring-opacity-50"
                placeholder="your@email.com"
                required
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700">
                Idea Description
              </label>
              <textarea
                id="idea"
                name="idea"
                autoComplete="off"
                value={values.idea}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1ABC9C] focus:ring focus:ring-[#1ABC9C] focus:ring-opacity-50"
                placeholder="Describe your idea (minimum 100 words)"
                required
              ></textarea>
              {errors.idea && <p className="mt-2 text-sm text-red-600">{errors.idea}</p>}
            </div>
            <div>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C3E50] hover:bg-[#34495E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1ABC9C] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
          {analysis && (
            <div className="mt-8 max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Preview Analysis</h2>
              <div className="prose prose-sm">
                {analysis.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        {notification && (
          <div
            className={`mt-4 p-4 rounded-md ${notification.type === "success" ? "bg-green-100 text-green-700" : notification.type === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
          >
            {notification.message}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

