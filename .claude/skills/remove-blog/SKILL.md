---
name: remove-blog
description: Remove the blog from A2SaaS. Use when the user says they don't need a blog, want to remove the blog, or delete blog functionality.
---

# Remove Blog

Remove the MDX blog system from the A2SaaS boilerplate.

## Steps

1. **Delete the blog directory**
   ```
   src/app/(marketing)/blog/  (entire folder)
   ```

2. **Delete the blog content directory**
   ```
   src/content/blog/  (entire folder)
   ```

3. **Delete the blog utilities**
   ```
   src/lib/blog.ts
   ```

4. **Remove the Blog nav link** from `src/app/(marketing)/layout.tsx`:
   - Remove `{ href: "/blog", label: "Blog" }` from the `navLinks` array
   - Remove the Blog `<Link>` from the footer

5. **Remove the public route** from `src/proxy.ts`:
   - Remove `"/blog(.*)"` from the `isPublicRoute` matcher

6. **Optional: Remove unused dependencies**
   ```bash
   npm uninstall next-mdx-remote gray-matter reading-time
   ```
   Note: Only do this if the user confirms they want to remove the packages.

7. **Run typecheck** to verify no broken imports:
   ```bash
   npm run typecheck
   ```

## Confirmation

After completing, confirm with the user:
- Blog pages removed
- Navigation updated
- No TypeScript errors
