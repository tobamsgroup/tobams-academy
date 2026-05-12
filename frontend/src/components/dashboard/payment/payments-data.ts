export type Payment = {
  id: string;
  courseName: string;
  courseId: string;
  amount: number | "Free";
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

export type DateRangeFilter =
  | "all"
  | "this_week"
  | "this_month"
  | "last_30"
  | "last_60"
  | "last_90";

export const PAGE_SIZE = 5;

export const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: "1",
    courseName: "Introduction to Digital Ma...",
    courseId: "CDM",
    amount: 3000,
    date: "2025-12-12",
    status: "Completed",
  },
  {
    id: "2",
    courseName: "Web Development for Be...",
    courseId: "WDB",
    amount: 400,
    date: "2021-01-01",
    status: "Completed",
  },
  {
    id: "3",
    courseName: "Python Programming Ess...",
    courseId: "PPE",
    amount: "Free",
    date: "2021-01-01",
    status: "Pending",
  },
  {
    id: "4",
    courseName: "Graphic Design Fundame...",
    courseId: "GDF",
    amount: "Free",
    date: "2025-12-12",
    status: "Pending",
  },
  {
    id: "5",
    courseName: "Artificial Intelligence & ML",
    courseId: "AIML",
    amount: 49,
    date: "2021-01-01",
    status: "Failed",
  },
  {
    id: "6",
    courseName: "Business Analytics & Dat...",
    courseId: "BADS",
    amount: 325,
    date: "2025-12-12",
    status: "Failed",
  },
  {
    id: "7",
    courseName: "Creative Writing & Storyte...",
    courseId: "CWS",
    amount: 325,
    date: "2022-10-10",
    status: "Completed",
  },
];

export const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_30", label: "Last 30 days" },
  { value: "last_60", label: "Last 60 days" },
  { value: "last_90", label: "Last 90 days" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function paymentDay(dateStr: string) {
  return startOfDay(new Date(`${dateStr}T12:00:00`));
}

function startOfWeekMonday(reference: Date) {
  const d = startOfDay(reference);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function startOfMonth(reference: Date) {
  return startOfDay(new Date(reference.getFullYear(), reference.getMonth(), 1));
}

export function matchesDateRangeFilter(dateStr: string, filter: DateRangeFilter) {
  if (filter === "all") return true;
  const pd = paymentDay(dateStr);
  const now = new Date();
  const today = startOfDay(now);

  if (filter === "this_week") {
    const weekStart = startOfWeekMonday(now);
    return pd >= weekStart && pd <= today;
  }
  if (filter === "this_month") {
    const monthStart = startOfMonth(now);
    return pd >= monthStart && pd <= today;
  }
  const days = filter === "last_30" ? 30 : filter === "last_60" ? 60 : 90;
  const start = new Date(today);
  start.setDate(start.getDate() - days);
  return pd >= start && pd <= today;
}

export type PaymentSummaryExtras = {
  paymentMethod: string;
  transactionId: string;
  instructor: string;
  duration: string;
  accessPeriod: string;
  courseTitleFull: string;
  /** Display for payment row (e.g. Successful when Completed) */
  paymentStatusLabel: string;
  coursePriceUsd: number;
  discountUsd: number;
  totalPaidUsd: number;
};

export type PaymentSummary = Payment & PaymentSummaryExtras;

export function formatPaymentDateUs(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

function statusToSummaryLabel(status: Payment["status"]): string {
  if (status === "Completed") return "Successful";
  if (status === "Pending") return "Pending";
  return "Failed";
}

const SUMMARY_OVERRIDES: Partial<
  Record<
    string,
    Partial<
      Pick<
        PaymentSummaryExtras,
        | "paymentMethod"
        | "transactionId"
        | "instructor"
        | "duration"
        | "accessPeriod"
        | "courseTitleFull"
        | "coursePriceUsd"
        | "discountUsd"
        | "totalPaidUsd"
      >
    >
  >
> = {
  "1": {
    paymentMethod: "VISA ending with 4325",
    transactionId: "TXN728391",
    courseTitleFull: "Introduction to Digital Marketing",
    instructor: "Dr. Sarah Johnson",
    duration: "12hrs",
    accessPeriod: "Lifetime",
    coursePriceUsd: 200,
    discountUsd: 20,
    totalPaidUsd: 35,
  },
  "2": {
    paymentMethod: "VISA ending with 4325",
    transactionId: "TXN728392",
    courseTitleFull: "Web Development for Beginners",
    instructor: "Dr. Sarah Johnson",
    duration: "12hrs",
    accessPeriod: "Lifetime",
    coursePriceUsd: 200,
    discountUsd: 20,
    totalPaidUsd: 400,
  },
};

export function getPaymentSummary(id: string): PaymentSummary | null {
  const p = SAMPLE_PAYMENTS.find((row) => row.id === id);
  if (!p) return null;

  const override = SUMMARY_OVERRIDES[id];
  const numericAmount = p.amount === "Free" ? 0 : p.amount;

  const defaultCoursePrice = numericAmount > 0 ? numericAmount + 20 : 0;
  const defaultDiscount = numericAmount > 0 ? 20 : 0;
  const defaultTotal = numericAmount;

  const coursePriceUsd = override?.coursePriceUsd ?? defaultCoursePrice;
  const discountUsd = override?.discountUsd ?? defaultDiscount;
  const totalPaidUsd = override?.totalPaidUsd ?? defaultTotal;

  const base: PaymentSummaryExtras = {
    paymentMethod: override?.paymentMethod ?? "VISA ending with 4325",
    transactionId: override?.transactionId ?? `TXN${id.padStart(3, "0")}8391`,
    instructor: override?.instructor ?? "Instructor team",
    duration: override?.duration ?? "—",
    accessPeriod: override?.accessPeriod ?? "Lifetime",
    courseTitleFull:
      override?.courseTitleFull ?? p.courseName.replace(/\.\.\.$/, "").trim(),
    paymentStatusLabel: statusToSummaryLabel(p.status),
    coursePriceUsd,
    discountUsd,
    totalPaidUsd,
  };

  return { ...p, ...base };
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
