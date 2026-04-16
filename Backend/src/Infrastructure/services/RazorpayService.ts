import { CreateOrderResponse, IRazorpayService } from "../../Application/interface/service/IRazorpayService";
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { env } from "../config/env";


export class RazorpayService implements IRazorpayService {
    private razorpay: Razorpay
    constructor(){
        this.razorpay = new Razorpay({
            key_id: env.RAZORPAY_API_KEY,
            key_secret: env.RAZORPAY_API_SECRET
        })
    }

    async createOrder(amount: number, currency: string, receipt: string): Promise<CreateOrderResponse> {
        const order = await this.razorpay.orders.create({
            amount: amount * 100,
            currency: currency,
            receipt,
        })

        return {
            orderId: order.id,
            currency: order.currency,
            amount: Number(order.amount)
        }
    }

    async verifySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
        const body = orderId + "|" + paymentId
        const expectedSignature = crypto
              .createHmac("sha256", env.RAZORPAY_API_SECRET)
              .update(body)
              .digest("hex")
        return expectedSignature === signature
    }
}