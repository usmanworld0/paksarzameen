type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export function consumeRateLimit(input: {
  key: string;
  max: number;
  windowMs: number;
}) {
  const now = Date.now();
  const current = buckets.get(input.key);

  if (!current || now >= current.resetAt) {
    const next: RateLimitBucket = { count: 1, resetAt: now + input.windowMs };
    buckets.set(input.key, next);
    return {
      allowed: true,
      remaining: input.max - 1,
      resetAt: next.resetAt,
    };
  }

  if (current.count >= input.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  buckets.set(input.key, current);
  return {
    allowed: true,
    remaining: input.max - current.count,
    resetAt: current.resetAt,
  };
}
