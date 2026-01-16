'use client';

import { useState, useMemo } from 'react';
import { loanApps, formatCurrency, LoanApp } from '@/data/loanApps';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import AnimatedSection from '@/components/AnimatedSection';
import CountUp from '@/components/CountUp';
import Script from 'next/script';

type SortField = 'interestRateMonthly' | 'maxAmount' | 'maxTermDays' | 'playStoreRating';
type SortOrder = 'asc' | 'desc';
type CategoryFilter = 'all' | 'mobile-money' | 'bank' | 'fintech';

// FAQ Data for SEO
const faqData = [
  {
    question: "What is the cheapest loan app in Kenya?",
    answer: "The Hustler Fund offers the lowest interest rate at 8% per annum (0.67% monthly), making it the cheapest loan app in Kenya. Bank-based apps like Eazzy Loan (Equity) and Timiza (Absa) also offer competitive rates between 1-2% monthly."
  },
  {
    question: "Which loan app gives the highest amount in Kenya?",
    answer: "KCB M-Pesa offers the highest loan limit at KES 3,000,000 (3 million). Other high-limit options include Eazzy Loan (Equity) at KES 3 million and Timiza (Absa) at KES 5 million for qualified customers."
  },
  {
    question: "How fast can I get a mobile loan in Kenya?",
    answer: "Most mobile loan apps in Kenya disburse funds instantly to your M-Pesa. Apps like M-Shwari, Fuliza, Tala, Branch, and OKash process loans within seconds to minutes once approved."
  },
  {
    question: "Do loan apps in Kenya report to CRB?",
    answer: "Yes, most loan apps in Kenya report to Credit Reference Bureaus (CRB). Late payments or defaults can negatively affect your credit score, impacting future loan applications, mortgages, and even employment opportunities."
  },
  {
    question: "What do I need to qualify for a mobile loan in Kenya?",
    answer: "Requirements vary by app, but most require: a valid Kenyan ID, registered M-Pesa account, active phone number for at least 6 months, and some transaction history. Bank apps require an active bank account."
  },
  {
    question: "Is Fuliza cheaper than Tala or Branch?",
    answer: "No, Fuliza can be more expensive for longer periods due to daily fees that compound. For a 30-day loan, Tala (15% monthly) and Branch (14% monthly) are often cheaper than Fuliza's daily charges which can exceed 30% monthly equivalent."
  },
  {
    question: "Can I have multiple loan apps at once in Kenya?",
    answer: "Yes, you can use multiple loan apps simultaneously. However, this is tracked by CRB and having too many active loans may affect your credit score and ability to get larger loans from banks."
  },
  {
    question: "What happens if I don't repay my mobile loan in Kenya?",
    answer: "Consequences include: negative CRB listing affecting future credit access, increased interest and penalties, debt collection calls (some apps contact your phone contacts), and potential legal action for large amounts."
  }
];

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://loanapp.co.ke/#website",
      "url": "https://loanapp.co.ke",
      "name": "LoanApp.co.ke",
      "description": "Compare loan apps in Kenya - find the cheapest interest rates, highest limits, and fastest disbursement",
      "publisher": {
        "@id": "https://loanapp.co.ke/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://loanapp.co.ke/#organization",
      "name": "LoanApp.co.ke",
      "url": "https://loanapp.co.ke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://loanapp.co.ke/logo.png"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://loanapp.co.ke/#webpage",
      "url": "https://loanapp.co.ke",
      "name": "Best Loan Apps in Kenya 2025 - Compare Interest Rates & Limits",
      "description": "Compare 12+ loan apps in Kenya. Find the cheapest interest rates from 0.67% monthly, loan limits up to KES 3M, and instant M-Pesa disbursement.",
      "isPartOf": {
        "@id": "https://loanapp.co.ke/#website"
      },
      "about": {
        "@type": "Thing",
        "name": "Mobile Loans Kenya"
      },
      "mainEntity": {
        "@id": "https://loanapp.co.ke/#faq"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://loanapp.co.ke/#faq",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@type": "FinancialProduct",
      "@id": "https://loanapp.co.ke/#comparison",
      "name": "Kenya Mobile Loan Comparison",
      "description": "Compare mobile loans from M-Shwari, Tala, Branch, Fuliza, Hustler Fund and more",
      "category": "Loan",
      "areaServed": {
        "@type": "Country",
        "name": "Kenya"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://loanapp.co.ke/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://loanapp.co.ke"
        }
      ]
    }
  ]
};

