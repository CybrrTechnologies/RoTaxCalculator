# Google Analytics & AdSense Setup Guide

Acest ghid îți arată cum să adaugi Google Analytics și Google AdSense la aplicația RoTaxCalculator.

## 📊 Google Analytics (GA4)

### Pasul 1: Creează un cont Google Analytics

1. Du-te la [Google Analytics](https://analytics.google.com/)
2. Creează un cont nou sau folosește unul existent
3. Creează o **proprietate GA4** (Google Analytics 4)
4. Adaugă un **Data Stream** pentru web
5. Introdu URL-ul site-ului tău (ex: `https://rotaxcalculator.ro`)

### Pasul 2: Obține Measurement ID

După ce creezi stream-ul, vei primi un **Measurement ID** care arată așa: `G-XXXXXXXXXX`

### Pasul 3: Adaugă codul în index.html

În fișierul `index.html`, găsește secțiunea comentată pentru Google Analytics în `<head>`:

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

**Înlocuiește `G-XXXXXXXXXX` cu Measurement ID-ul tău și elimină comentariile:**

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

### Pasul 4: Verificare

După ce publici site-ul:
1. Vizitează site-ul tău
2. Deschide Google Analytics → Realtime
3. Ar trebui să vezi sesiunea ta activă

---

## 💰 Google AdSense

### Pasul 1: Aplică pentru Google AdSense

1. Du-te la [Google AdSense](https://www.google.com/adsense/)
2. Înscrie-te cu contul tău Google
3. Adaugă URL-ul site-ului tău
4. Completează informațiile despre plăți

### Pasul 2: Adaugă codul de conectare AdSense

Google îți va da un cod de conectare (publisher ID) care arată așa: `ca-pub-XXXXXXXXXXXXXXXX`

În `index.html`, găsește secțiunea comentată pentru AdSense în `<head>`:

```html
<!-- Google AdSense -->
<!--
Uncomment and replace ca-pub-XXXXXXXXXXXXXXXX with your AdSense publisher ID
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
-->
```

**Înlocuiește cu Publisher ID-ul tău și elimină comentariile:**

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### Pasul 3: Așteaptă aprobarea

- Google va revizui site-ul tău (poate dura câteva zile - săptămâni)
- Vei primi un email când site-ul este aprobat
- **IMPORTANT**: Site-ul trebuie să fie live și să aibă conținut original

### Pasul 4: Creează unități de reclame

După aprobare:

1. În AdSense, du-te la **Ads** → **By ad unit**
2. Creează o **Display ad** (responsive)
3. Obține codul HTML pentru ad unit
4. Codul va arăta așa:

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

### Pasul 5: Plasează reclamele în index.html

Am pregătit deja un placeholder între formular și rezultate. Găsește:

```html
<!-- Google AdSense - Ad Placeholder (between form and results) -->
<!--
Example AdSense ad unit - Uncomment and configure after approval
...
-->
```

**Înlocuiește cu codul tău real de la AdSense:**

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

### Locații recomandate pentru reclame:

1. **Între formular și rezultate** (deja pregătit) - vizibilitate mare când utilizatorul calculează
2. **La sfârșitul paginii** - după rezultate
3. **În sidebar** (dacă vei adăuga unul pentru desktop)

---

## ✅ Checklist final

### Google Analytics:
- [ ] Am creat cont GA4
- [ ] Am Measurement ID (`G-XXXXXXXXXX`)
- [ ] Am adăugat codul în `<head>`
- [ ] Am eliminat comentariile
- [ ] Am verificat în Realtime că funcționează

### Google AdSense:
- [ ] Am aplicat pentru AdSense
- [ ] Site-ul este live și public
- [ ] Am Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
- [ ] Am adăugat codul de conectare în `<head>`
- [ ] Am așteptat aprobarea
- [ ] Am creat ad units
- [ ] Am plasat reclamele în pagină
- [ ] Reclamele se afișează corect

---

## 🔧 Tips & Best Practices

### Google Analytics:
- **Privacy**: Informează utilizatorii despre cookies (GDPR)
- **Events personalizate**: Poți adăuga tracking pentru acțiuni specifice:
  ```javascript
  gtag('event', 'calculate_taxes', {
    'tax_year': 2025,
    'has_dividends': true
  });
  ```

### Google AdSense:
- **Nu clickui pe propriile reclame** - riști să fii banat
- **Plasare strategică**: Pune reclamele unde utilizatorii au pauze naturale
- **Responsive**: Reclamele noastre sunt deja responsive (`data-full-width-responsive="true"`)
- **Loading**: Reclamele se încarcă async pentru a nu încetini site-ul
- **Content Policy**: Asigură-te că site-ul respectă [AdSense Program Policies](https://support.google.com/adsense/answer/48182)

### GDPR & Cookies:
- Consideră să adaugi un **Cookie Consent banner**
- Popular: [Cookie Consent by Osano](https://www.osano.com/cookieconsent) - gratuit și open source
- Exemplu simplu:
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
      message: "Acest site folosește cookies pentru analiză și reclame.",
      dismiss: "Am înțeles",
      link: "Politica de confidențialitate"
    }
  });
  </script>
  ```

---

## 📈 Monitorizare performanță

### Google Analytics - Metrici utile:
- **Users**: Câți utilizatori unici
- **Sessions**: Câte sesiuni totale
- **Engagement Rate**: Cât timp petrec pe site
- **Events**: Tracking acțiuni (calculate, clear, year change)

### Google AdSense - Metrici importante:
- **RPM** (Revenue Per Mille): Venit per 1000 vizualizări
- **CTR** (Click-Through Rate): Procent de clickuri pe reclame
- **CPC** (Cost Per Click): Câți bani câștigi per click
- **Impressions**: Câte reclame sunt afișate

---

## 🚀 Next Steps după setup

1. **SEO**: Optimizează pentru motoarele de căutare
   - Meta tags (description, keywords)
   - Open Graph pentru social media
   - Schema.org markup

2. **Performance**:
   - Lighthouse audit (Google Chrome DevTools)
   - PageSpeed Insights

3. **Marketing**:
   - Share pe social media
   - Forum-uri despre investiții (Reddit, Wall Street Romania)
   - Grupuri Facebook pentru investitori români

---

**Succes cu monetizarea aplicației! 🎉**
