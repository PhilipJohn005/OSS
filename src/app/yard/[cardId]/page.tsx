'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Issue {
  title: string;
  link: string;
  image?: string;
  description: string; 
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

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`https://oss-backend-2.onrender.com/server/fetch-card-des/${id}`);
        const { data } = await res.json();
        setCard(data);
      } catch (err) {
        console.error('Error fetching card details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!card) return <div className="text-red-400 p-6">Card not found</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
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
        <div className='bg-zinc-800 p-4 rounded-xl shadow-md space-y-2'>
          <p>{card.product_description}</p>
        </div>
        {card.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <h2 className="text-xl font-semibold w-full">Tags:</h2>
            {card.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mt-4">Issues</h2>
          {card.issues.length === 0 && (
            <p className="text-gray-400">No issues listed.</p>
          )}
          {card.issues.map((issue, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">{issue.title}</h3>
              <p
                className="text-gray-300 text-sm mb-2 whitespace-pre-line"
              >
                {issue.description}
              </p>
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
          ))}

        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
