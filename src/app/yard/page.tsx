'use client';

import React, { useState } from "react";
import Link from "next/link";

const tags = ["aws", "kotlin"];
const cardData = [
  { id: 1, name: "hello", tags: ["aws", "docker", "sssss", "sfafda", "sasdas", "aaaaaaaaa", "dafdsfdsfdsgf", "dfdsfgsgfsg", "gfsgfsg", "xxxxxxxxxxxx", "gdgfdafhuadh", "gsdgadf", "fdafugda", "gdfgfs"] },
  { id: 2, name: "hello", tags: ["aws"] },
  { id: 3, name: "hello", tags: [] },
  { id: 4, name: "hello", tags: [] },
  { id: 5, name: "hello", tags: [] },
  { id: 6, name: "hello", tags: [] },
  { id: 7, name: "hello", tags: [] },
  { id: 8, name: "hello", tags: [] },
  { id: 9, name: "hello", tags: [] },
  { id: 10, name: "hello", tags: [] },
  { id: 11, name: "hello", tags: [] },
  { id: 12, name: "hello", tags: [] },
  { id: 13, name: "hello", tags: [] },
  { id: 14, name: "hello", tags: [] },
  { id: 15, name: "hello", tags: [] },
  { id: 16, name: "hello", tags: [] },
  { id: 17, name: "hello", tags: [] },
];

const CARDS_PER_PAGE = 8;

export default function YardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cardData.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const paginatedCards = cardData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen px-8 py-10">

      <div className="relative h-48 bg-amber-400">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-semibold">Tags:--</span>
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-red-300 px-2 py-1 text-sm text-white">
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute right-1 bottom-1">
          <Link href={"/help-request"}>
            <button 
              className="rounded bg-gray-300 px-3 py-1 text-sm font-medium cursor-pointer hover:bg-gray-600"
            >+ Add</button>
          </Link>
          
        </div>
      </div>


      <div className="mt-4 grid grid-cols-4 gap-4 mb-10">
        {paginatedCards.map((card) => (
          <div key={card.id} className="relative h-48 rounded bg-gray-200 p-2 flex flex-col">
            <div className="flex-3">{card.name}</div>
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
