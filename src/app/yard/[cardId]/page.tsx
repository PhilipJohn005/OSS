'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize'
import rehypeRaw from 'rehype-raw';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, Github, User, Calendar, Star, AlertCircle, Copy, Check, ArrowLeft, Tag, GitBranch, Users,GitFork } from 'lucide-react';
import Link from 'next/link';
import CardListener from '@/app/actions/cardlistener'; 
import { useSession } from 'next-auth/react';

interface Issue {
  title: string;
  link: string;
  image?: string;
  description: string;
  tags: string[];
}

interface CardDetails {
  id: string;
  card_name: string;
  repo_url: string;
  user_name: string;
  product_description: string;
  tags: string[];
  issues: Issue[];
  stars?: number;
  forks?:number;
  contributors?: number;
  lastUpdated?: string;
}

const CardDetailsPage = () => {
  const params = useParams();
  const id = params.cardId as string;

  const [card, setCard] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const { data:session, status } = useSession();


  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`https://oss-backend-2.onrender.com/server/fetch-card-des/${id}`);
        const json = await res.json();
        if (json?.data) setCard(json.data);
      } catch (err) {
        console.error('Error fetching card details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  useEffect(()=>{
    fetch('/api/tracker',{
        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({
          path : window.location.pathname,
          email : session?.user?.email || null,
          user : session?.user?.name || null,
          uid : session?.user?.id || null
        })
    }).catch((e)=>console.log("Tracking user error : " + e))
  },[])

  const copyRepoUrl = async () => {
    if (card?.repo_url) {
      await navigator.clipboard.writeText(card.repo_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleIssueExpansion = (index: number) => {
    const updated = new Set(expandedIssues);
    updated.has(index) ? updated.delete(index) : updated.add(index);
    setExpandedIssues(updated);
  };

  const truncateText = (text: string | null | undefined, maxLength = 200) => {
  if (!text) return '';
  const plain = text.replace(/[#*`\[\]()]/g, '').trim();
  return plain.length <= maxLength ? text : plain.slice(0, maxLength) + '...';
};


  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-600">Loading project details...</div>;
  if (!card) return <div className="min-h-screen flex justify-center items-center text-red-500">Card not found</div>;

  return (
    <div className="min-h-screen relative bg-gray-50">

      <CardListener
        cardId={id}
        onNewIssue={(newIssue) => {
          console.log('⚡️ Realtime Issue Added:', newIssue);
          setCard((prev) =>
            prev
              ? {
                  ...structuredClone(prev),
                  issues: [newIssue, ...(prev.issues || [])],
                }
              : prev
          );
        }}
      />

      <header className="fixed top-0 left-0 w-full">
        <div className="items-center mt-4 justify-between backdrop-blur-lg mx-auto max-w-7xl px-6 py-4 flex flex-row gap-4 bg-white/10 border border-white/20 rounded-2xl shadow-lg">          <Link href="/yard">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pt-26">
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{card.card_name}</h1>
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2"><User className="w-4 h-4" />{card.user_name}</div>
                <div className="flex items-center gap-2"><Github className="w-4 h-4" />{card.stars || 0} stars</div>
                <div className="flex items-center gap-2"><GitFork className="w-4 h-4" />{card.forks || 0} Forks</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={copyRepoUrl} variant="outline">
                {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
              <a href={card.repo_url} target="_blank" rel="noopener noreferrer">
                <Button><ExternalLink className="w-4 h-4 mr-2" />View Repo</Button>
              </a>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className='flex'><GitBranch className="w-5 h-5 text-blue-600 mr-2" />Project Description</CardTitle></CardHeader>
              <CardContent><div className="prose max-w-none"><ReactMarkdown>{card.product_description}</ReactMarkdown></div></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className='flex'><AlertCircle className="w-5 h-5 text-orange-600 mr-2" />Open Issues</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {card.issues.length === 0 ? (
                  <p className="text-gray-500">No issues listed.</p>
                ) : 
                card.issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg pr-4">{issue.title}</h3>
                      <a href={issue.link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline"><ExternalLink className="w-4 h-4 mr-1" />View</Button>
                      </a>
                    </div>
                    {issue.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {issue.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                    <div className="mb-4">
                      {expandedIssues.has(index) ? (
                        <div className="prose max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight,rehypeSanitize]}>{issue.description}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{truncateText(issue.description)}</p>
                      )}
                     {issue.description && issue.description.length > 200 && (

                        <Button variant="ghost" size="sm" onClick={() => toggleIssueExpansion(index)} className="mt-2 text-blue-600">
                          {expandedIssues.has(index) ? 'Show Less' : 'Read More'}
                        </Button>
                      )}
                    </div>
                    {issue.image && <img src={issue.image} alt={issue.title} className="rounded max-h-40 object-cover border" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {card.tags.length > 0 && (
              <Card>
                <CardHeader><CardTitle className='flex'><Tag className="w-4 h-4 text-blue-600 mr-2" />Technologies</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {card.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>Project Statistics</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Stars</span><span>{card.stars || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Forks</span><span>{card.forks || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Issues</span><span>{card.issues.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Maintainer</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{card.user_name}</p>
                    <p className="text-sm text-gray-600">Project Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardDetailsPage;
