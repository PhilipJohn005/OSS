'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import TaskCard from '@/components/help-request-comp/TaskCard';
import { Code, Github, Plus, LibraryBig, Tag, ArrowLeft, ExternalLink, Users,LoaderCircle, SplineIcon, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import {
  Task,
  ToggleTagFn,
  AddCardRequest,
  AddCardResponse,
  CustomSession,
} from '@/components/help-request-comp/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import toast from 'react-hot-toast';
import {Link as Lk} from 'lucide-react'
import Link   from 'next/link';

const Add = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shouldRunButtonEffect, setShouldRunButtonEffect] = useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const { data: session } = useSession() as { data: CustomSession | null };

  const availableTags = [
    // Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Scala', 'Perl', 'Haskell', 'Elixir', 'Dart',

    // Frontend Frameworks
    'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Qwik', 'SolidJS', 'Preact', 'Lit', 'Alpine.js',

    // Backend Frameworks
    'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Phoenix', 'Hapi', 'Koa.js', 'Actix',

    // Mobile & Cross-Platform
    'React Native', 'Flutter', 'SwiftUI',  'Xamarin', 'Ionic', 'NativeScript',

    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'MariaDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'Supabase', 'PlanetScale', 'Firebase Realtime DB', 'Firestore',

    // DevOps & CI/CD
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI', 'Travis CI', 'ArgoCD', 'Spinnaker',

    // Cloud Platforms
    'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Linode', 'Vultr', 'Render', 'Railway', 'Heroku', 'Netlify', 'Vercel', 'Cloudflare',

    // AI/ML & Data
    'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV', 'Jupyter', 'LangChain', 'Transformers', 'Hugging Face', 'OpenAI', 'spaCy',

    // APIs
    'GraphQL', 'REST API', 'gRPC', 'tRPC', 'WebSockets', 'OpenAPI', 'Postman', 'Swagger',

    // CMS & E-commerce
    'WordPress', 'Strapi', 'Sanity', 'Ghost', 'Contentful', 'Shopify', 'Magento', 'WooCommerce', 'Medusa.js',

    // Static Site Generators
    'Gatsby', 'Hugo', 'Jekyll', '11ty', 'Astro',

    // Testing
    'Jest', 'Mocha', 'Chai', 'Vitest', 'Cypress', 'Playwright', 'Selenium', 'Testing Library',

    // Authentication & Identity
    'OAuth', 'JWT', 'Auth0', 'Clerk', 'Firebase Auth', 'NextAuth.js', 'Supabase Auth',

    // Package Managers & Build Tools
    'npm', 'yarn', 'pnpm', 'Webpack', 'Vite', 'Rollup', 'Parcel', 'Turbopack', 'Bun', 'esbuild',

    // Styling
    'Tailwind CSS', 'Sass', 'Less', 'Styled Components', 'Emotion', 'Chakra UI', 'Material UI', 'Bootstrap', 'ShadCN UI',

    // OS & Platforms
    'Linux', 'Windows', 'macOS', 'Ubuntu', 'Debian', 'Arch', 'Fedora', 'iOS', 'Android',

    // Version Control & Tools
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Mercurial', 'SVN',

    // Monitoring & Analytics
    'Prometheus', 'Grafana', 'Datadog', 'Sentry', 'LogRocket', 'Amplitude', 'Mixpanel',

    // Messaging & Event Systems
    'Kafka', 'RabbitMQ', 'NATS', 'Redis Streams', 'Pub/Sub', 'Socket.IO',

    // Misc Tools & Platforms
    'Electron', 'n8n', 'Zod', 'Prisma', 'Drizzle ORM', 'Sequelize', 'TypeORM', 'RxJS', 'OpenTelemetry', 'WebRTC', 'Three.js', 'Babylon.js'
  ];

  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 10);

  const toggleTag: ToggleTagFn = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    if (!session?.user?.jwt) return;
    const fetchCards = async () => {
      try {
        
        setIsLoading(true);
        const res = await fetch('https://oss-backend-2.onrender.com/server/fetch-user-cards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.jwt}`,
          },
        });
        const result = await res.json();
        setIsLoading(false);
        setTasks(result.data || []);
      } catch (e) {
        console.error('Error fetching cards', e);
        setIsLoading(false);
        setRepoUrl('');
        setProductDescription('');
        setSelectedTags([]);
      }
    };
    fetchCards();
  }, [session?.user?.jwt, shouldRunButtonEffect]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const body: AddCardRequest = {
      repo_url: repoUrl,
      product_description: productDescription,
      tags: selectedTags,
    };
    const res = await fetch('https://oss-backend-2.onrender.com/server/add-card', {
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
        setRepoUrl('');
        setProductDescription('');
        setSelectedTags([]);
        return;
      }
      console.error('Error:', error?.message ?? error ?? 'Unknown error');
      setRepoUrl('');
      setProductDescription('');
      setSelectedTags([]);
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
          <Link href="/yard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
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
                <Lk className='w-5 h-5' /> Repository URL
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
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="font-medium">Technologies</label>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {displayedTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="text-xs h-8"
                  >
                    {tag}
                  </Button>
                ))}
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
                <div className="mt-2 flex flex-wrap items-center gap-2">
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
            
            {
              isLoading ? (
                <Button disabled className='w-full'>
                  <span className='flex items-center justify-center'><LoaderCircle className='animate-spin'/></span>
                </Button>
              ):(
                <Button type="submit" className="cursor-pointer w-full">
                  Submit Project
                </Button>
              )}
            
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
              {
                isLoading ? (
                  <div className='flex items-center justify-center'>
                    <LoaderCircle className='animate-spin'/>
                  </div>
                ):tasks.length > 0 ? (
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
                  )
                
              }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Add;