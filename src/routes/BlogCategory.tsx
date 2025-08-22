import { useParams } from "react-router-dom";
import SeoHelmet from "@/components/seo/SeoHelmet";

export default function BlogCategory() {
  const { slug } = useParams();

  return (
    <>
      <SeoHelmet
        title={`${slug} - Blog Category - Logistic Intel`}
        description={`Articles in the ${slug} category`}
        canonical={`https://logisticintel.com/blog/category/${slug}`}
      />
      
      <main className="bg-[#F7F8FA]">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-[#0B1E39] mb-4">
              Category: {slug}
            </h1>
            <p className="text-xl text-slate-700">
              Articles in this category will appear here
            </p>
          </div>
        </section>
      </main>
    </>
  );
}