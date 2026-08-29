# EduVerse Commercial SaaS Architecture

This document details plans billing logic, gateways, commissions split rules, and analytics indicators.

---

## 1. Subscriptions & Add-ons
- Plans support Monthly and Annual periods.
- Seats pricing scales per added user.
- Add-ons are applied as additional fee lines on monthly invoices.

---

## 2. Revenue Commission Cuts
- **Marketplace cut**: 30% platform share / 70% publisher payout:
  ```json
  {
    "orderId": "uuid",
    "total": 100.0,
    "publisherCut": 70.0,
    "platformCut": 30.0
  }
  ```
- **Partner commissions**: 15% referral payout per order completed.

---

## 3. Financial Metrics
- **MRR (Monthly Recurring Revenue)**: Calculated on day-one of every month.
- **ARR (Annual Recurring Revenue)**: Extrapolated from MRR.
- **Churn rate**: Measured MoM based on deactivated subscriptions counts.
