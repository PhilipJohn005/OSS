"use client";

import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Star,
  GitPullRequest,
  Users,
  Github,
  Target,
  Zap,
  Heart,
  Calendar,
  TrendingUp,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}


async function fetchUserStats(username: string, accessToken: string) {
  const headers = {
    Authorization: `token ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  const [userRes, prRes, issueRes, eventRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/search/issues?q=is:pr+author:${username}+is:public`, { headers }),
    fetch(`https://api.github.com/search/issues?q=is:issue+author:${username}+is:public+is:closed`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers }),
  ]);

  const userData = await userRes.json();
  const prData = await prRes.json();
  const issueData = await issueRes.json();
  const eventData = await eventRes.json();
  const repoData = await reposRes.json();
  const events = Array.isArray(eventData) ? eventData : eventData?.items || [];
  const userLogin = userData.login; // you already fetched user info
    {/*const uniqueRepos = new Set(
    events
        .filter((e: any) => e.repo?.name && !e.repo.name.startsWith(`${userLogin}/`)) // exclude self
        .map((e: any) => e.repo.name)
    );*/}
  const uniqueRepos = new Set(events.map((e: any) => e.repo?.name).filter(Boolean));

  const totalStars = Array.isArray(repoData)
    ? repoData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
    : 0;

  return {
    totalPRs: prData.total_count,
    totalContributions: prData.total_count + issueData.total_count,
    projectsContributed: uniqueRepos.size,
    issuesResolved: issueData.total_count,
    totalStars,
    followersCount: userData.followers,
  };
}
  {/*const userLogin = userData.login;

  // Filter PRs authored by user in someone else's repo
  const validPRs = (prData.items || []).filter(
    (pr: any) => pr.repository_url && !pr.repository_url.endsWith(`/${userLogin}/${pr.repository_url.split("/").pop()}`)
  );

  // Filter issues similarly (if needed)
  const validIssues = (issueData.items || []).filter(
    (issue: any) => issue.repository_url && !issue.repository_url.endsWith(`/${userLogin}/${issue.repository_url.split("/").pop()}`)
  );

  // External repositories only
  const externalRepos = Array.isArray(eventData)
    ? eventData.filter((e: any) =>
        e.repo?.name && !e.repo.name.startsWith(`${userLogin}/`)
      )
    : [];

  const uniqueExternalRepos = new Set(
    externalRepos.map((e: any) => e.repo.name)
  );

  // Star count from *external* repos is ignored — we assume own repo stars don't count
  const totalStars = Array.isArray(repoData)
  ? repoData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
  : 0;


  return {
    totalPRs: validPRs.length,
    totalContributions: validPRs.length + validIssues.length,
    projectsContributed: uniqueExternalRepos.size,
    issuesResolved: validIssues.length,
    totalStars,
    followersCount: userData.followers,
    yearsActive: new Date().getFullYear() - new Date(userData.created_at).getFullYear(),
  };
}*/}


const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "text-gray-600 bg-gray-100";
    case "rare": return "text-blue-600 bg-blue-100";
    case "epic": return "text-purple-600 bg-purple-100";
    case "legendary": return "text-yellow-600 bg-yellow-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case "common": return "border-gray-200";
    case "rare": return "border-blue-200";
    case "epic": return "border-purple-200";
    case "legendary": return "border-yellow-200";
    default: return "border-gray-200";
  }
};

