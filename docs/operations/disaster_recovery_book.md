# EduVerse Disaster Recovery Playbook

This document details policies, SLA commitments, RPO/RTO limits, and escalation runbooks.

---

## 1. SLA Commitments

- **RPO (Recovery Point Objective)**: **5 minutes** (maximum database transactions data loss).
- **RTO (Recovery Time Objective)**: **15 minutes** (maximum system offline duration).

---

## 2. Escalation Paths & Communication Plan

```mermaid
graph TD
  OnCall["Level 1 On-Call Engineer"] -->|If issue unresolved in 5m| SreLead["Level 2 SRE Manager"]
  SreLead -->|If database failover required| DirectorOps["Level 3 Director of Infrastructure"]
  DirectorOps -->|If downtime exceeds 10m| Ciso["Executive Communications CISO/CEO"]
```

---

## 3. Database Failover Runbook

1. **Verify primary region offline status**: Run `kubectl get nodes --context=primary`.
2. **Promote read-replica in secondary region**: Run regional promote script:
   ```bash
   ./scripts/db-promote-replica.sh eu-west-1
   ```
3. **Re-route Load Balancer ingress rules**: Apply traffic weights shift:
   ```bash
   kubectl apply -f k8s/glb-ingress-secondary.yaml
   ```
4. **Publish platform status update**: Inform tenants via notification channels.
