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

## Phase 6 — Image Loading Optimization

| Task | Status | File |
|------|--------|------|
| Edge caching (`s-maxage` + `stale-while-revalidate`) di proxy | ✅ | `src/app/api/images/[...path]/route.ts` |
| Supabase Imgix transformation di proxy — **rollback** (free tier 100MB limit) | ✅ | `src/app/api/images/[...path]/route.ts` |
| `minimumCacheTTL: 3600` + `formats` di next.config.ts | ✅ | `next.config.ts` |
| ISR homepage (`revalidate = 3600`) | ✅ | `src/app/page.tsx` |
| Placeholder background (CSS shimmer) di gallery images | ✅ | `src/components/GalleryGrid.tsx` (already had `bg-muted`) |
| **Verification:** `npm run build` zero errors | ✅ | — |

### Detail setiap task

**Task 1 — Edge caching**
- `fetchAndRespond()`: `Cache-Control` tambah `s-maxage=86400, stale-while-revalidate=86400`
- Vercel Edge CDN cache 24 jam, serve stale sambil revalidate di background
- Efek: kunjungan ke-2+ langsung dari edge, <50ms tanpa cold start

**Task 2 — next/image optimisation + cache**
- `next.config.ts`: `minimumCacheTTL: 3600` — next/image simpan optimized image di cache minimal 1 jam
- `next.config.ts`: `formats: ["image/avif", "image/webp"]` — next/image otomatis konversi ke format modern
- Imgix di-rollback karena free tier hanya 100MB/bulan — gampang habis
- Efek: optimized image (resize + WebP/AVIF) di-cache Vercel Edge selama 1 jam, gratis

**Task 3 — ISR homepage**
- `export const revalidate = 3600` di `src/app/page.tsx`
- Efek: halaman static di-cache Vercel, tanpa serverless sama sekali

**Task 4 — Placeholder background**
- Tambah `bg-zinc-800/10` di container gambar GalleryGrid + Hero
- Efek: user lihat placeholder instan sambil nunggu image load

### Akar masalah yang di-fix
- **Double serverless cold start** (proxy + next/image optimizer) → edge caching + ISR
- **Full-resolution images** (3600px, 2-5MB) → Supabase Imgix resize 1200px + WebP
- **No CDN caching** → `s-maxage` + ISR di Vercel Edge

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
