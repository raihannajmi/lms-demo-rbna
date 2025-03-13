"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const createEnrollment = async () => {
      try {
        // Get checkout data from session storage
        const checkoutDataString = sessionStorage.getItem('checkoutData')
        
        if (!checkoutDataString) {
          setErrorMessage("No checkout data found")
          setIsProcessing(false)
          return
        }
        
        const checkoutData = JSON.parse(checkoutDataString)
        
        // Create enrollment with simplified data
        const response = await fetch('/api/enrollment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: checkoutData.courseId,
            email: checkoutData.customerEmail,
            name: checkoutData.customerName
          }),
        })

        const data = await response.json()

        if (data.success) {
          setEnrollmentSuccess(true)
          // Clear checkout data from session storage
          sessionStorage.removeItem('checkoutData')
        } else {
          setErrorMessage(data.error || "Failed to create enrollment")
        }
      } catch (error) {
        console.error('Error creating enrollment:', error)
        setErrorMessage("An error occurred while processing your enrollment")
      } finally {
        setIsProcessing(false)
      }
    }

    createEnrollment()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        
        {isProcessing ? (
          <p className="mt-3 text-gray-600">
            Processing your enrollment...
          </p>
        ) : enrollmentSuccess ? (
          <p className="mt-3 text-gray-600">
            Thank you for your purchase. You have been successfully enrolled in the course.
          </p>
        ) : (
          <div className="mt-3">
            <p className="text-red-500">
              {errorMessage || "There was an issue with your enrollment. Please contact support."}
            </p>
            <p className="mt-2 text-gray-600">
              Your payment was successful, but we couldn't complete your enrollment automatically.
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <Link href="/dashboard">
            <Button size="lg">Go to My Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}