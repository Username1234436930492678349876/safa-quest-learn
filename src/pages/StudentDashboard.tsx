import React, { useState } from 'react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { QuestCard } from '@/components/ui/quest-card';
import { XPBadge } from '@/components/ui/xp-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Users, Trophy, Target, Zap } from 'lucide-react';
import aiMentorOwl from '@/assets/ai-mentor-owl.jpg';

interface Quest {
  id: string;
  title: string;
  subject: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  completed?: boolean;
  locked?: boolean;
  progress?: number;
}

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Algebra Fundamentals',
    subject: 'Mathematics',
    duration: '15 min',
    difficulty: 'easy',
    xpReward: 50,
    progress: 75
  },
  {
    id: '2', 
    title: 'Poetry Analysis',
    subject: 'Arabic Literature',
    duration: '20 min',
    difficulty: 'medium',
    xpReward: 75,
    locked: false
  },
  {
    id: '3',
    title: 'Chemical Reactions',
    subject: 'Science',
    duration: '25 min',
    difficulty: 'hard',
    xpReward: 100,
    locked: true
  }
];

const StudentDashboard = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const studentData = {
    name: 'Ahmed',
    level: 12,
    totalXP: 2450,
    streakDays: 7,
    guildName: 'Knowledge Seekers',
    guildRank: 3,
    weeklyProgress: 65
  };

  const texts = {
    en: {
      welcome: 'Welcome back',
      todaysQuests: "Today's Quests",
      guildProgress: 'Guild Progress',
      weeklyGoal: 'Weekly Goal',
      streakDays: 'day streak',
      startQuest: 'Start Quest',
      askMentor: 'Ask AI Mentor',
      guildRank: 'Guild Rank'
    },
    ar: {
      welcome: 'أهلاً بعودتك',
      todaysQuests: 'مهام اليوم',
      guildProgress: 'تقدم النقابة',
      weeklyGoal: 'الهدف الأسبوعي',
      streakDays: 'يوم متتالي',
      startQuest: 'ابدأ المهمة',
      askMentor: 'اسأل المرشد الذكي',
      guildRank: 'ترتيب النقابة'
    }
  };

  const t = texts[language];

  return (
    <div className={`min-h-screen bg-background ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SafaQuest
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <XPBadge xp={studentData.totalXP} level={studentData.level} />
            <LanguageToggle 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">
            {t.welcome}, {studentData.name}! 🎯
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Zap className="h-4 w-4 mr-2" />
              {studentData.streakDays} {t.streakDays}
            </Badge>
            
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Users className="h-4 w-4 mr-2" />
              {studentData.guildName}
            </Badge>
            
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Trophy className="h-4 w-4 mr-2" />
              {t.guildRank} #{studentData.guildRank}
            </Badge>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="quest-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5" />
                {t.weeklyGoal}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProgressRing progress={studentData.weeklyProgress} size={100}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {studentData.weeklyProgress}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </ProgressRing>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                {t.guildProgress}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-secondary">
                {studentData.guildName}
              </div>
              <div className="text-sm text-muted-foreground">
                Rank #{studentData.guildRank} in class
              </div>
              <Button variant="outline" size="sm">
                View Guild
              </Button>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Avatar className="mx-auto h-16 w-16">
                <AvatarImage src={aiMentorOwl} alt="AI Mentor" />
                <AvatarFallback>🦉</AvatarFallback>
              </Avatar>
              <Button variant="quest" size="sm" className="w-full">
                {t.askMentor}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Today's Quests */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {t.todaysQuests}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                {...quest}
                onClick={() => setSelectedQuest(quest)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;