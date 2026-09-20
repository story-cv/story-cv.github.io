---
name: Cloudinary founder video
description: Why the founder video uses direct Cloudinary delivery instead of the hosted embed player.
---

Use Cloudinary's direct MP4 delivery in a native video element for the founder video rather than the hosted player iframe.

**Why:** The hosted player resolves the correct asset and poster but reports “No supported media sources” when nested inside the app preview. Explicitly selecting MP4 in the hosted player does not fix the nested case; direct MP4 delivery works.

**How to apply:** Keep the native video approach when updating this video or adding equivalent portrait videos unless the hosted player has been verified inside the app itself.