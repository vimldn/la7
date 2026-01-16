import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogSlugs, getRelatedBlogPosts } from '@/data/blogPosts';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.metaTitle} | LoanApp.co.ke`,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(slug, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header currentPage="blog-post" />
      <BackToTop />

      {/* Breadcrumb */}
      <div className="bg-slate-800/30 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <svg className="w-4 h-4 mx-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
            <svg className="w-4 h-4 mx-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-300 truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-slate-400 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs">
              {post.category || 'Loan Guide'}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-emerald-400
            prose-p:text-white prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-white
            prose-ul:my-4 prose-ul:text-white
            prose-ol:my-4 prose-ol:text-white
            prose-li:text-white prose-li:mb-1
            prose-table:w-full prose-table:border-collapse prose-table:my-6
            prose-thead:bg-slate-800
            prose-th:p-3 prose-th:text-left prose-th:text-emerald-400 prose-th:font-semibold prose-th:border prose-th:border-slate-700
            prose-td:p-3 prose-td:border prose-td:border-slate-700 prose-td:text-white
            prose-tr:hover:bg-slate-800/50
            prose-img:rounded-xl prose-img:my-8 prose-img:mx-auto
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:text-slate-300 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl border border-emerald-500/20">
          <h3 className="text-xl font-bold text-white mb-2">Ready to compare loan apps?</h3>
          <p className="text-slate-400 mb-4">Use our calculator to see exactly what you'll pay back with each app.</p>
          <Link
            href="/#calculator"
            className="inline-flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Try the Calculator →
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-800/30 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all group"
                >
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all guides
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} LoanApp.co.ke. For informational purposes only. Always verify rates with official sources.</p>
        </div>
      </footer>
    </div>
  );
}
