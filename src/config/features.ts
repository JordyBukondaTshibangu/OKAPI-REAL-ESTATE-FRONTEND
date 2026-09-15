/**
 * Feature flags — flip to `true` to reactivate each system.
 * Everything payment-related reads from here; no other code to touch.
 */
export const FEATURE_FLAGS = {
  /** Master switch: subscriptions, listing caps, grace period, Pro upgrade UI */
  PAYMENTS_ENABLED: false,
  /** Boost payment flow (3-step modal, admin approval queue) */
  BOOST_ENABLED: false,
  /** Subscription purchase flow */
  SUBSCRIPTIONS_ENABLED: false,
} as const;
