import Head from "next/head";

const Meta = ({
  title = "Default Title",
  keywords = "default keywords",
  description = "default description",
  url = "",
  image = "",
  site = "Ioka"
}) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={site} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site} />
      {/* <meta name="twitter:creator" content="@SarahMaslinNir" /> */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
