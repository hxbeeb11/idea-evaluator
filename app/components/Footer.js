export default function Footer() {
    return (
      <footer className="bg-[#2C3E50] text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Idea Evaluator. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:underline">
              About
            </a>{" "}
            |
            <a href="mailto:contact@ideaevaluator.com" className="hover:underline ml-2">
              Contact
            </a>
          </p>
        </div>
      </footer>
    )
  }
  
  