import Link from 'next/link';
import { getAllBlogPosts } from '@/data/blogPosts';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';

export const metadata: Metadata = {
  title: 'Loan App Guides & Tips | LoanApp.co.ke Blog',
  description: 'Expert guides on Kenyan loan apps: M-Shwari, Tala, Branch, Hustler Fund, Fuliza. Learn about interest rates, CRB, approval tips, and how to get the cheapest loans.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  // Group posts by category type
  const comparisonPosts = posts.filter(p => p.title.toLowerCase().includes('which'));
  const howMuchPosts = posts.filter(p => p.title.toLowerCase().includes('how much'));
  const howToPosts = posts.filter(p => p.title.toLowerCase().includes('how do'));
  const whatPosts = posts.filter(p => p.title.toLowerCase().includes('what'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header currentPage="blog" />
      <BackToTop />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loan App <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Guides</span>
            </h2>
            <p className="text-lg text-slate-300">
              Expert answers to your questions about M-Shwari, Tala, Branch, Hustler Fund, and every other loan app in Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚖️</span> Comparisons
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* How Much Posts */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">💵</span> Costs & Fees
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howMuchPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* How To Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span> How-To Guides
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howToPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* What Posts */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">❓</span> FAQs & Warnings
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} LoanApp.co.ke. For informational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:bg-slate-800/70 group"
    >
      {post.featuredImage && (
        <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-slate-700">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <h4 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
        {post.title}
      </h4>
      <p className="text-sm text-slate-400 line-clamp-2">
        {post.excerpt}
      </p>
      <span className="inline-flex items-center text-emerald-400 text-sm mt-4 group-hover:gap-2 transition-all">
        Read more
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
