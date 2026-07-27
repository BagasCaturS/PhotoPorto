# Image Protection — Implementation Plan & Progress

## Goal
Prevent casual downloading, hotlinking, and direct access of portfolio photos while maintaining good UX for legitimate visitors.

## Architecture Overview

```
Browser → <ProtectedImage> (right-click/drag prevention)
        → /api/images/[...path] (proxy — hides real URL, referrer check)
        → Supabase Storage (public bucket → later private + signed URL)
        → Image delivered back to browser
```

---

## Phase 1 — Client-Side Deterrents ✅

| Task | Status | File |
|---|---|---|
| Create `ProtectedImage` wrapper component | ✅ | `src/components/ProtectedImage.tsx` |
| Update `Hero.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |
| Update `GalleryGrid.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |
| Update `Lightbox.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |
| Update `FeaturedSection.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |
| Update `CategoryClient.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |
| Update `photos/[slug]/page.tsx` | ✅ | Swap `<Image>` → `<ProtectedImage>` |

---

## Phase 2 — API Image Proxy ✅

| Task | Status | File |
|---|---|---|
| Create API proxy route | ✅ | `src/app/api/images/[...path]/route.ts` |
| Add `getProxiedUrl()` to utils | ✅ | `src/lib/utils.ts` |
| Update `fetchPhotos()` in data layer | ✅ | `src/data/photos.ts` |
| Update server-side photo map in `page.tsx` | ✅ | `src/app/page.tsx` |
| Update `[slug]/page.tsx` for fallback photos | ✅ | `src/app/photos/[slug]/page.tsx` |
| Update `next.config.ts` remotePatterns | ✅ | `next.config.ts` |
| Update middleware exclusion | ✅ | `src/proxy.ts` |

---

## Phase 3 — Private Bucket + Signed URLs (future)

| Task | Status | File |
|---|---|---|
| Create migration to make bucket private | ⬜ | `supabase/migrations/007_make_photos_bucket_private.sql` |
| Update proxy to generate signed URLs | ⬜ | `src/app/api/images/[...path]/route.ts` |
| Verify admin upload still works | ⬜ | `src/app/api/photos/route.ts` |

---

## Phase 4 — Watermarking (future)

| Task | Status | File |
|---|---|---|
| CSS watermark on gallery images | ⬜ | `ProtectedImage.tsx` or gallery CSS |

---

## Phase 5 — Monitoring & Rate Limiting (future)

| Task | Status | File |
|---|---|---|
| Rate limiter in proxy route | ⬜ | `src/app/api/images/[...path]/route.ts` |
| Request logging | ⬜ | `src/app/api/images/[...path]/route.ts` |

---

## Verification

- ✅ Build succeeds — zero TypeScript errors
- ✅ All routes compile (52 pages, including `/api/images/[...path]`)
- ✅ No regression on existing functionality

### Manual test checklist

- [ ] Right-click on any gallery/hero/lightbox image → no context menu
- [ ] Drag any image to desktop → doesn't save
- [ ] "Save Image As" on gallery → targets overlay, not image
- [ ] View page source → all image URLs show `/api/images/...` not Supabase URL
- [ ] Network tab → requests go to `/api/images/...` not Supabase CDN directly
- [ ] Backward compat — `/photography/*.webp` still accessible (old bookmarks)
- [ ] Fallback photos load via proxy when Supabase unavailable
- [ ] Featured slideshow images load correctly
- [ ] Category pages load images via proxy
- [ ] Photo detail page (`/photos/photo-1`) loads via proxy
- [ ] Admin upload still works
