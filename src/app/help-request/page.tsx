'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';

type Task = {
  id?: number;
  card_name: string;
  tags: string[];
  user_email:string;
};

interface ToggleTagFn {
    (tag: string): void;
}
interface AddCardRequest {
    name: string;
    tags: string[];
}

interface AddCardResponse {
    message: string;
    [key: string]: any;
}

interface CustomSession {
  accessToken?: string;
  [key: string]: any;
}

const Add = () => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shouldRunButtonEffect,setShouldRunButtonEffect]=useState(false);

  const { data: session } = useSession() as { data: CustomSession | null };

  useEffect(() => {
    if (!session?.user?.jwt) return;
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:4000/server/fetch-user-cards", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(session?.user as any)?.jwt ?? ''}`,
          },
        });
        const result = await res.json();
        setTasks(result.data || []);
      } catch (e) {
        console.error("Error fetching cards" + e);
      }
    }
    fetchCards();
  }, [session?.user?.jwt, shouldRunButtonEffect]);

  const availableTags = ['AWS', 'GCP', 'Azure', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes'];

  const toggleTag: ToggleTagFn = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: AddCardRequest = { name, tags: selectedTags };

    const res = await fetch("http://localhost:4000/server/add-card", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session?.user as any)?.jwt ?? ''}`,
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error: AddCardResponse = await res.json();
      console.error("Error:", error.message);
      return;
    }
    setShouldRunButtonEffect((prev)=>!prev);
    console.log("Added successfully");
    setName('');
    setSelectedTags([]);
  };

  return (
    <div className='h-screen w-screen px-4 py-4'>
        <form onSubmit={handleSubmit} className='border border-black p-6'>
          <div className='my-4'>
            <label className='px-4 block mb-2 font-medium'>Name</label>
            <input
              className='border-2 border-gray-300 rounded px-3 py-2 w-full'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className='my-4'>
            <label className='px-4 block mb-2 font-medium'>Tags</label>
            <div className='flex flex-wrap gap-2'>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`px-3 py-1 rounded-full border ${
                    selectedTags.includes(tag) 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className='mt-2 text-sm text-gray-600'>
              Selected: {selectedTags.join(', ') || 'None'}
            </div>
          </div>
          
          <div className='flex justify-center mt-6'>
            <button 
              type="submit"
              className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
            >
              Add To Table
            </button>
          </div>
        </form>
        
        

        <div>
        <h1>Your Help Requests</h1>
        <div className="mt-4 mb-10">
          {tasks.length > 0 ? (
            <div className="flex overflow-x-auto pb-2 gap-4"> {/* Added pb-2 for scrollbar space */}
              {tasks.map((task, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-64 h-48 rounded bg-gray-200 p-2 flex flex-col"
                >
                  <div className="flex-2">
                    {task.card_name}
                  </div>
                  <div className='flex-2 space-x-4'>
                    <button className='p-2 bg-gray-600 rounded hover:bg-gray-300 transition'>
                      Edit
                    </button>
                    <button className='p-2 bg-red-500 text-white rounded hover:bg-red-600 transition'>
                      Delete
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto flex flex-wrap gap-2 items-start">
                    {task.tags.map((tag) => (
                      <span key={tag} className="rounded bg-red-300 px-2 py-1 text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No help requests yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Add