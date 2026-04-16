'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function CheckoutSection() {
  return (
    <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
      <nav className="mb-12 flex items-center text-lg">
        <Link href="/cart" className="text-[#DA55B5] transition-colors hover:text-[#B83092]">
          Cart
        </Link>
        <span className="mx-4">
          <ChevronRight className="h-4 w-4 text-heading" />
        </span>
        <span className="line-clamp-1 text-heading">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.95fr]">
        <div className="order-2 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:py-7 md:px-6 lg:order-1">
          <h2 className=" text-xl font-medium text-heading md:text-[24px]">Payment Details</h2>
          <p className="mt-2 text-lg text-[#474348]">Complete your purchase by providing your purchase details</p>

          <form className="mt-7 space-y-5">
            <div>
              <label htmlFor="cardHolderName" className="mb-2 block text-lg font-medium text-body">
                Card Holder Name
              </label>
              <input
                id="cardHolderName"
                type="text"
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="mb-2 block text-lg font-medium text-body">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="mb-2 block text-lg font-medium text-body">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="mb-2 block text-lg font-medium text-body">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
                />
              </div>

              <div>
                <label htmlFor="cvv" className="mb-2 block text-lg font-medium text-body">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-2 w-full rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-[#232A59]"
            >
              Pay $220
            </button>
          </form>
        </div>

        <aside className="order-1 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:p-7 lg:order-2 lg:self-start">
          <h3 className="text-xl font-medium text-heading md:text-[24px]">Payment Summary</h3>
          <p className="mt-2 text-lg text-[#474348]">Here is the breakdown of your payment</p>

          <div className="mt-7 space-y-5">
            <div className="flex items-center justify-between text-lg text-body">
              <span>Subtotal</span>
              <span>$200</span>
            </div>
            <div className="flex items-center justify-between text-lg text-body">
              <span>Coupon</span>
              <span>-$20</span>
            </div>
            <div className="flex items-center justify-between text-lg text-body">
              <span>Vat(10%)</span>
              <span>$20</span>
            </div>
            <div className="h-px w-full" />
            <div className="flex items-center justify-between text-lg font-semibold text-heading">
              <span>Total</span>
              <span>$200</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

