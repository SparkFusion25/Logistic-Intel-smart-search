import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

// Common structured data generators
export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Logistic Intel",
  "url": "https://logisticintel.com",
  "description": "Global freight intelligence, CRM, and outreach platform",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://logisticintel.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Logistic Intel",
  "url": "https://logisticintel.com",
  "logo": "https://logisticintel.com/logo.png",
  "description": "Global freight intelligence, CRM, and outreach platform for logistics professionals",
  "foundingDate": "2019",
  "industry": "Logistics Technology",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-LOGISTIC",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://linkedin.com/company/logistic-intel",
    "https://twitter.com/logisticintel"
  ]
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "url": article.url,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Logistic Intel",
    "logo": {
      "@type": "ImageObject",
      "url": "https://logisticintel.com/logo.png"
    }
  },
  "datePublished": article.publishDate,
  "dateModified": article.modifiedDate || article.publishDate,
  "image": article.image || "https://logisticintel.com/og/default.jpg"
});

export const createProductSchema = (product: {
  name: string;
  description: string;
  price: string;
  currency: string;
  features: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": "https://schema.org/InStock"
  },
  "features": product.features,
  "brand": {
    "@type": "Brand",
    "name": "Logistic Intel"
  }
});