import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { QuestCard } from '@/components/ui/quest-card';
import { XPBadge } from '@/components/ui/xp-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Users, Trophy, Target, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudentData } from '@/hooks/useStudentData';
import { toast } from '@/hooks/use-toast';
import aiMentorOwl from '@/assets/ai-mentor-owl.jpg';


const StudentDashboard = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { user, profile, studentData, loading: authLoading } = useAuth();
  const { quests, questAttempts, loading: questsLoading, startQuest, getQuestAttempt, isQuestLocked } = useStudentData();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Set language from profile
  useEffect(() => {
    if (profile?.language_pref) {
      setLanguage(profile.language_pref);
    }
  }, [profile]);

  if (authLoading || questsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !studentData) {
    return null;
  }

  const handleStartQuest = async (questId: string) => {
    const existingAttempt = getQuestAttempt(questId);
    
    if (existingAttempt) {
      // Quest already started, handle accordingly
      toast({
        title: "Quest In Progress",
        description: "You've already started this quest!",
      });
      return;
    }

    const result = await startQuest(questId);
    
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to start quest. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Quest Started!",
        description: "Your adventure begins now. Good luck!",
      });
    }
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
            <XPBadge xp={studentData.total_xp} level={studentData.level} />
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
            {t.welcome}, {profile.display_name}! 🎯
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Zap className="h-4 w-4 mr-2" />
              {studentData.streak_days} {t.streakDays}
            </Badge>
            
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Users className="h-4 w-4 mr-2" />
              {studentData.guilds?.name || 'No Guild'}
            </Badge>
            
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Trophy className="h-4 w-4 mr-2" />
              {t.guildRank} #{studentData.guilds?.rank_in_class || 'N/A'}
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
              <ProgressRing progress={studentData.weekly_progress} size={100}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {studentData.weekly_progress}%
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
                {studentData.guilds?.name || 'No Guild'}
              </div>
              <div className="text-sm text-muted-foreground">
                {studentData.guilds?.rank_in_class ? `Rank #${studentData.guilds.rank_in_class} in class` : 'Join a guild to compete!'}
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
            {quests.map((quest, index) => {
              const attempt = getQuestAttempt(quest.id);
              const locked = isQuestLocked(index);
              
              return (
                <QuestCard
                  key={quest.id}
                  title={quest.title}
                  subject={quest.subject}
                  duration={quest.duration}
                  difficulty={quest.difficulty as 'easy' | 'medium' | 'hard'}
                  xpReward={quest.xp_reward}
                  completed={attempt?.completed || false}
                  locked={locked}
                  progress={attempt?.progress || 0}
                  onClick={() => locked ? null : handleStartQuest(quest.id)}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;