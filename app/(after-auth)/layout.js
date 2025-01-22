"use client"

import Header from "../components/Header"

export default function AfterAuthLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
