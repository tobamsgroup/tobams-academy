---
name: Align Course Detail Icons
overview: Normalize the five course-detail icons to match the existing `ICONS` component pattern, export them from the icon index, and replace `Check` bullets in course details with those custom icons.
todos:
  - id: normalize-course-icons
    content: Refactor the five course icon files to the shared FC<Iconprops> format with configurable props and preserved SVG paths
    status: completed
  - id: export-course-icons
    content: Add course icon imports and exports in frontend/src/assets/icons/index.ts
    status: completed
  - id: replace-check-icons
    content: Swap Check list bullets for ICONS.Video/BookDownload/Device/Lifebuoy/Certificate in CourseDetailsBody
    status: completed
  - id: lint-pass
    content: Run lint diagnostics on edited files and resolve any introduced issues
    status: completed
isProject: false
---

# Align course detail icons with icon system

## Scope
Update course-detail feature icons so they follow the same structure as existing icon components, are available from the central icon registry, and are used in the “This course includes” list.

## Files to update
- [frontend/src/assets/icons/courses-icons/BookDownload.tsx](frontend/src/assets/icons/courses-icons/BookDownload.tsx)
- [frontend/src/assets/icons/courses-icons/Video.tsx](frontend/src/assets/icons/courses-icons/Video.tsx)
- [frontend/src/assets/icons/courses-icons/Device.tsx](frontend/src/assets/icons/courses-icons/Device.tsx)
- [frontend/src/assets/icons/courses-icons/Lifebuoy.tsx](frontend/src/assets/icons/courses-icons/Lifebuoy.tsx)
- [frontend/src/assets/icons/courses-icons/Certificate.tsx](frontend/src/assets/icons/courses-icons/Certificate.tsx)
- [frontend/src/assets/icons/index.ts](frontend/src/assets/icons/index.ts)
- [frontend/src/components/course-details/CourseDetailsBody.tsx](frontend/src/components/course-details/CourseDetailsBody.tsx)

## Implementation approach
1. Convert each course icon component to the project icon pattern used across `ICONS`:
   - import `Iconprops` from `@/types`
   - define as `FC<Iconprops>`
   - expose `width`, `height`, `className`, `onClick`, `stroke`, `strokeWidth` props with sensible defaults (matching the current 20x20 and `#474348` design)
   - keep existing SVG paths so visual appearance stays consistent with your supplied art
2. Ensure `BookDownload` has real SVG content (it is currently empty), using the same course-icon visual style as the others.
3. Add all five course icons to [frontend/src/assets/icons/index.ts](frontend/src/assets/icons/index.ts):
   - add imports from `./courses-icons/...`
   - add entries to the exported `ICONS` object for app-wide usage
4. Replace `Check` icons in [frontend/src/components/course-details/CourseDetailsBody.tsx](frontend/src/components/course-details/CourseDetailsBody.tsx):
   - remove `Check` from `lucide-react` import
   - import `ICONS` from `@/assets/icons`
   - map each line item to the matching icon (`Video`, `BookDownload`, `Device`, `Lifebuoy`, `Certificate`)
   - keep spacing/typography classes and set icon size to match list rhythm
5. Run lint diagnostics on edited files and fix any introduced type/lint issues.

## Key existing references
Use this existing icon pattern as the standard baseline:

```1:18:frontend/src/assets/icons/Cart.tsx
import { Iconprops } from "@/types";
import React, { FC } from "react";

const Cart: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#303869"}
      strokeWidth={props?.strokeWidth || "2"}
```

Current target list to replace:

```201:206:frontend/src/components/course-details/CourseDetailsBody.tsx
<ul className="space-y-2 text-sm text-[#474348]">
  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> 65.5 hours on-demand video</li>
  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> 48 downloadable resources</li>
  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Access on mobile and TV</li>
  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Full lifetime access</li>
  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Certificate of completion</li>
```
