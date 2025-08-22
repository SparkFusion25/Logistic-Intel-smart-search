import { useParams } from 'react-router-dom';
import { SeoHelmet } from "@/components/seo/SeoHelmet";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <>
      <SeoHelmet
        title={`Blog Article - ${slug} - Logistic Intel`}
        description="Read the latest insights from Logistic Intel's logistics intelligence team."
        canonical={`https://logisticintel.com/blog/${slug}`}
      />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h1 className="text-4xl font-bold text-[#0B1E39] mb-6">
              Blog Article: {slug}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              This article is coming soon. Check back later for the latest insights from our logistics intelligence team.
            </p>
            <div className="text-center">
              <a 
                href="/blog" 
                className="inline-flex items-center rounded-xl px-6 py-3 font-semibold border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition"
              >
                ← Back to Blog
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}