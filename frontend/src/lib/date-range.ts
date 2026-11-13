export type PaymentDateRange =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_60_DAYS"
  | "LAST_90_DAYS";

export function getDateRange(range?: PaymentDateRange) {
  if (!range) return undefined;

  const now = new Date();
  let fromDate = new Date(now);

  switch (range) {
    case "THIS_WEEK": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;

      fromDate.setDate(now.getDate() - diff);
      fromDate.setHours(0, 0, 0, 0);
      break;
    }

    case "THIS_MONTH": {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }

    case "LAST_60_DAYS": {
      fromDate.setDate(now.getDate() - 60);
      break;
    }

    case "LAST_90_DAYS": {
      fromDate.setDate(now.getDate() - 90);
      break;
    }
  }

  return {
    gte: fromDate,
    lte: now,
  };
}
