import Head from "next/head";

export default function SEO(props) {
  const {
    title = "REAL ESTATE",
    description,
    keywords,
    canonical,
  } = props || {}; // ✅ Prevents `undefined` props issue

  const defaultDescription =
    "Alveo delivers innovative real estate solutions, offering upscale living and workspaces in dynamic growth hubs nationwide.";

  const defaultKeywords = "ALVEO, REALSTATE, REAL-STATE, INFINITECH";

  // ✅ Fix: Use process.env.NEXT_PUBLIC_LOCAL_PORT correctly
  const defaultCanonical = process.env.NEXT_PUBLIC_LOCAL_PORT
    ? `${process.env.NEXT_PUBLIC_LOCAL_PORT}/`
    : "/";

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="google-site-verification"
        content="JPreTENLUnqfqwlxHLXZLZGfrAP2wu9RieI_8a7nBgM"
      />
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonical || defaultCanonical} />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:url" content={canonical || defaultCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/assets/Alveo.png" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content="/assets/Alveo.png" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: title,
            url: canonical || defaultCanonical,
            description: description || defaultDescription,
            image: "/assets/Alveo.png",
          }),
        }}
      />
    </Head>
  );
}
