const fs = require('fs');
const path = require('path');

// External links for loan apps
const externalLinks = {
  'Tala': 'https://play.google.com/store/apps/details?id=com.inventureaccess.tala',
  'Branch': 'https://play.google.com/store/apps/details?id=com.branch_international.branch.branch_demo_android',
  'M-Shwari': 'https://www.safaricom.co.ke/personal/m-pesa/do-more-with-m-pesa/m-shwari',
  'Fuliza': 'https://www.safaricom.co.ke/personal/m-pesa/do-more-with-m-pesa/fuliza',
  'KCB M-Pesa': 'https://ke.kcbgroup.com/personal-banking/loans/kcb-m-pesa',
  'Hustler Fund': 'https://hustlerfund.go.ke',
  'Zenka': 'https://play.google.com/store/apps/details?id=com.finserve.zenka',
  'OKash': 'https://play.google.com/store/apps/details?id=com.opera.android.okash.kenya',
  'Okash': 'https://play.google.com/store/apps/details?id=com.opera.android.okash.kenya',
  'Timiza': 'https://play.google.com/store/apps/details?id=com.absa.timiza',
  'Equity Eazzy Loan': 'https://play.google.com/store/apps/details?id=ke.co.equitybank',
  'Eazzy Loan': 'https://play.google.com/store/apps/details?id=ke.co.equitybank',
  'iPesa': 'https://play.google.com/store/apps/details?id=com.iotsence.ipesa',
  'Kashway': 'https://play.google.com/store/apps/details?id=com.kashway.ke',
  'Central Bank of Kenya': 'https://www.centralbank.go.ke',
  'CBK': 'https://www.centralbank.go.ke',
  'CRB': 'https://www.transunion.co.ke',
  'Google Play': 'https://play.google.com/store/apps',
  'M-Pesa': 'https://www.safaricom.co.ke/personal/m-pesa'
};

// Keywords for internal linking - map keywords to related topics
const internalLinkKeywords = {
  'hustler fund': ['hustler-fund', 'hustler'],
  'm-shwari': ['m-shwari', 'mshwari'],
  'tala': ['tala'],
  'branch': ['branch'],
  'fuliza': ['fuliza'],
  'kcb m-pesa': ['kcb-m-pesa', 'kcb'],
  'zenka': ['zenka'],
  'okash': ['okash'],
  'crb': ['crb', 'blacklist'],
  'interest rate': ['interest', 'rate', 'cheap'],
  'loan limit': ['limit', 'amount', 'maximum', 'highest'],
  'first time': ['first-time', 'beginner', 'new'],
  'student': ['student'],
  'approval': ['approved', 'approval', 'easiest'],
};

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const results = [];
  
  let currentLine = '';
  for (let i = 1; i < lines.length; i++) {
    currentLine += lines[i];
    
    if (currentLine.match(/","(draft|publish)"\s*$/i)) {
      const values = parseCSVLine(currentLine);
      if (values.length === headers.length) {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.replace(/"/g, '').trim()] = values[index];
        });
        results.push(obj);
      }
      currentLine = '';
    } else {
      currentLine += '\n';
    }
  }
  
  return results;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function extractExcerpt(html, maxLength = 160) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

function extractFirstImage(html) {
  const match = html.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}

function addExternalLinks(content) {
  let updatedContent = content;
  
  // Sort by length descending to match longer phrases first
  const sortedKeys = Object.keys(externalLinks).sort((a, b) => b.length - a.length);
  
  for (const appName of sortedKeys) {
    const url = externalLinks[appName];
    // Match the app name not already in a link, case insensitive
    // Only link first occurrence in each section
    const regex = new RegExp(`(?<!<a[^>]*>)(?<!href=")\\b(${appName})\\b(?![^<]*</a>)`, 'i');
    
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">$1</a>`);
    }
  }
  
  return updatedContent;
}

