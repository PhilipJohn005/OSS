'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import TaskCard from '@/components/help-request-comp/TaskCard';
import { Code, Github, Plus, Link, LibraryBig, Tag, ArrowLeft, ExternalLink, Users } from 'lucide-react';
import {
  Task,
  ToggleTagFn,
  AddCardRequest,
  AddCardResponse,
  CustomSession,
} from '@/components/help-request-comp/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Add = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shouldRunButtonEffect, setShouldRunButtonEffect] = useState(false);
  const { data: session } = useSession() as { data: CustomSession | null };

  const availableTags = ['AWS', 'GCP', 'Azure', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes', 'n8n'];

  const toggleTag: ToggleTagFn = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    if (!session?.user?.jwt) return;
    const fetchCards = async () => {
      try {
        const res = await fetch('https://oss-backend-2.onrender.com/server/fetch-user-cards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.jwt}`,
          },
        });
        const result = await res.json();
        setTasks(result.data || []);
      } catch (e) {
        console.error('Error fetching cards', e);
      }
    };
    fetchCards();
  }, [session?.user?.jwt, shouldRunButtonEffect]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: AddCardRequest = {
      repo_url: repoUrl,
      product_description: productDescription,
      tags: selectedTags,
    };

    const res = await fetch('http://localhost:4000/server/add-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.jwt ?? ''}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error: AddCardResponse = await res.json();
      if (error?.error === 'GitHub access expired. Please log in again.') {
        alert('GitHub access token expired. Please re-login to enable full functionality later.');
        return;
      }
      console.error('Error:', error?.message ?? error ?? 'Unknown error');
      return;
    }

    setShouldRunButtonEffect((prev) => !prev);
    setRepoUrl('');
    setProductDescription('');
    setSelectedTags([]);
    console.log('Added successfully');
  };

  return (
    <div className="max-h-screen bg-[#f9fafb] pb-6">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">DevLinkr</h1>
          </div>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </header>

      {/* TITLE SECTION */}
      <div className='p-6 mx-auto max-w-7xl'>
        <div className='max-w-4xl'>
          <h2 className="text-3xl font-bold mb-2">Submit Your Project</h2>
          <p className="text-gray-600 mb-6">Share your open source project with the developer community</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto pl-6 pb-6 pr-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT - FORM */}
        <div className='bg-white p-6 border border-gray-300 rounded-xl shadow-sm max-h-[90vh] overflow-auto'>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl mb-1 flex items-center gap-2">
                <span className='text-blue-600'><Plus /></span> Project Information
              </h3>
              <p className="text-sm text-gray-500 mb-3">Tell us about your open source project and how others can contribute</p>
            </div>

            <div>
              <label className="font-medium mb-1 flex items-center gap-2">
                <Link className='w-5 h-5' /> Repository URL
              </label>
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                required
              />
            </div>

            <div>
              <label className="font-medium mb-1 flex items-center gap-2">
                <LibraryBig className='w-5 h-5' /> Project Description
              </label>
              <Textarea
                rows={4}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your project, its goals, and how the community can help..."
                required
              />
            </div>

            <div>
              <label className="font-medium flex mb-2 text-center gap-2">
                <Tag className='w-5 h-5' /> Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm border ${selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Selected: {selectedTags.join(', ') || 'None'}</p>
            </div>

            <Button type="submit" className="cursor-pointer w-full">
              Submit Project
            </Button>
          </form>
        </div>

        {/* RIGHT - SUBMITTED PROJECTS */}
        <div className="items-center justify-center flex flex-col w-full">
          <Card className="w-full max-w-4xl rounder-md">
            <CardHeader>
              <CardTitle className='font-bold text-2xl'>Your Submitted Projects</CardTitle>
              <CardDescription>
                Projects you've shared with the community
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">

                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{task.card_name}</h3>

                      {task.product_description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.product_description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Github className="w-3 h-3" />
                          {task.stars || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {task.open_issues_count || 0}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <a
                        href={task.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Repository
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm mt-4">No help requests yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Add;
