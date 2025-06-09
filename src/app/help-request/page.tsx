'use client'

import React, { useEffect, useState } from 'react'

type Task = {
  id?: number;
  name: string;
  tags: string[];
};

const App = () => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const availableTags = ['AWS', 'GCP', 'Azure', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes'];


  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(()=>{
    fetchTask();

  },[])

  const fetchTask=async()=>{
    const {error,data}=await supabase.from("trial_run").select("*")
    if(error){
      console.log("Error reading tasks"+error.message);
    }

    setTasks(data ?? []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res=await fetch("http://localhost:4000/server/add-card",{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({name,tags:selectedTags})
    })
    
    if (!res.ok) {
    const error = await res.json();
    console.error("Error:", error.message);
    return;
    }

    console.log("Added successfully");
    setName('');
    setSelectedTags([]);
  };

  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <form onSubmit={handleSubmit} className='border border-black p-6 rounded-lg'>
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
        
        <div className='mt-6 space-x-4'>
          <button className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'>
            Edit
          </button>
          <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default App