'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, AlertCircle, Filter, Search, Github, Star, Code, GitFork, Loader2Icon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import getEmbedding from "../../../lib/getEmbedding";
import { supabase } from "../../../lib/supabase";
import { useSession } from "next-auth/react";

const availableTags = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Scala', 'Perl', 'Haskell', 'Elixir', 'Dart',

  // Frontend Frameworks
  'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Qwik', 'SolidJS', 'Preact', 'Lit', 'Alpine.js',

  // Backend Frameworks
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Phoenix', 'Hapi', 'Koa.js', 'Actix',

  // Mobile & Cross-Platform
  'React Native', 'Flutter', 'SwiftUI',  'Xamarin', 'Ionic', 'NativeScript',

  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'MariaDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'Supabase', 'PlanetScale', 'Firebase Realtime DB', 'Firestore',

  // DevOps & CI/CD
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI', 'Travis CI', 'ArgoCD', 'Spinnaker',

  // Cloud Platforms
  'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Linode', 'Vultr', 'Render', 'Railway', 'Heroku', 'Netlify', 'Vercel', 'Cloudflare',

  // AI/ML & Data
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV', 'Jupyter', 'LangChain', 'Transformers', 'Hugging Face', 'OpenAI', 'spaCy',

  // APIs
  'GraphQL', 'REST API', 'gRPC', 'tRPC', 'WebSockets', 'OpenAPI', 'Postman', 'Swagger',

  // CMS & E-commerce
  'WordPress', 'Strapi', 'Sanity', 'Ghost', 'Contentful', 'Shopify', 'Magento', 'WooCommerce', 'Medusa.js',

  // Static Site Generators
  'Gatsby', 'Hugo', 'Jekyll', '11ty', 'Astro',

  // Testing
  'Jest', 'Mocha', 'Chai', 'Vitest', 'Cypress', 'Playwright', 'Selenium', 'Testing Library',

  // Authentication & Identity
  'OAuth', 'JWT', 'Auth0', 'Clerk', 'Firebase Auth', 'NextAuth.js', 'Supabase Auth',

  // Package Managers & Build Tools
  'npm', 'yarn', 'pnpm', 'Webpack', 'Vite', 'Rollup', 'Parcel', 'Turbopack', 'Bun', 'esbuild',

  // Styling
  'Tailwind CSS', 'Sass', 'Less', 'Styled Components', 'Emotion', 'Chakra UI', 'Material UI', 'Bootstrap', 'ShadCN UI',

  // OS & Platforms
  'Linux', 'Windows', 'macOS', 'Ubuntu', 'Debian', 'Arch', 'Fedora', 'iOS', 'Android',

  // Version Control & Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Mercurial', 'SVN',

  // Monitoring & Analytics
  'Prometheus', 'Grafana', 'Datadog', 'Sentry', 'LogRocket', 'Amplitude', 'Mixpanel',

  // Messaging & Event Systems
  'Kafka', 'RabbitMQ', 'NATS', 'Redis Streams', 'Pub/Sub', 'Socket.IO',

  // Misc Tools & Platforms
  'Electron', 'n8n', 'Zod', 'Prisma', 'Drizzle ORM', 'Sequelize', 'TypeORM', 'RxJS', 'OpenTelemetry', 'WebRTC', 'Three.js', 'Babylon.js'
];


const CARDS_PER_PAGE = 6;

interface Card {
  id: number;
  card_name: string;
  link: string;
  tags: string[];
  product_description?: string;
  top_language?: string;
  stars?: number;
  forks?: number;
  open_issues_count?: number;
}

// ✅ Utility function to remove duplicates by card ID
function deduplicateCards(cards: Card[]): Card[] {
  const seen = new Map<number, Card>();
  for (const card of cards) {
    if (!seen.has(card.id)) {
      seen.set(card.id, card);
    }
  }
  return Array.from(seen.values());
}

