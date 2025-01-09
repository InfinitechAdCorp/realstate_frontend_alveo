import Head from 'next/head';

export default function SEO({ title, description, keywords, canonical }) {
  return (
    <Head>
      <title>{title || 'REAL ESTATE'}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="google-site-verification" content="JPreTENLUnqfqwlxHLXZLZGfrAP2wu9RieI_8a7nBgM" />
      <meta name="description" content={description || "Alveo delivers innovative real estate solutions, offering upscale living and workspaces in dynamic growth hubs nationwide."} />
      <meta name="keywords" content={keywords || "ALVEO, REALSTATE, REAL-STATE, INFINITECH"} />
      <link rel="canonical" href={canonical || 'http://localhost:3000/'} />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || 'REAL ESTATE'} />
      <meta property="og:description" content={description || "Alveo delivers innovative real estate solutions, offering upscale living and workspaces in dynamic growth hubs nationwide."} />
      <meta property="og:url" content={canonical || 'http://localhost:3000/'} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/assets/Alveo.png" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="Alveo delivers innovative real estate solutions" />
      <meta name="twitter:title" content={title || 'REAL ESTATE'} />
      <meta name="twitter:description" content={description || "Alveo delivers innovative real estate solutions, offering upscale living and workspaces in dynamic growth hubs nationwide."} />
      <meta name="twitter:image" content="/assets/Alveo.png" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": title || "REAL ESTATE",
          "url": canonical || "http://localhost:3000/",
          "description": description || "Alveo delivers innovative real estate solutions, offering upscale living and workspaces in dynamic growth hubs nationwide.",
          "image": "/assets/Alveo.png",
        })}
      </script>
    </Head>
  );
}
