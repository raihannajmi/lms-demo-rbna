import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CheckoutForm from './checkout-form';

interface Course {
  id: number;
  title: string;
  description: string;
  materials: string[];
  price: number;
  image_url: string;
}

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

async function getCourse(id: string): Promise<Course> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/course/${id}`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch course');
  }
  return res.json();
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const course = await getCourse(params.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate total price with tax
  const subtotal = course.price;
  const tax = course.price * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Personal Information - Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CheckoutForm
                    courseId={params.id}
                    courseName={course.title}
                    totalAmount={total}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-32 overflow-hidden rounded-md">
                      <Image
                        src={course.image_url}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Online Course
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between py-1">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Tax</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-sm text-muted-foreground">
                Payment will be processed securely via Xendit
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
