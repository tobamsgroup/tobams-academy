-- Learners enrolled by an admin (reference "ADMIN-…") have already paid for the course.
-- They were recorded at £0 ("Complimentary enrollment") and showed as "Free" in payment history.
-- Record what they paid: the early-bird price when set and lower, otherwise the standard price.
UPDATE "payments" AS p
SET "amount" = CASE
      WHEN c."earlyBirdPrice" > 0 AND c."earlyBirdPrice" < COALESCE(c."price", 0) THEN c."earlyBirdPrice"
      ELSE COALESCE(c."price", 0)
    END,
    "paymentMethod" = 'Paid',
    "updatedAt" = CURRENT_TIMESTAMP
FROM "courses" AS c
WHERE p."courseId" = c."id"
  AND p."reference" LIKE 'ADMIN-%'
  AND p."amount" = 0;
