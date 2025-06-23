'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CardListener from '@/app/actions/cardlistener';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface Issue {
  title: string;
  link: string;
  image?: string;
  description: string;
  tags:string[];
}

interface CardDetails {
  id: string;
  card_name: string;
  repo_url: string;
  user_name: string;
  product_description: string;
  tags: string[];
  issues: Issue[];
}


const CardDetailsPage = () => {
  const params = useParams();
  const id = params.cardId as string;

  const [card, setCard] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        console.log('Fetching card with ID:', id);
        const res = await fetch(`https://oss-backend-2.onrender.com/server/fetch-card-des/${id}`);
        const json = await res.json();

        if (!json?.data) {
          console.error('No data in fetch response:', json);
          return;
        }

        console.log('Card data fetched:', json.data);
        setCard(json.data);
      } catch (err) {
        console.error('Error fetching card details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  const toggleIssue = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!card) return <div className="text-red-400 p-6">Card not found</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
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


      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{card.card_name}</h1>

        <div className="bg-zinc-800 p-4 rounded-xl shadow-md space-y-2">
          <p>
            <strong>Repo Link:</strong>{' '}
            <a href={card.repo_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {card.repo_url}
            </a>
          </p>
          <p><strong>Posted By:</strong> {card.user_name}</p>
        </div>

        <h1 className="text-3xl font-bold">Description</h1>
        <div className="bg-zinc-800 p-4 rounded-xl shadow-md space-y-2">
          <p>{card.product_description}</p>
        </div>

        {card?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <h2 className="text-xl font-semibold w-full">Tags:</h2>
            {card.tags.map((tag, idx) => (
              <span key={idx} className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mt-4">Issues</h2>
          {card.issues.length === 0 && <p className="text-gray-400">No issues listed.</p>}

          {card.issues.map((issue, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-xl shadow-md">
              <button
                onClick={() => toggleIssue(index)}
                className="text-left text-xl font-semibold w-full hover:underline focus:outline-none"
              >
                {issue.title}
              </button>
              <div>
                {issue?.tags?.map((tag,idx)=>(
                  <span key={`${tag}-${index}`} className='rounded bg-red-300 px-2 py-1 text-xs text-white'>
                    {tag}
                  </span>
                ))}
              </div>

              {openIndex === index && (
                <div className="mt-2 space-y-2">
                  <div className="
                    prose prose-invert 
                  prose-a:text-blue-400 
                  prose-code:text-white 
                    prose-code:px-1 
                    prose-code:rounded 
                  prose-pre:text-white 
                    prose-pre:p-4 
                    prose-pre:rounded 
                    prose-pre:overflow-x-auto 
                    text-sm max-w-none"
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw,rehypeHighlight]}
                      
                      >
                       {issue.description}
                    </ReactMarkdown>

                  </div>


                  <a
                    href={issue.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline text-sm"
                  >
                    {issue.link}
                  </a>
                  {issue.image && (
                    <div className="mt-2">
                      <img src={issue.image} alt={issue.title} className="rounded-md max-h-40 object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
