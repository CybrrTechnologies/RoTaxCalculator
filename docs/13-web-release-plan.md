# Web Release Plan - impoziteonline.ro

## Key Dates

| Milestone | Date | Notes |
|-----------|------|-------|
| **Today** | Jan 3, 2026 | Start |
| **Phase 1 Launch** | Jan 15, 2026 | Soft launch, gather feedback |
| **Phase 2** | Feb 1, 2026 | Analytics + feedback widget |
| **Phase 3** | Mar 1, 2026 | Polish + edge cases |
| **ANAF Pre-fills** | Mar 31, 2026 | Users start checking their data |
| **Phase 4 (Ready)** | Apr 25, 2026 | Full ready, 1 month before deadline |
| **Filing Deadline** | May 25, 2026 | Peak traffic expected |

**Time Available**: ~16 weeks

---

## Current State (Already Built)

The web app at `web/` already has:
- ✅ Tax calculator (dividends, capital gains, crypto, rental, interest)
- ✅ CASS calculation with brackets
- ✅ Year selector (2025/2026)
- ✅ SEO meta tags, OG tags, structured data
- ✅ Privacy modal (GDPR compliant)
- ✅ Print/Save PDF button
- ✅ Responsive design
- ✅ LocalStorage persistence
- ✅ MINIMUM_WAGE correct: 4,050 RON (Jan 1 value, NOT average)
- ✅ Year-over-year rate comparisons (+X% față de 2025)
- ⚠️ GA4 placeholder (commented out)
- ❌ Feedback widget
- ❌ Email capture

---

## Phase 1: Soft Launch (Jan 3-15, 2026)

**Goal**: Get live, fix critical bugs, start indexing

### Tasks

| Task | Priority | Status |
|------|----------|--------|
| ~~Fix MINIMUM_WAGE for 2026~~ | ~~P0~~ | ✅ Done (4,050 RON) |
| Deploy to Vercel/Netlify/Cloudflare | P0 | Pending |
| Configure DNS for impoziteonline.ro | P0 | Pending |
| Test all income types manually | P0 | Pending |
| Test CASS brackets (6/12/24 MW) | P0 | Pending |
| Submit sitemap to Google Search Console | P1 | Pending |
| Create og-image.png for social sharing | P1 | Pending |
| Add robots.txt tweaks if needed | P2 | Pending |

### Deliverables
- [ ] Site live at impoziteonline.ro
- [ ] All calculations verified correct
- [ ] Google Search Console configured
- [ ] Social sharing works

---

## Phase 2: Analytics + Feedback (Jan 16 - Feb 1, 2026)

**Goal**: Understand users, collect feedback

### Tasks

| Task | Priority | Est. Time |
|------|----------|-----------|
| Uncomment & configure Google Analytics (GA4) | P0 | 1 hour |
| Add custom events for key actions | P0 | 2 hours |
| Add feedback widget (Tally/Typeform embed or custom) | P0 | 2 hours |
| Add simple email capture (optional) | P1 | 2 hours |
| Add "Report Bug" button | P1 | 1 hour |
| Track income types used | P1 | 1 hour |
| Track CASS bracket distribution | P1 | 1 hour |

### Analytics Events to Track

```javascript
// Custom events to implement
gtag('event', 'calculation_complete', {
  income_types: ['dividends', 'crypto'],
  total_income: 50000,
  cass_bracket: '6-12 MW',
  tax_year: 2025
});

gtag('event', 'income_type_added', {
  type: 'crypto'
});

gtag('event', 'feedback_submitted');
gtag('event', 'print_results');
```

### Feedback Widget Options

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| Tally.so embed | Beautiful, free tier | Limited features | Free |
| Typeform | Professional | Pricey for volume | €25/mo |
| Custom form | Full control | Dev time | Free |
| Canny | Feature voting | Overkill for MVP | Free tier |

**Recommendation**: Start with Tally.so (free, easy embed)

### Deliverables
- [ ] GA4 tracking live
- [ ] Feedback widget embedded
- [ ] Dashboard to view metrics
- [ ] First week of data collected

---

## Phase 3: Polish + Edge Cases (Feb 2 - Mar 1, 2026)

**Goal**: Fix issues from feedback, handle edge cases

### Tasks

| Task | Priority | Est. Time |
|------|----------|-----------|
| Review and prioritize feedback | P0 | Ongoing |
| Fix top 3 reported bugs | P0 | Variable |
| Add FAQ section (common questions) | P1 | 3 hours |
| Add tooltips/help for complex fields | P1 | 2 hours |
| Improve mobile UX (based on data) | P1 | 3 hours |
| Add more examples/use cases | P2 | 2 hours |
| Performance optimization (Lighthouse) | P2 | 2 hours |
| Add loading states | P2 | 1 hour |

