'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronUp,ChevronDown,Users,AlertCircle,Filter,Search,Github,Star, Code } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const availableTags = [
  'AWS', 'GCP', 'Azure', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes', 'n8n',
  'TypeScript', 'JavaScript', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Redis', 'GraphQL', 'REST API', 'Next.js', 'Express.js', 'Django', 'Flask',
  'Spring Boot', 'Laravel', 'Ruby on Rails', 'Go', 'Rust', 'Java', 'C#',
  'PHP', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Electron', 'Firebase',
  'Supabase', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean', 'Jenkins', 'GitHub Actions',
  'CircleCI', 'Terraform', 'Ansible', 'Linux', 'Windows', 'macOS', 'iOS', 'Android'
];

const CARDS_PER_PAGE = 8;

interface Card {
  id: string;
  card_name: string;
  tags: string[];
  description?: string;
  stars?: number;
  contributors?: number;
  open_issues_count?: number;
}

export default function YardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [searchQuery,setSearchQuery]=useState<string | number | readonly string[] | undefined>('');
  const [showAllTags,setShowAllTags]=useState(false);
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await fetch('https://oss-backend-2.onrender.com/server/fetch-card');
        if (!response.ok) throw new Error("Failed to fetch cards");
        const { data } = await response.json();
        setCards(data || []);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchCardDetails();
  }, []);

  // 🧠 Sort by how many selectedTags match the card's tags
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
            <Button>
              + Add Project
            </Button>           
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Source Projects</h1>
          <p className="text-gray-600">Discover and contribute to amazing open source projects</p>
        </div>

         <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
      <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {paginatedCards.length} of {filteredCards.length} project{filteredCards.length !== 1 ? 's' : ''}
            {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedCards.map((card) => (
            <Link key={card.id} href={`/yard/${card.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg line-clamp-2 mb-2">{card.card_name}</CardTitle>
                  {card.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {card.stars || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {card.contributors || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {card.open_issues_count || 0}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {card.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.tags.length - 3}
                        </Badge>
                      )}
                    </div>
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
