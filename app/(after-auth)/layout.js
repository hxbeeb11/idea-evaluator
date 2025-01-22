"use client"

import Header from "../components/Header"

export default function AfterAuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  )
}
