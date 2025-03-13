import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold">Payment Failed</h1>
        <p className="mt-3 text-gray-600">
          We couldn't process your payment. Please try again or contact support.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
          <Link href="/support">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}