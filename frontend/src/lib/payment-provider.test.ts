import { getPaymentProvider, isSimulatedSession } from "./payment-provider";

describe("getPaymentProvider", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });
  const set = (vars: Record<string, string | undefined>) => {
    process.env = { ...env, ...vars } as NodeJS.ProcessEnv;
  };

  it("uses Stripe by default", () => {
    set({ PAYMENT_PROVIDER: undefined, NODE_ENV: "development" });
    expect(getPaymentProvider()).toBe("stripe");
  });

  it("uses simulated payments when explicitly enabled outside production", () => {
    set({ PAYMENT_PROVIDER: "simulated", NODE_ENV: "development" });
    expect(getPaymentProvider()).toBe("simulated");
  });

  it("refuses simulated payments in production unless explicitly allowed", () => {
    set({ PAYMENT_PROVIDER: "simulated", NODE_ENV: "production", ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION: undefined });
    expect(getPaymentProvider()).toBe("stripe");
    set({ PAYMENT_PROVIDER: "simulated", NODE_ENV: "production", ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION: "true" });
    expect(getPaymentProvider()).toBe("simulated");
  });

  it("recognises simulated session ids", () => {
    expect(isSimulatedSession("sim_123")).toBe(true);
    expect(isSimulatedSession("cs_test_123")).toBe(false);
  });
});