const DashboardPage = () => {
  const { data: session, status } = useSession() 
  
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);      

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
        const jwtPayload = (session.user as any).jwt
            ? JSON.parse(atob((session.user as any).jwt.split('.')[1])) // decode JWT payload
            : null;

        const username = jwtPayload?.username;
        const accessToken = jwtPayload?.accessToken;

        if (username && accessToken) {
            fetchUserStats(username, accessToken).then(setUserStats);
        }
    }

}, [status, session]);


  if (!userStats) return <div className="p-6 text-gray-600">Loading dashboard...</div>;

  const achievements: Achievement[] = [
  {
    id: "newbie",
    title: "Newbie Contributor",
    description: "Made your first contribution",
    icon: <Star className="w-5 h-5" />,
    earned: userStats.totalContributions >= 1,
    rarity: "common",
  },
  {
    id: "first-pr",
    title: "First PR",
    description: "Opened your first pull request",
    icon: <GitPullRequest className="w-5 h-5" />,
    earned: userStats.totalPRs >= 1,
    rarity: "common",
  },
  {
    id: "ten-prs",
    title: "Contributor",
    description: "10+ pull requests made",
    icon: <Medal className="w-5 h-5 text-blue-500" />,
    earned: userStats.totalPRs >= 10,
    rarity: "rare",
  },
  {
    id: "fifty-prs",
    title: "Open Source Addict",
    description: "50+ pull requests made",
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
    earned: userStats.totalPRs >= 50,
    rarity: "epic",
  },
  {
    id: "issues-fixed",
    title: "Bug Basher",
    description: "Resolved 20+ issues",
    icon: <Target className="w-5 h-5" />,
    earned: userStats.issuesResolved >= 20,
    rarity: "rare",
  },
  {
    id: "helper",
    title: "Community Helper",
    description: "Resolved 50+ issues",
    icon: <Heart className="w-5 h-5 text-pink-500" />,
    earned: userStats.issuesResolved >= 50,
    rarity: "epic",
  },
  {
    id: "external-collab",
    title: "Team Player",
    description: "Contributed to 5+ external repositories",
    icon: <Users className="w-5 h-5" />,
    earned: userStats.projectsContributed >= 5,
    rarity: "rare",
  },
  {
    id: "external-heavy",
    title: "OSS Explorer",
    description: "Contributed to 15+ external repositories",
    icon: <Zap className="w-5 h-5 text-purple-600" />,
    earned: userStats.projectsContributed >= 15,
    rarity: "epic",
  },
  {
    id: "popular",
    title: "Popular Dev",
    description: "Earned 50+ stars on your projects",
    icon: <TrendingUp className="w-5 h-5" />,
    earned: userStats.totalStars >= 50,
    rarity: "rare",
  },
  {
    id: "star-master",
    title: "Star Master",
    description: "Earned 100+ stars",
    icon: <Star className="w-5 h-5 text-yellow-600" />,
    earned: userStats.totalStars >= 100,
    rarity: "epic",
  },
  {
    id: "veteran",
    title: "Veteran Dev",
    description: "Active for 3+ years on GitHub",
    icon: <Calendar className="w-5 h-5" />,
    earned: userStats.yearsActive >= 3,
    rarity: "legendary",
  },
  {
    id: "influencer",
    title: "GitHub Influencer",
    description: "Gained 100+ followers",
    icon: <Github className="w-5 h-5" />,
    earned: userStats.followersCount >= 100,
    rarity: "legendary",
  }
];


  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievements = achievements.filter(a => !a.earned).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
          onClick={() => router.push("/yard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">DevConnect</h1>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
      <p className="text-gray-600 mb-6">Track your open source journey and achievements</p>

      <div className="grid grid-cols-6 gap-4 mb-8">
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-blue-600">{userStats.totalPRs}</div><p className="text-sm text-gray-600">Pull Requests</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{userStats.totalContributions}</div><p className="text-sm text-gray-600">Contributions</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-purple-600">{userStats.projectsContributed}</div><p className="text-sm text-gray-600">Projects Contributed</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-orange-600">{userStats.issuesResolved}</div><p className="text-sm text-gray-600">Issues Resolved</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-yellow-600">{userStats.totalStars}</div><p className="text-sm text-gray-600">Stars Earned</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-4"><div className="text-2xl font-bold text-pink-600">{userStats.followersCount}</div><p className="text-sm text-gray-600">Followers</p></CardContent></Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Earned Achievements ({earnedAchievements.length}/{achievements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedAchievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} bg-white`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)}`}>{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <Badge variant="secondary" className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Next Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextAchievements.map((achievement) => (
              <div key={achievement.id} className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gray-200 text-gray-400">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-700">{achievement.title}</h3>
                      <Badge variant="outline" className="text-xs">{achievement.rarity}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
