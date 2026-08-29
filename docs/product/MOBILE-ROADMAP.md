# EDUVERSE — MOBILE CLIENT & FLUTTER ROADMAP

**Document ID:** `MOBILE-ROADMAP`  
**Date:** August 15, 2026  
**Release Baseline:** `v1.0.0 GA`  

---

## 1. Mobile API & Cross-Platform Roadmap (Sprint 27 Target)

- **Mobile API Contract Optimization:** Standardize `/api/v1/mobile/*` endpoints returning minimal JSON payloads designed for low-bandwidth cellular connections.
- **Firebase Push Notifications:** FCM integration for assignment due dates, live class reminders, and grade publication alerts.
- **Offline Caching Architecture:** Local Hive / SQLite storage on Flutter client with server synchronization endpoints (`POST /api/v1/mobile/sync`).
- **Mobile Video Streaming:** Adaptive HLS playback support in mobile native video player.
