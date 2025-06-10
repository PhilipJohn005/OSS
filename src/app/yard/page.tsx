'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

const availableTags = ['AWS', 'GCP', 'Azure', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes','n8n'];
const CARDS_PER_PAGE = 8;

interface Card {
  id: string;
  card_name: string;
  tags: string[];
}

export default function YardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await fetch('http://localhost:4000/server/fetch-card');
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

  return (
    <div className="min-h-screen px-8 py-10">
      <div className="relative h-48 bg-amber-400">

        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold">Tags:--</span>
          {availableTags.map((tag) => {
            const countWithTag = cards.filter(card => card.tags.includes(tag)).length;
            const countWithSelected = selectedTags.length > 0 
              ? cards.filter(card => 
                  selectedTags.every(t => card.tags.includes(t)) && 
                  card.tags.includes(tag)
                ).length
              : countWithTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded px-2 py-1 text-sm text-white ${
                  selectedTags.includes(tag) ? 'bg-purple-500' : 'bg-red-300'
                }`}
                title={`${countWithSelected} cards (${countWithTag} total)`}
              >
                {tag} ({countWithSelected})
              </button>
            );
          })}
        </div>
        <div className="absolute right-1 bottom-1">
          <Link href={"/help-request"}>
            <button className="rounded bg-gray-300 px-3 py-1 text-sm font-medium cursor-pointer hover:bg-gray-600">
              + Add
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 mb-10">
        {paginatedCards.map((card) => (
          <div key={card.id} className="relative h-48 rounded bg-gray-200 p-2 flex flex-col">
            <div className="flex-3 font-semibold">{card.card_name}</div>
            <div className="flex-1 overflow-y-auto flex flex-wrap gap-2 items-start">
              {card.tags.map((tag) => (
                <span key={tag} className="rounded bg-red-300 px-2 py-1 text-xs text-white">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-black">
        <button
          className="px-2 py-1"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          ←
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 ${currentPage === i + 1 ? 'underline font-bold' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-1"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          →
        </button>
      </div>
    </div>
  );
}