function findRelatedPosts(currentSlug, currentTitle, allPosts) {
  const related = [];
  const currentTitleLower = currentTitle.toLowerCase();
  
  for (const post of allPosts) {
    if (post.slug === currentSlug) continue;
    
    let relevance = 0;
    const postTitleLower = post.title.toLowerCase();
    
    // Check for shared keywords
    const keywords = ['hustler fund', 'm-shwari', 'tala', 'branch', 'fuliza', 'kcb', 'crb', 'interest', 'loan', 'limit', 'student', 'approval'];
    
    for (const keyword of keywords) {
      if (currentTitleLower.includes(keyword) && postTitleLower.includes(keyword)) {
        relevance += 2;
      }
    }
    
    // Check for question type similarity
    const questionTypes = ['which is', 'how much', 'how do', 'what is', 'what happens'];
    for (const qType of questionTypes) {
      if (currentTitleLower.startsWith(qType) && postTitleLower.startsWith(qType)) {
        relevance += 1;
      }
    }
    
    if (relevance > 0) {
      related.push({ ...post, relevance });
    }
  }
  
  // Sort by relevance and return top 5
  return related.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

function addInternalLinks(content, currentSlug, allPosts) {
  let updatedContent = content;
  
  // Find related posts
  const currentPost = allPosts.find(p => p.slug === currentSlug);
  if (!currentPost) return updatedContent;
  
  const relatedPosts = findRelatedPosts(currentSlug, currentPost.title, allPosts);
  
  // Add links to related posts within content
  for (const related of relatedPosts.slice(0, 3)) {
    // Find a good anchor text - look for the topic in the content
    const topicWords = related.title.split(' ').filter(w => w.length > 4).slice(0, 3);
    
    for (const word of topicWords) {
      const regex = new RegExp(`(?<!<a[^>]*>)\\b(${word})\\b(?![^<]*</a>)`, 'i');
      if (regex.test(updatedContent) && !updatedContent.includes(`/blog/${related.slug}`)) {
        // Only add one link per related post
        updatedContent = updatedContent.replace(regex, `<a href="/blog/${related.slug}" class="text-emerald-400 hover:text-emerald-300">$1</a>`);
        break;
      }
    }
  }
  
  return updatedContent;
}

// Main execution
const csvPath = process.argv[2] || '/mnt/user-data/uploads/loan_app__f23a4_c_90_articles.csv';
const outputPath = process.argv[3] || './data/blogPosts.ts';

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const articles = parseCSV(csvContent);

// First pass - create basic posts
let posts = articles.map((article, index) => {
  const title = article['Article Title'] || '';
  const content = article['Article Content'] || '';
  const metaTitle = article['Meta Title'] || title;
  const metaDescription = article['Meta Description'] || extractExcerpt(content);
  
  return {
    id: index + 1,
    slug: slugify(title),
    title: title,
    content: content,
    excerpt: extractExcerpt(content),
    metaTitle: metaTitle,
    metaDescription: metaDescription,
    category: article['wp_category'] || 'Loan Guides',
    featuredImage: extractFirstImage(content),
    status: article['Status'] || 'draft',
    publishedAt: new Date().toISOString().split('T')[0],
  };
});

// Second pass - add internal and external links
posts = posts.map(post => {
  let content = post.content;
  
  // Add external links first
  content = addExternalLinks(content);
  
  // Add internal links
  content = addInternalLinks(content, post.slug, posts);
  
  return { ...post, content };
});

// Generate TypeScript file
const tsContent = `export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}

export function getRelatedBlogPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  const currentTitleLower = currentPost.title.toLowerCase();
  
  const scored = blogPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let relevance = 0;
      const postTitleLower = post.title.toLowerCase();
      
      const keywords = ['hustler fund', 'm-shwari', 'tala', 'branch', 'fuliza', 'kcb', 'crb', 'interest', 'loan', 'limit', 'student', 'approval'];
      
      for (const keyword of keywords) {
        if (currentTitleLower.includes(keyword) && postTitleLower.includes(keyword)) {
          relevance += 2;
        }
      }
      
      return { post, relevance };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
  
  return scored.map(item => item.post);
}
`;

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, tsContent);
console.log(`Generated ${posts.length} posts to ${outputPath}`);

// Output summary
console.log('\nAll posts:');
posts.forEach(p => {
  console.log(`  - ${p.slug}`);
});
