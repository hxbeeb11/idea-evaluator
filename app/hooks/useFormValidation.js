import { useState, useEffect } from "react"
import { isValidEmail } from "../utils"

export default function useFormValidation(initialState) {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateForm = () => {
      const errors = {}

      if (!isValidEmail(values.email)) {
        errors.email = "Please enter a valid email address"
      }

      if (values.idea.split(/\s+/).length < 100) {
        errors.idea = "Please enter at least 100 words for a thorough analysis"
      } else {
        const lowerCaseIdea = values.idea.toLowerCase()
        const keyAspects = {
          'target audience': lowerCaseIdea.includes('target') || lowerCaseIdea.includes('audience') || lowerCaseIdea.includes('user'),
          'revenue': lowerCaseIdea.includes('revenue') || lowerCaseIdea.includes('price') || lowerCaseIdea.includes('subscription'),
          'market': lowerCaseIdea.includes('market'),
          'competition': lowerCaseIdea.includes('competition') || lowerCaseIdea.includes('competitor')
        }
        
        const missingAspects = Object.entries(keyAspects)
          .filter(([_, included]) => !included)
          .map(([aspect]) => aspect)

        if (missingAspects.length > 0) {
          errors.idea = `Consider including information about: ${missingAspects.join(', ')}`
        }
      }

      setErrors(errors)
      setIsValid(Object.keys(errors).length === 0)
    }

    validateForm()
  }, [values])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
  }

  return { values, errors, handleChange, isValid }
}