### Edge Cases to Test

| Scenario | Expected Behavior |
|----------|-------------------|
| Zero income | No CASS, clear message |
| Only exempt crypto (<600 RON) | 0 tax, 0 CASS |
| Mixed domestic + foreign dividends | Both calculated, credits applied |
| Loss carryforward | 70% rule applied correctly |
| Income exactly at bracket boundary | Correct bracket selected |
| Very large numbers (>1M RON) | No overflow, formatting OK |
| Negative numbers entered | Validation error |

### Deliverables
- [ ] Top 3 bugs fixed
- [ ] FAQ section added
- [ ] Mobile UX improved
- [ ] Lighthouse score > 90

---

## Phase 4: Ready for Peak (Mar 2 - Apr 25, 2026)

**Goal**: Stability, handle traffic, final polish

### Tasks

| Task | Priority | Est. Time |
|------|----------|-----------|
| Add "What's New for 2026" banner | P0 | 1 hour |
| Add deadline reminder (May 25) | P0 | 30 min |
| Stress test (simulate traffic) | P1 | 2 hours |
| Add share results feature (URL or image) | P1 | 3 hours |
| Create social media posts | P1 | 2 hours |
| Prepare for ANAF pre-fill period | P1 | 1 hour |
| Add "Compare 2025 vs 2026" feature | P2 | 3 hours |
| Add cookie consent if GA4 active | P2 | 1 hour |

### Traffic Preparation

- Vercel/Netlify handle scaling automatically
- Monitor GA4 for traffic spikes
- Have fallback plan (static HTML if needed)

### Marketing (Low-Effort)

| Channel | Action | When |
|---------|--------|------|
| Reddit r/Romania | Helpful post about tax changes | Mar 15 |
| Reddit r/robursa | Share calculator | Mar 15 |
| Facebook groups | Romanian investors groups | Apr 1 |
| LinkedIn | Personal post | Apr 1 |

### Deliverables
- [ ] Site stable under load
- [ ] Deadline reminder visible
- [ ] Social media ready
- [ ] "What's New" banner live

---

## Phase 5: Peak Season (Apr 26 - May 25, 2026)

**Goal**: Monitor, support, iterate

### Tasks

| Task | Priority | Est. Time |
|------|----------|-----------|
| Monitor daily traffic/errors | P0 | 15 min/day |
| Respond to feedback quickly | P0 | As needed |
| Fix any critical bugs immediately | P0 | As needed |
| Collect testimonials | P2 | Ongoing |
| Plan Phase 2 features (PDF, etc.) | P2 | After May 25 |

---

## Summary Timeline

```
Jan 2026                Feb 2026                Mar 2026                Apr 2026                May 2026
|----Phase 1----|----Phase 2----|----Phase 3----|----Phase 4----|----Phase 5----|
     Soft Launch     Analytics       Polish          Ready           Peak Season
     (Jan 15)        (Feb 1)         (Mar 1)         (Apr 25)        (May 25 deadline)
                                                         |
                                                    ANAF Pre-fills
                                                    (Mar 31)
```

---

## Success Metrics

### Phase 1 (Jan 15)
- [ ] Site live and functional
- [ ] 0 critical bugs

### Phase 2 (Feb 1)
- [ ] Analytics live
- [ ] 10+ feedback submissions

### Phase 3 (Mar 1)
- [ ] Lighthouse score > 90
- [ ] Top issues resolved

### Phase 4 (Apr 25)
- [ ] 500+ unique visitors
- [ ] 200+ calculations completed
- [ ] Ready for traffic spike

### Phase 5 (May 25)
- [ ] 1,000+ calculations
- [ ] Positive feedback
- [ ] List of features for v2

---

## Immediate Next Steps (Today)

1. ~~**Fix MINIMUM_WAGE bug**~~ - ✅ Already correct: 4,050 RON (Jan 1 value)
2. **Deploy to Vercel** - Get live today
3. **Configure DNS** - Point impoziteonline.ro
4. **Test all flows** - Manual QA
5. **Submit to Search Console** - Start indexing

---

## Post-Filing Season (June 2026+)

After May 25, evaluate:
- Total users / calculations
- Most requested features
- Revenue potential (if any)

If validated, Phase 2 features:
- Form 212 PDF generation
- ANAF XML export
- Broker statement import
- User accounts (optional)
- Premium features (TBD)
