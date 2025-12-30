# Google Analytics & AdSense Setup Guide

This guide shows you how to add Google Analytics and Google AdSense to the RoTaxCalculator application.

## 📊 Google Analytics (GA4)

### Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use an existing one
3. Create a **GA4 property** (Google Analytics 4)
4. Add a **Data Stream** for web
5. Enter your website URL (e.g., `https://rotaxcalculator.ro`)

### Step 2: Get your Measurement ID

After creating the stream, you'll receive a **Measurement ID** that looks like: `G-XXXXXXXXXX`

### Step 3: Add the code to index.html

In the `index.html` file, find the commented section for Google Analytics in the `<head>`:

```html
<!-- Google Analytics (GA4) -->
<!--
Uncomment and replace G-XXXXXXXXXX with your actual Measurement ID from Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
-->
```

**Replace `G-XXXXXXXXXX` with your Measurement ID and uncomment:**

```html
<!-- Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF456"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF456');
</script>
```

### Step 4: Verification

After publishing your site:
1. Visit your website
2. Open Google Analytics → Realtime
3. You should see your active session

---

## 💰 Google AdSense

### Step 1: Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website URL
4. Complete payment information

### Step 2: Add the AdSense connection code

Google will provide you with a connection code (publisher ID) that looks like: `ca-pub-XXXXXXXXXXXXXXXX`

In `index.html`, find the commented section for AdSense in the `<head>`:

```html
<!-- Google AdSense -->
<!--
Uncomment and replace ca-pub-XXXXXXXXXXXXXXXX with your AdSense publisher ID
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
-->
```

**Replace with your Publisher ID and uncomment:**

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### Step 3: Wait for approval

- Google will review your site (may take several days to weeks)
- You'll receive an email when your site is approved
- **IMPORTANT**: The site must be live and have original content

### Step 4: Create ad units

After approval:

1. In AdSense, go to **Ads** → **By ad unit**
2. Create a **Display ad** (responsive)
3. Get the HTML code for the ad unit
4. The code will look like this:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Step 5: Place ads in index.html

We've already prepared a placeholder between the form and results. Find:

```html
<!-- Google AdSense - Ad Placeholder (between form and results) -->
<!--
Example AdSense ad unit - Uncomment and configure after approval
...
-->
```

**Replace with your actual AdSense code:**

```html
<!-- Google AdSense - Ad between form and results -->
<div style="text-align: center; margin: 30px 0;">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="9876543210"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

### Recommended ad placements:

1. **Between form and results** (already prepared) - high visibility when user calculates
2. **At the bottom of the page** - after results
3. **In sidebar** (if you add one for desktop)

---

## ✅ Final Checklist

### Google Analytics:
- [ ] Created GA4 account
- [ ] Have Measurement ID (`G-XXXXXXXXXX`)
- [ ] Added code to `<head>`
- [ ] Removed comments
- [ ] Verified in Realtime that it works

### Google AdSense:
- [ ] Applied for AdSense
- [ ] Site is live and public
- [ ] Have Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
- [ ] Added connection code to `<head>`
- [ ] Waited for approval
- [ ] Created ad units
- [ ] Placed ads on page
- [ ] Ads display correctly

---

## 🔧 Tips & Best Practices

### Google Analytics:
- **Privacy**: Inform users about cookies (GDPR compliance)
- **Custom events**: You can add tracking for specific actions:
  ```javascript
  gtag('event', 'calculate_taxes', {
    'tax_year': 2025,
    'has_dividends': true
  });
  ```

### Google AdSense:
- **Don't click your own ads** - you risk being banned
- **Strategic placement**: Put ads where users have natural pauses
- **Responsive**: Our ads are already responsive (`data-full-width-responsive="true"`)
- **Loading**: Ads load async so they don't slow down the site
- **Content Policy**: Ensure your site complies with [AdSense Program Policies](https://support.google.com/adsense/answer/48182)

### GDPR & Cookies:
- Consider adding a **Cookie Consent banner**
- Popular option: [Cookie Consent by Osano](https://www.osano.com/cookieconsent) - free and open source
- Simple example:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"></script>
  <script>
  window.cookieconsent.initialise({
    palette: {
      popup: {background: "#1e293b"},
      button: {background: "#3b82f6"}
    },
    theme: "classic",
    content: {
      message: "This site uses cookies for analytics and advertising.",
      dismiss: "Got it",
      link: "Privacy Policy"
    }
  });
  </script>
  ```

---

## 📈 Performance Monitoring

### Google Analytics - Useful Metrics:
- **Users**: How many unique users
- **Sessions**: Total number of sessions
- **Engagement Rate**: How long users spend on site
- **Events**: Track actions (calculate, clear, year change)

### Google AdSense - Important Metrics:
- **RPM** (Revenue Per Mille): Revenue per 1000 views
- **CTR** (Click-Through Rate): Percentage of clicks on ads
- **CPC** (Cost Per Click): How much you earn per click
- **Impressions**: How many ads are displayed

---

## 🚀 Next Steps After Setup

1. **SEO**: Optimize for search engines
   - Meta tags (description, keywords)
   - Open Graph for social media
   - Schema.org markup

2. **Performance**:
   - Lighthouse audit (Google Chrome DevTools)
   - PageSpeed Insights

3. **Marketing**:
   - Share on social media
   - Investment forums (Reddit, Romanian investment communities)
   - Facebook groups for Romanian investors

---

## 💡 Advanced Google Analytics Events

You can track specific user interactions to better understand usage:

```javascript
// Track when user calculates taxes
function trackCalculation(year, incomeTypes) {
    gtag('event', 'calculate_taxes', {
        'tax_year': year,
        'income_types': incomeTypes.join(','),
        'event_category': 'calculator',
        'event_label': 'tax_calculation'
    });
}

// Track when user switches years
function trackYearSwitch(fromYear, toYear) {
    gtag('event', 'switch_year', {
        'from_year': fromYear,
        'to_year': toYear,
        'event_category': 'navigation'
    });
}

// Track section toggles
function trackSectionToggle(sectionName, enabled) {
    gtag('event', 'toggle_section', {
        'section': sectionName,
        'enabled': enabled,
        'event_category': 'form_interaction'
    });
}
```

These events can be added to your `app.js` file to track user behavior and optimize your calculator.

---

## 📱 Mobile Optimization

Both Google Analytics and AdSense work great on mobile, but consider:

1. **Ad placement on mobile**: Ads should not block content
2. **Responsive ads**: We're using `data-full-width-responsive="true"` which adapts to screen size
3. **Analytics mobile tracking**: GA4 automatically tracks mobile vs desktop users

---

## 🔒 Privacy & GDPR Compliance

For European users (GDPR), you should:

1. **Cookie Consent**: Show a consent banner before loading tracking scripts
2. **Privacy Policy**: Create a page explaining data collection
3. **User Rights**: Allow users to opt-out of tracking

Example implementation with conditional loading:

```javascript
// Only load analytics after user consent
function loadAnalytics() {
    if (userHasConsented()) {
        // Load Google Analytics
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX', {
            'anonymize_ip': true  // Anonymize IP for GDPR
        });
    }
}
```

---

**Good luck with monetizing your application! 🎉**
