import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-3 text-gray-600">
          Thank you for your purchase. You can now access your course.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button size="lg">Go to My Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}