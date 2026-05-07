# Stories thumbnails

Drop the JPG/PNG/WebP files for each post here, named by slug:

- `manila-mornings.jpg`   (TikTok · 9:16)
- `golden-hour-dump.jpg`  (Instagram · 1:1)
- `manila-to-next.jpg`    (Facebook · 16:9)

Then in `src/components/sections/Stories.tsx`, add the `thumb` field
to the matching `Post` object, e.g.:

```ts
{
  platform: "tiktok",
  url: "...",
  title: "...",
  blurb: "...",
  tag: "Daily-life vlog",
  thumb: "/stories/manila-mornings.jpg",
}
```

The card will switch from the gradient placeholder to the real image
automatically — no further changes needed.
