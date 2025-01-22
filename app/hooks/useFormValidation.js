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
        errors.idea = `<div class="space-y-4">
          <div>
            Please provide a detailed description (minimum 100 words) including:
            <br/>• Core concept and target audience
            <br/>• Key features and functionalities
            <br/>• Revenue model and pricing strategy
            <br/>• Market analysis and competition
            <br/>• Technical requirements
          </div>

          <div>
            <strong>Note:</strong> The submit button will remain inactive until all criteria are met.
          </div>

          <div class="text-green-600">
            <strong>Tip:</strong> If you're having trouble providing enough detail, you can use AI tools like ChatGPT. Simply share your basic idea with ChatGPT and ask it to expand it into a detailed description covering all the above points.
          </div>
        </div>`
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
          errors.idea = `Please include information about: ${missingAspects.join(', ')}`
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

