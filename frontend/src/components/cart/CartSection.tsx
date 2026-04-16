'use client'

import Image, { type StaticImageData } from 'next/image'
import { useMemo, useState } from 'react'
import { ChevronRight, Trash2 } from 'lucide-react'
import { IMAGES } from '@/assets/images'
import Link from 'next/link'

type CartItem = {
  id: string
  category: string
  title: string
  description: string
  price: number // numeric for subtotal math
  image: StaticImageData
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 'ux-design',
    category: 'Think Sustainability',
    title: 'UX Design',
    description: 'Learn innovative problem-solving approaches, foster collaboration, a...',
    price: 100,
    image: IMAGES.course1,
  },
  {
    id: 'ux-design-2',
    category: 'Think Sustainability',
    title: 'UX Design',
    description: 'Learn innovative problem-solving approaches, foster collaboration, a...',
    price: 100,
    image: IMAGES.course2,
  },
]

export default function CartSection() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items])
  const discount = couponApplied ? 20 : 0
  const total = subtotal - discount

  return (
    <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-12 text-lg flex items-center">
            <Link href="/courses" className="hover:text-white/80  text-[#DA55B5] transition-colors">
              Courses
            </Link>
            <span className="mx-4"><ChevronRight className="w-4 h-4 text-heading" /></span>
            <span className="text-heading line-clamp-1">Cart</span>
          </nav>
      <div className="flex flex-col xl:gap-[206px] gap-6 lg:flex-row lg:items-start">
        {/* Left: Items */}
        <div className="order-2 flex-1 lg:order-1">
          <div className="mb-4 flex items-center justify-between hidden md:flex">
            <h2 className="text-[24px] font-medium text-[#252A64]">{items.length} Courses in Cart</h2>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-[44px] md:py-6 border-b items-start justify-start border-[#E5E7EB]">
                <div className="relative md:h-[123px] md:w-[232px] h-[200px] w-full overflow-hidden rounded-xl bg-[#F2E8FA]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded bg-[#EEF0F6] px-3 py-1 text-primary">
                    {item.category}
                  </span>
                  <h3 className="mt-2 text-[20px] font-medium text-heading">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-lg text-[#696969]">{item.description}</p>
                </div>

                <div className="flex items-center md:justify-start justify-between w-full md:w-auto gap-4">
                <div className="text-center">
                    <p className="text-[18px] font-semibold text-[#252A64]">£{item.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                    className="text-[#696969] hover:text-[#252A64]"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="order-1 w-full lg:order-2 lg:w-[347px]">
          <h3 className="md:mb-5 mb-[14px] md:text-[24px] text-lg font-medium text-body">Subtotal</h3>

          <div className="flex items-end gap-3">
            <p className="text-[40px] font-bold leading-none text-heading">${total}</p>
            {discount > 0 ? (
              <p className="pb-1 text-[14px] font-medium text-black">-${discount}</p>
            ) : null}
          </div>

          <div className="mt-6">
            <p className="mb-3 md:text-lg font-medium text-heading">Have a Coupon?</p>
            <div className="flex gap-3 border border-[#DEDEDE] rounded-lg py-[9px] pr-[10px]">
              <input
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value)
                  if (!couponApplied) return
                  setCouponApplied(false)
                }}
                placeholder=""
                className=" flex-1 border-none  bg-white px-4 text-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setCouponApplied(couponCode.trim().toUpperCase() === 'SAVE20')}
                className="py-2 rounded-[16px] bg-[#191C32] px-6 text-sm md:text-base text-white hover:bg-[#232A59]"
              >
                Apply
              </button>
            </div>
          </div>

          <Link href="/checkout">
          <button
            type="button"
            className="mt-6 hidden w-full rounded-lg bg-[#303869] px-6 py-3 text-lg font-medium text-white hover:bg-[#232A59] lg:block"
            >
            Proceed to Checkout
            </button>
          </Link>
        </aside>
      </div>
      <Link href="/checkout"> 
      <button
        type="button"
        className="mt-6 w-full rounded-lg bg-[#303869] px-6 py-3  font-medium text-white hover:bg-[#232A59] lg:hidden"
      >
        Proceed to Checkout
      </button>
      </Link>
    </section>
  )
}

