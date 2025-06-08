// app/yard/page.tsx

import React from "react";

const tags = ["aws", "kotlin"];
const cardData = [
  { id: 1,name:"hello" ,tags: ["aws", "docker","sssss","sfafda","sasdas","aaaaaaaaa","dafdsfdsfdsgf","dfdsfgsgfsg","gfsgfsg","xxxxxxxxxxxx","gdgfdafhuadh","gsdgadf","fdafugda","gdfgfs"] },
  { id: 2, name:"hello" ,tags: ["aws"] },
  { id: 3,name:"hello" , tags: [] },
  { id: 4, name:"hello" ,tags: [] },
  { id: 5,name:"hello" , tags: [] },
  { id: 6,name:"hello" , tags: [] },
];

export default function YardPage() {
  return (
    <div className="min-h-screen px-8 py-10">
      <div className="relative h-48 bg-amber-400" >
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-semibold">Tags:--</span>
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-red-300 px-2 py-1 text-sm text-white">
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute right-1 bottom-1">
          <button className="rounded bg-gray-300 px-3 py-1 text-sm font-medium cursor-pointer hover:bg-gray-600">+ Add</button>
        </div>
      </div>
      

     <div className="mt-4 grid grid-cols-4 gap-4 mb-10">
      {cardData.map((card) => (
        <div key={card.id} className="relative h-48 rounded bg-gray-200 p-2 flex flex-col">

          <div className="flex-3">
            {card.name}
          </div>
      
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

     
        <div className="flex items-center justify-center text-sm text-black">
          ← <span className="underline">1</span>,<span>2</span>,<span>3..</span> →
        </div>

        
    </div>
  );
}