export default function YardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | number | readonly string[] | undefined>('');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const {data:session,status}=useSession();
  const [isLoading,setIsLoading]=useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return;
    const queryEmbedding = await getEmbedding(searchQuery.trim());
    if (!queryEmbedding) return;
    console.log(Array.from(queryEmbedding))
    setIsSearching(true);
    const { data, error } = await supabase.rpc('match_cards', {
      query_embedding: Array.from(queryEmbedding),
      match_threshold: 0.5,
      match_count: 10,
    });
    setIsSearching(false);

    if (error) {
      console.error("Supabase RPC error:", error.message, error.details);
      return;
    }

    const mappedCards = (data || []).map((row:any) => ({
      id: row.card_id,
      card_name: row.card_name,
      product_description: row.description,
      tags: row.tags,
      link: row.repo_url,
      top_language: row.top_language,
      stars: row.stars,
      forks: row.forks,
      open_issues_count: row.open_issues_count,
    }));

    setCards(deduplicateCards(mappedCards));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://oss-backend-2.onrender.com/server/fetch-card');
        setIsLoading(false);
        if (!response.ok) throw new Error("Failed to fetch cards");
        const { data } = await response.json();
        setCards(deduplicateCards(data || []));
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };
    fetchCardDetails();
  }, []);

  const filteredCards = cards.filter(card =>
    selectedTags.length === 0 ||
    selectedTags.every(tag => card.tags.includes(tag))
  );

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const paginatedCards = filteredCards.slice(startIndex, endIndex);
  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 10);


  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="items-center justify-between mx-auto max-w-6xl px-6 py-4 flex">
          <div className="items-center flex gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">DevLinkr</h1>
          </div>
          <div className="flex items-center justify-center gap-1 ">
            {status === "authenticated" ? (
                <Link href="/help-request">
                  <Button>+ Add Project</Button>
                </Link>
              ) : (
                <Button
                  disabled
                  className="flex  items-center justify-center text-center text-sm gap-1"
                >
                  + Add Project
                  <span className="text-xs text-red-500">Login required</span>
                </Button>
              )}

            {status === "authenticated" ? (
                <Link href={`/Dashboardpage/${session?.user?.username}`}>
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <Button
                  disabled
                  className="flex items-center justify-center text-center text-sm gap-1"
                >
                  Dashboard
                  <span className="text-xs text-red-500">Login required</span>
                </Button>

              )}

          </div>
          
               
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Source Projects</h1>
          <p className="text-gray-600">Discover and contribute to amazing open source projects</p>
        </div>

        <div className="mb-6 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Type your project goal or interest (e.g. 'I want a Firebase Android repo')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className={isSearching ? "pointer-events-none opacity-50" : "shrink-0 cursor-pointer"}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by technology:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {displayedTags.map((tag) => {
              const countWithTag = cards.filter(card => card.tags.includes(tag)).length;
              const countWithSelected = selectedTags.length > 0
                ? cards.filter(card =>
                    selectedTags.every(t => card.tags.includes(t)) &&
                    card.tags.includes(tag)
                  ).length
                : countWithTag;
              return (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs h-8"
                >
                  {tag} ({countWithSelected})
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showAllTags ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show All Tags ({availableTags.length - 10} more)
              </>
            )}
          </Button>

          {selectedTags.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                  onClick={() => toggleTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

          {
            isLoading ? (  
              <div className="flex items-center justify-center">
                  <Loader2Icon className="animate-spin"/>             
              </div>          
            ):paginatedCards.length === 0 ? (
                <div>No Repos of your requested issue found!</div>
              ):(
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {paginatedCards.length} of {filteredCards.length} project{filteredCards.length !== 1 ? 's' : ''}
                    {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </p>
                </div>
              )  
          }
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
          {paginatedCards.map((card) => (
            <Link key={card.id} href={`/yard/${card.id}`}>
              <Card className="h-full w-full p-4 bg-gray-800 hover:shadow-xl hover:border-blue-400 transition-all duration-200 cursor-pointer border border-gray-700 rounded-2xl hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" />
                    <CardTitle className="text-lg text-gray-300 line-clamp-2">{card.card_name}</CardTitle>
                  </div>
                  {card.product_description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{card.product_description}</p>
                  )}
                </CardHeader>

                <CardContent className="pt-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">{card.top_language || "null"}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {card.stars || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {card.forks || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {card.open_issues_count || 0}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {card.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs rounded-full px-2 py-0.5 capitalize tracking-wide">
                        {tag}
                      </Badge>
                    ))}
                    {card.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                        +{card.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
