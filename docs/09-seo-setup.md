# SEO Setup Guide

## Overview

This document outlines the SEO implementation for RoTaxCalculator and provides steps for ongoing optimization.

---

## ✅ Completed SEO Implementation

### 1. Meta Tags in `index.html`

Added comprehensive SEO meta tags in the `<head>` section:

- **Basic SEO**:
  - `<meta name="description">` - Shows in Google search results
  - `<meta name="keywords">` - Helps with search relevance
  - `<meta name="robots" content="index, follow">` - Tells search engines to index
  - `<meta http-equiv="content-language" content="ro">` - Specifies Romanian language
  - `<link rel="canonical">` - Prevents duplicate content issues

- **Open Graph (Facebook/LinkedIn)**:
  - `og:type`, `og:url`, `og:title`, `og:description`, `og:image`
  - Makes links look beautiful when shared on social media

- **Twitter Cards**:
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - Beautiful previews on Twitter/X

- **Structured Data (JSON-LD)**:
  - Schema.org `WebApplication` type
  - Helps Google show rich snippets in search results
  - Includes app category, language, pricing info

### 2. `robots.txt`

Created `/web/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://impoziteonline.ro/sitemap.xml
```

Tells search engines:
- All bots are welcome
- All pages can be crawled
- Where to find the sitemap

### 3. `sitemap.xml`

Created `/web/sitemap.xml`:
- Lists all pages (currently just homepage)
- Includes last modified date, change frequency, priority
- Helps search engines discover and index content

---

## 📋 Next Steps (Post-Deployment)

### Immediate Actions

#### 1. Configure Custom Domain (impoziteonline.ro)

**Domain**: `impoziteonline.ro` (purchased from ROTLD)

✅ **All SEO files already updated with this domain**

**DNS Configuration**:

**Option A: Using Cloudflare (Recommended)**
1. Sign up at https://dash.cloudflare.com
2. Add domain `impoziteonline.ro`
3. Update ROTLD nameservers to Cloudflare's (e.g., `ns1.cloudflare.com`)
4. In Cloudflare DNS, add:
   - 4x A records pointing to GitHub Pages IPs (185.199.108-111.153)
   - CNAME record: `www` → `peterrobert.github.io`
   - Set Proxy to OFF (gray cloud)

**Option B: Using ROTLD DNS**
1. Find ROTLD's DNS management section
2. Add same A records and CNAME as above

**GitHub Pages Configuration**:
1. Go to repo Settings → Pages
2. Custom domain: `impoziteonline.ro`
3. Check "Enforce HTTPS" (after DNS propagates)

#### 2. Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://impoziteonline.ro/`
3. Verify ownership (HTML file upload or meta tag)
4. Submit sitemap: `https://impoziteonline.ro/sitemap.xml`
5. Request indexing for homepage

#### 3. Create Open Graph Image

The meta tags reference `og-image.png` which doesn't exist yet.

**Specifications**:
- Size: **1200 x 630 pixels** (Facebook/Twitter recommended)
- Format: PNG or JPG
- File: Save as `web/og-image.png`

**Content suggestions**:
- Domain name: "impoziteonline.ro"
- Tagline: "Calculator Taxe Investiții România 2026"
- Visual: Calculator icon, Romanian flag colors, clean design
- Keep text readable (avoid small fonts)

**Tools**:
- [Canva](https://www.canva.com) - Free templates
- [Figma](https://www.figma.com) - Design from scratch
- [OG Image Generator](https://og-image.vercel.app/) - Quick generation

#### 4. Test SEO Implementation

**Facebook Sharing Debugger**:
- URL: https://developers.facebook.com/tools/debug/
- Paste your site URL
- Check preview looks correct
- Click "Scrape Again" if you make changes

**Twitter Card Validator**:
- URL: https://cards-dev.twitter.com/validator
- Paste your site URL
- Verify card preview

**Google Rich Results Test**:
- URL: https://search.google.com/test/rich-results
- Test your structured data (JSON-LD)
- Fix any errors/warnings

**SEO Meta Inspector**:
- Use browser extension like "META SEO inspector"
- Verify all tags are present

---

## 🔍 SEO Best Practices

### Content Optimization

- ✅ Use semantic HTML (`<header>`, `<main>`, `<footer>`, `<section>`)
- ✅ Keep page title under 60 characters
- ✅ Keep meta description under 160 characters
- ✅ Use descriptive headings (H1, H2, H3)
- ⚠️ Consider adding a blog/FAQ section for more keywords

### Technical SEO

- ✅ Mobile-responsive (viewport meta tag)
- ✅ Fast loading (static HTML, minimal JS)
- ✅ HTTPS (GitHub Pages provides this)
- ✅ Clean URL structure
- ⚠️ Consider adding favicon (improves click-through rate)

### Ongoing Optimization

1. **Monitor Performance**:
   - Google Search Console - Track impressions, clicks, CTR
   - Google Analytics - Track user behavior (when enabled)

2. **Update Content**:
   - Keep tax rules current (update for 2027, 2028, etc.)
   - Update `<lastmod>` in sitemap.xml when content changes
   - Add new pages (FAQ, guides, examples)

3. **Build Backlinks**:
   - Share on Romanian finance forums
   - Post on Reddit (r/Romania, r/robursa)
   - Submit to Romanian tech/finance directories
   - Write guest posts on investment blogs

4. **Keyword Research**:
   - Use Google Search Console to find queries people use
   - Optimize content for high-performing keywords
   - Add new sections based on user search intent

---

## 📊 Target Keywords

### Primary Keywords
- calculator taxe romania
- impozit dividende romania
- calculator cass investitii
- declaratie unica 212
- taxe crypto romania

### Secondary Keywords
- capital gains romania calculator
- taxe actiuni straine
- impozit chirii romania
- calculator investitii romania 2026
- dividende straine taxare romania

### Long-tail Keywords
- cum se calculeaza cass la investitii
- impozit trading212 romania
- taxe interactive brokers romania
- declaratie unica crypto romania
- pierderi reportate capital gains

---

## 🚀 Advanced SEO (Future Considerations)

### 1. Add Frequently Asked Questions (FAQ)

Create an FAQ section with structured data:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Cum se calculează CASS la investiții?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "CASS se calculează la 10% din venitul net anual..."
    }
  }]
}
</script>
```

### 2. Add Breadcrumbs (If Multi-Page)

If you add multiple pages:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Acasă",
    "item": "https://impoziteonline.ro/"
  }]
}
</script>
```

### 3. Performance Optimization

- Minify CSS/JS files
- Optimize images (use WebP format)
- Enable browser caching
- Consider CDN for static assets

### 4. Local SEO (If Targeting Romanian Market)

Add location-specific structured data:
```json
{
  "@type": "LocalBusiness",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "RO"
  }
}
```

---

## 📝 Current SEO Checklist Status

- [x] Meta description
- [x] Meta keywords
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (JSON-LD)
- [x] robots.txt
- [x] sitemap.xml
- [x] Canonical URL
- [x] Language tags
- [x] Semantic HTML
- [x] Mobile responsive
- [x] Custom domain configured (impoziteonline.ro)
- [ ] DNS setup at ROTLD/Cloudflare (in progress)
- [ ] Favicon (todo)
- [ ] Open Graph image (todo)
- [ ] Google Search Console submission (post-DNS)
- [ ] FAQ section (future)
- [ ] Blog/guides (future)

---

## 🔗 Useful Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Documentation](https://schema.org/)
- [Moz SEO Learning Center](https://moz.com/learn/seo)

---

**Last Updated**: January 30, 2025
**Status**: SEO foundation complete, ready for deployment and testing
