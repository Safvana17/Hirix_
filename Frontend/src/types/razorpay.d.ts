interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  handler: (response: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    planId: string
  }) => void
  prefill?: {
    name?: string
    email?: string
  }
  theme?: {
    color?: string
  }
}

interface RazorpayInstance {
  open(): void
  on(
    event: "payment.failed",
    handler: (response: {
      error?: {
        metadata?: {
          order_id?: string
        }
      }
    }) => void
  ): void
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor
  }
}

export {}