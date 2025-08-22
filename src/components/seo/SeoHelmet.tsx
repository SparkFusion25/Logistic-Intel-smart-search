import { Helmet } from "react-helmet-async";

export default function SeoHelmet({title, description, canonical}:{title:string; description?:string; canonical?:string;}){
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}