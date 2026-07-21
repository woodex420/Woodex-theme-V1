import { useEffect } from "react";
import { SITE, type PageSEO } from "../data/seo";

// Reusable SEO head manager. Mirrors the output of a WordPress SEO plugin
// (Yoast / RankMath) including JSON-LD structured data.

export function SEO({ page }: { page: PageSEO }) {
  useEffect(() => {
    document.title = page.title;

    setMeta("description", page.description);
    setMeta("keywords", page.keywords.join(", "));
    setMeta("robots", page.noindex ? "noindex,nofollow" : "index,follow");
    setLink("canonical", page.canonical);

    // Open Graph
    setMetaProperty("og:title", page.title);
    setMetaProperty("og:description", page.description);
    setMetaProperty("og:url", page.canonical);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:site_name", SITE.name);
    setMetaProperty("og:locale", SITE.locale);
    if (page.ogImage) setMetaProperty("og:image", page.ogImage);

    // Twitter
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:site", SITE.twitter);
    setMetaName("twitter:title", page.title);
    setMetaName("twitter:description", page.description);
    if (page.ogImage) setMetaName("twitter:image", page.ogImage);

    // Article author
    setMetaName("author", SITE.name);
    setMetaName("geo.region", "PK");
    setMetaName("geo.placename", SITE.address.city);
    setMetaName("ICBM", `${SITE.geo.lat}, ${SITE.geo.lng}`);

    // JSON-LD structured data
    const id = "ld-json-page";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify(buildSchema(page));
    document.head.appendChild(script);
  }, [page]);

  return null;
}

function setMeta(name: string, value: string) {
  if (!value) return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
function setMetaName(name: string, value: string) {
  setMeta(name, value);
}
function setMetaProperty(prop: string, value: string) {
  if (!value) return;
  let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
function setLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function buildSchema(page: PageSEO) {
  const base = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE.url}/#localbusiness`,
        name: SITE.name,
        description: SITE.description,
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        image: SITE.logo,
        logo: SITE.logo,
        priceRange: "$$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postal,
          addressCountry: SITE.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        openingHoursSpecification: SITE.hours.map(([d, h]) => {
          const [open, close] = h.split("-");
          return {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: d,
            opens: open,
            closes: close,
          };
        }),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: SITE.rating.value,
          reviewCount: SITE.rating.count,
          bestRating: "5",
          worstRating: "1",
        },
        sameAs: Object.values(SITE.social),
        areaServed: [
          { "@type": "City", name: "Lahore" },
          { "@type": "City", name: "Karachi" },
          { "@type": "City", name: "Islamabad" },
          { "@type": "Country", name: "Pakistan" },
        ],
        foundingDate: SITE.founded,
        knowsAbout: [
          "Interior Design",
          "Office Interior Design",
          "Restaurant Interior Design",
          "Cafe Interior Design",
          "Retail Interior Design",
          "3D Visualization",
          "Renovation",
          "Furniture Design",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#localbusiness` },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": page.canonical,
        url: page.canonical,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${SITE.url}/#website` },
        inLanguage: "en-US",
      },
    ],
  };

  if (page.schema === "Service") {
    return {
      ...base,
      "@graph": [
        ...base["@graph"],
        {
          "@type": "Service",
          name: "3D Visualization for Interior Design",
          serviceType: "3D Visualization",
          provider: { "@id": `${SITE.url}/#localbusiness` },
          areaServed: { "@type": "Country", name: "Pakistan" },
          description: page.description,
        },
      ],
    };
  }
  return base;
}
