export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED'

export type PaymentListItem = {
  id: string
  amount: number
  status: PaymentStatus
  createdAt: string
  course: {
    id: string
    title: string
  }
}

export type PaymentDetail = {
  paymentDetails: {
    courseId: string
    paymentDate: string
    paymentMethod: string
    transactionId: string | null
    status: PaymentStatus
  }
  courseDetails: {
    courseTitle: string
    courseInstructor: string
    duration: number
  }
  costOverview: {
    coursePrice: number
    totalAmount: number
  }
}

export type CreatePaymentPayload = {
  courseId: string
  paymentMethod?: string
  transactionId?: string
}

export type CreatePaymentResult = {
  courseId: string
  paymentId: string
}

export type PaymentListMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}
