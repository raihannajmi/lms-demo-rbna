"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CheckoutFormProps {
  courseId: string
  courseName: string
  totalAmount: number
}

export default function CheckoutForm({ courseId, courseName, totalAmount }: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create payment invoice with Xendit
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          courseId,
          courseName,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address,
        }),
      })

      const data = await response.json()

      if (data.success && data.invoiceUrl) {
        // Store checkout data in session storage for enrollment after payment
        sessionStorage.setItem('checkoutData', JSON.stringify({
          courseId,
          customerName: formData.name,
          customerEmail: formData.email,
          invoiceId: data.invoiceId,
          amount: totalAmount
        }))
        
        // Redirect to Xendit payment page
        window.location.href = data.invoiceUrl
      } else {
        console.error('Payment creation failed:', data.error)
        alert('Failed to create payment. Please try again.')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="Enter your full name" 
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          placeholder="Enter your phone number" 
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          placeholder="Enter your address" 
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full mt-4" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>
    </form>
  )
}