export default function Home() {
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [sortField, setSortField] = useState<SortField>('interestRateMonthly');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredAndSortedApps = useMemo(() => {
    let apps = [...loanApps];
    
    if (categoryFilter !== 'all') {
      apps = apps.filter(app => app.category === categoryFilter);
    }
    
    apps = apps.filter(app => app.minAmount <= loanAmount && app.maxAmount >= loanAmount);
    
    apps.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    
    return apps;
  }, [categoryFilter, loanAmount, sortField, sortOrder]);

  const calculateRepayment = (app: LoanApp, amount: number, days: number) => {
    const months = days / 30;
    const interest = amount * (app.interestRateMonthly / 100) * months;
    return amount + interest;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header currentPage="home" />
        <BackToTop />

        {/* Hero Section */}
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
            <AnimatedSection animation="fade-up" className="max-w-3xl">
              {/* Changed from h2 to h1 - Critical for SEO */}
              <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Loan Apps in Kenya</span> 2025
              </h1>
              <p className="text-lg text-slate-300 mb-8">
                Compare interest rates, loan limits, and repayment terms across 12+ mobile loan apps in Kenya. Find the cheapest loans from M-Shwari, Tala, Branch, Fuliza, Hustler Fund and more. Calculate exactly what you'll pay back before you borrow.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#calculator" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
                  Calculate Loan Cost
                </a>
                <a href="#compare" className="px-6 py-3 border border-slate-600 hover:border-emerald-500 text-white rounded-lg transition-all hover:bg-slate-800">
                  Compare All Apps
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-y border-slate-700/50 bg-slate-800/30" aria-label="Loan comparison statistics">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatedSection delay={0} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  <CountUp end={12} suffix="+" />
                </div>
                <div className="text-sm text-slate-400">Loan Apps Compared</div>
              </AnimatedSection>
              <AnimatedSection delay={100} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  <CountUp end={0.67} decimals={2} suffix="%" />
                </div>
                <div className="text-sm text-slate-400">Lowest Monthly Rate</div>
              </AnimatedSection>
              <AnimatedSection delay={200} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  <CountUp end={3} prefix="KES " suffix="M" />
                </div>
                <div className="text-sm text-slate-400">Highest Loan Limit</div>
              </AnimatedSection>
              <AnimatedSection delay={300} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">Instant</div>
                <div className="text-sm text-slate-400">M-Pesa Disbursement</div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator" className="py-16 md:py-24" aria-labelledby="calculator-heading">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 id="calculator-heading" className="text-3xl font-bold text-white mb-4">Kenya Loan Calculator</h2>
              <p className="text-slate-400">Calculate how much you'll pay back with each mobile loan app</p>
            </AnimatedSection>
            
            <AnimatedSection delay={200} className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8">
              <div className="space-y-8">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label htmlFor="loan-amount" className="text-slate-300 font-medium">Loan Amount</label>
                    <span className="text-emerald-400 font-bold">{formatCurrency(loanAmount)}</span>
                  </div>
                  <input
                    id="loan-amount"
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    aria-label="Select loan amount"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>KES 500</span>
                    <span>KES 100,000</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label htmlFor="loan-term" className="text-slate-300 font-medium">Loan Term</label>
                    <span className="text-emerald-400 font-bold">{loanTerm} days</span>
                  </div>
                  <input
                    id="loan-term"
                    type="range"
                    min="7"
                    max="180"
                    step="7"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    aria-label="Select loan term in days"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>7 days</span>
                    <span>180 days</span>
                  </div>
                </div>
              </div>

              {/* Results Preview */}
              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">What you'll pay back:</h3>
                <div className="space-y-3">
                  {filteredAndSortedApps.slice(0, 3).map((app, index) => {
                    const repayment = calculateRepayment(app, loanAmount, Math.min(loanTerm, app.maxTermDays));
                    const interest = repayment - loanAmount;
                    return (
                      <div 
                        key={app.id} 
                        className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" aria-hidden="true">{app.logo}</span>
                          <div>
                            <div className="font-medium text-white">{app.name}</div>
                            <div className="text-xs text-slate-400">{app.interestRate}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{formatCurrency(repayment)}</div>
                          <div className="text-xs text-red-400">+{formatCurrency(interest)} interest</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <a href="#compare" className="block text-center text-emerald-400 hover:text-emerald-300 text-sm mt-4 transition-colors">
                  See all {filteredAndSortedApps.length} loan options →
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="compare" className="py-16 md:py-24 bg-slate-800/20" aria-labelledby="compare-heading">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 id="compare-heading" className="text-3xl font-bold text-white mb-4">Compare All Loan Apps in Kenya</h2>
              <p className="text-slate-400">Click any row to see full details, requirements, and download links</p>
            </AnimatedSection>

            {/* Filters */}
            <AnimatedSection delay={100} className="flex flex-wrap gap-2 md:gap-4 mb-8">
              <nav className="flex items-center gap-1 md:gap-2 bg-slate-800/50 rounded-lg p-1 overflow-x-auto" aria-label="Filter by loan type">
                {(['all', 'mobile-money', 'bank', 'fintech'] as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-emerald-500 text-slate-900'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                    aria-pressed={categoryFilter === cat}
                  >
                    {cat === 'all' ? 'All Loans' : cat === 'mobile-money' ? 'M-Pesa Loans' : cat === 'bank' ? 'Bank Loans' : 'Fintech Apps'}
                  </button>
                ))}
              </nav>
            </AnimatedSection>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredAndSortedApps.map((app, index) => {
                const repayment = calculateRepayment(app, loanAmount, Math.min(loanTerm, app.maxTermDays));
                const isExpanded = expandedApp === app.id;
                
                return (
                  <AnimatedSection key={app.id} delay={index * 50} animation="fade-up">
                    <article 
                      className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-emerald-500/50' : ''}`}
                    >
                      <div 
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        className="p-4 cursor-pointer"
                        role="button"
                        aria-expanded={isExpanded}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setExpandedApp(isExpanded ? null : app.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl" aria-hidden="true">{app.logo}</span>
                            <div>
                              <h3 className="font-semibold text-white">{app.name}</h3>
                              <div className="text-xs text-slate-500 capitalize">{app.category.replace('-', ' ')} loan</div>
                            </div>
                          </div>
                          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs">Interest Rate</div>
                            <div className={`font-medium ${app.interestRateMonthly < 5 ? 'text-emerald-400' : app.interestRateMonthly < 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {app.interestRate}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">You'll Pay</div>
                            <div className="font-bold text-white">{formatCurrency(repayment)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Max Limit</div>
                            <div className="text-slate-300">{formatCurrency(app.maxAmount)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Speed</div>
                            <div className={`${app.processingTime === 'Instant' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {app.processingTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-700 p-4 bg-slate-800/30 animate-fadeIn">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-emerald-400 font-semibold mb-2 text-sm">Requirements</h4>
                              <ul className="space-y-1">
                                {app.requirements.map((req, i) => (
                                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-slate-500" aria-hidden="true">•</span> {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-emerald-400 font-semibold mb-2 text-sm">Pros</h4>
                                <ul className="space-y-1">
                                  {app.pros.map((pro, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                      <span className="text-emerald-500" aria-hidden="true">✓</span> {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-red-400 font-semibold mb-2 text-sm">Cons</h4>
                                <ul className="space-y-1">
                                  {app.cons.map((con, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                      <span className="text-red-500" aria-hidden="true">✗</span> {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400">{app.description}</p>
                            <a
                              href={app.downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium rounded-lg text-sm transition-colors text-center"
                            >
                              Download {app.name} →
                            </a>
                            {app.crbReporting && (
                              <div className="flex items-center gap-2 text-xs text-amber-400">
                                <span aria-hidden="true">⚠️</span>
                                <span>Reports to CRB - late payment may affect your credit score</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <AnimatedSection delay={200} className="hidden md:block overflow-x-auto">
              <table className="w-full" role="grid">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th scope="col" className="text-left py-4 px-4 text-slate-400 font-medium">Loan App</th>
                    <th 
                      scope="col"
                      className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('interestRateMonthly')}
                      aria-sort={sortField === 'interestRateMonthly' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Interest Rate {sortField === 'interestRateMonthly' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      scope="col"
                      className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('maxAmount')}
                      aria-sort={sortField === 'maxAmount' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Max Limit {sortField === 'maxAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      scope="col"
                      className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('maxTermDays')}
                      aria-sort={sortField === 'maxTermDays' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Term {sortField === 'maxTermDays' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th scope="col" className="text-left py-4 px-4 text-slate-400 font-medium">Speed</th>
                    <th 
                      scope="col"
                      className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('playStoreRating')}
                      aria-sort={sortField === 'playStoreRating' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Rating {sortField === 'playStoreRating' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th scope="col" className="text-right py-4 px-4 text-slate-400 font-medium">
                      You'll Pay ({formatCurrency(loanAmount)})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedApps.map((app) => {
                    const repayment = calculateRepayment(app, loanAmount, Math.min(loanTerm, app.maxTermDays));
                    const isExpanded = expandedApp === app.id;
                    
                    return (
                      <>
                        <tr 
                          key={app.id}
                          onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                          className="border-b border-slate-700/50 hover:bg-slate-700/20 cursor-pointer transition-colors"
                          role="row"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setExpandedApp(isExpanded ? null : app.id)}
                          aria-expanded={isExpanded}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl" aria-hidden="true">{app.logo}</span>
                              <div>
                                <div className="font-medium text-white">{app.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{app.category.replace('-', ' ')} loan</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-medium ${app.interestRateMonthly < 5 ? 'text-emerald-400' : app.interestRateMonthly < 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {app.interestRate}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-300">{formatCurrency(app.maxAmount)}</td>
                          <td className="py-4 px-4 text-slate-300">{app.loanTerm}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm ${app.processingTime === 'Instant' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {app.processingTime}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400" aria-hidden="true">★</span>
                              <span className="text-slate-300">{app.playStoreRating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-white">{formatCurrency(repayment)}</span>
                          </td>
                        </tr>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <tr key={`${app.id}-expanded`} className="bg-slate-800/50">
                            <td colSpan={7} className="py-6 px-4 animate-fadeIn">
                              <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-emerald-400 font-semibold mb-2">Requirements</h4>
                                  <ul className="space-y-1">
                                    {app.requirements.map((req, i) => (
                                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                        <span className="text-slate-500" aria-hidden="true">•</span> {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-emerald-400 font-semibold mb-2">Pros</h4>
                                  <ul className="space-y-1">
                                    {app.pros.map((pro, i) => (
                                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                        <span className="text-emerald-500" aria-hidden="true">✓</span> {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-red-400 font-semibold mb-2">Cons</h4>
                                  <ul className="space-y-1">
                                    {app.cons.map((con, i) => (
                                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                        <span className="text-red-500" aria-hidden="true">✗</span> {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
                                <p className="text-sm text-slate-400 max-w-2xl">{app.description}</p>
                                <a
                                  href={app.downloadLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium rounded-lg text-sm transition-colors whitespace-nowrap ml-4"
                                >
                                  Download {app.name} →
                                </a>
                              </div>
                              {app.crbReporting && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-amber-400">
                                  <span aria-hidden="true">⚠️</span>
                                  <span>Reports to CRB - late payment may affect your credit score</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </AnimatedSection>

            {filteredAndSortedApps.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No loan apps found for {formatCurrency(loanAmount)}. Try adjusting the amount.
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section - NEW for SEO */}
        <section id="faq" className="py-16 md:py-24" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 id="faq-heading" className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400">Common questions about mobile loans in Kenya</p>
            </AnimatedSection>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <AnimatedSection key={index} delay={index * 50} animation="fade-up">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                      aria-expanded={expandedFaq === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3 className="font-semibold text-white text-lg pr-4">{faq.question}</h3>
                      <div className={`transform transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`} aria-hidden="true">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedFaq === index && (
                      <div 
                        id={`faq-answer-${index}`}
                        className="px-6 pb-6 animate-fadeIn"
                      >
                        <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section id="tips" className="py-16 md:py-24 bg-slate-800/20" aria-labelledby="tips-heading">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 id="tips-heading" className="text-3xl font-bold text-white mb-4">Mobile Loan Tips for Kenyans</h2>
              <p className="text-slate-400">Make smarter borrowing decisions and avoid debt traps</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '📊', title: 'Compare Before You Borrow', text: 'Interest rates vary wildly - from 0.67% to 30% monthly. A KES 10,000 loan can cost you KES 300 or KES 3,000 in interest depending on where you borrow.' },
                { icon: '⚡', title: 'Start with Hustler Fund', text: 'At 8% per year (0.67% monthly), Hustler Fund is by far the cheapest option. Start there and build your limit before using other apps.' },
                { icon: '🏦', title: 'Bank Apps Beat Fintech', text: 'If you have a bank account, Eazzy Loan (Equity) and Timiza (Absa) offer much lower rates than apps like Tala or Branch. Check your bank first.' },
                { icon: '⚠️', title: 'Avoid Fuliza for Long Periods', text: 'Fuliza charges daily fees that compound fast. A KES 5,000 Fuliza for 30 days costs ~KES 1,500 in fees. Pay it off quickly or avoid it.' },
                { icon: '📱', title: 'Watch the App Permissions', text: 'Apps like Tala, Branch, and OKash read your SMS, contacts, and location. They may call your contacts if you default. Be aware of this.' },
                { icon: '📋', title: 'CRB Affects Everything', text: 'Most apps report to Credit Reference Bureaus. One late payment can affect your ability to get bank loans, mortgages, and even jobs. Always pay on time.' },
              ].map((tip, index) => (
                <AnimatedSection key={tip.title} delay={index * 100} animation="fade-up">
                  <article className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-full hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block" aria-hidden="true">{tip.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                    <p className="text-slate-400 text-sm">{tip.text}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-lg" aria-hidden="true">
                    💰
                  </div>
                  <span className="text-lg font-bold text-white">LoanApp.co.ke</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Kenya's most comprehensive mobile loan comparison tool. Compare interest rates, loan limits, and repayment terms to make informed borrowing decisions.
                </p>
              </div>
              
              <nav aria-label="Loan types">
                <h4 className="font-semibold text-white mb-4">Loans by Type</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="/mpesa-loans" className="hover:text-emerald-400 transition-colors">M-Pesa Loans Kenya</a></li>
                  <li><a href="/bank-loans" className="hover:text-emerald-400 transition-colors">Bank Mobile Loans</a></li>
                  <li><a href="/fintech-loans" className="hover:text-emerald-400 transition-colors">Fintech Loan Apps</a></li>
                  <li><a href="/instant-loans" className="hover:text-emerald-400 transition-colors">Instant Loans Kenya</a></li>
                </ul>
              </nav>

              <nav aria-label="Popular loan apps">
                <h4 className="font-semibold text-white mb-4">Popular Loan Apps</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="/loans/hustler-fund" className="hover:text-emerald-400 transition-colors">Hustler Fund</a></li>
                  <li><a href="/loans/m-shwari" className="hover:text-emerald-400 transition-colors">M-Shwari</a></li>
                  <li><a href="/loans/fuliza" className="hover:text-emerald-400 transition-colors">Fuliza</a></li>
                  <li><a href="/loans/tala" className="hover:text-emerald-400 transition-colors">Tala Kenya</a></li>
                  <li><a href="/loans/branch" className="hover:text-emerald-400 transition-colors">Branch Kenya</a></li>
                </ul>
              </nav>

              <nav aria-label="Resources">
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Loan Calculator</a></li>
                  <li><a href="#compare" className="hover:text-emerald-400 transition-colors">Compare All Loans</a></li>
                  <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQs</a></li>
                  <li><a href="#tips" className="hover:text-emerald-400 transition-colors">Borrowing Tips</a></li>
                  <li><a href="/blog" className="hover:text-emerald-400 transition-colors">Guides & Blog</a></li>
                </ul>
              </nav>
            </div>

            <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-500">
              <p>© {new Date().getFullYear()} LoanApp.co.ke - Compare Mobile Loans in Kenya | HA7 1JS | For informational purposes only. Always verify current rates with official loan providers.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
