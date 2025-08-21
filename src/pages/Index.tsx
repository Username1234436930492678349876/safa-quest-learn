import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { RoleCard } from '@/components/ui/role-card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import heroQuestScroll from '@/assets/hero-quest-scroll.jpg';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'student') {
        navigate('/student');
      } else if (profile.role === 'teacher' || profile.role === 'admin') {
        navigate('/teacher');
      }
    }
  }, [user, profile, navigate]);

  const texts = {
    en: {
      title: 'SafaQuest',
      subtitle: 'Adaptive Learning Adventures',
      description: 'Transform learning into epic quests with AI-powered personalized education',
      studentRole: 'Student Explorer',
      studentDesc: 'Embark on learning quests, earn XP, and master skills through adaptive challenges',
      teacherRole: 'Quest Master',
      teacherDesc: 'Monitor student progress, verify achievements, and guide learning journeys',
      getStarted: 'Choose Your Adventure',
      features: {
        adaptive: 'Adaptive Learning',
        gamified: 'Gamified Experience', 
        bilingual: 'Bilingual Support',
        realtime: 'Real-time Progress'
      }
    },
    ar: {
      title: 'سفا كويست',
      subtitle: 'مغامرات التعلم التكيفية',
      description: 'حوّل التعلم إلى مغامرات ملحمية مع التعليم الشخصي المدعوم بالذكاء الاصطناعي',
      studentRole: 'مستكشف طالب',
      studentDesc: 'انطلق في مهام التعلم، واكسب نقاط الخبرة، وأتقن المهارات من خلال التحديات التكيفية',
      teacherRole: 'سيد المهام',
      teacherDesc: 'راقب تقدم الطلاب، وتحقق من الإنجازات، ووجه رحلات التعلم',
      getStarted: 'اختر مغامرتك',
      features: {
        adaptive: 'التعلم التكيفي',
        gamified: 'تجربة اللعب',
        bilingual: 'دعم ثنائي اللغة',
        realtime: 'التقدم في الوقت الفعلي'
      }
    }
  };

  const t = texts[language];

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    if (role === 'student') {
      navigate('/student');
    } else {
      navigate('/teacher');
    }
  };

  return (
    <div className={`min-h-screen bg-background ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t.title}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-muted-foreground text-sm">
                  Welcome, {profile?.display_name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
            <LanguageToggle 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroQuestScroll})` }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-in">
              {t.title}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium opacity-90">
              {t.subtitle}
            </p>
            
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
              {t.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {Object.values(t.features).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button 
                size="lg" 
                variant="hero" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                {t.getStarted}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-quest bg-clip-text text-transparent">
            {t.getStarted}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your role to begin your learning adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {user ? (
            // If logged in, show direct dashboard buttons
            <>
              <RoleCard
                title={t.studentRole}
                description={t.studentDesc}
                icon={<GraduationCap className="h-8 w-8 text-primary" />}
                gradient="bg-gradient-quest"
                onClick={() => navigate('/student')}
              />
              
              <RoleCard
                title={t.teacherRole}
                description={t.teacherDesc}
                icon={<Users className="h-8 w-8 text-secondary" />}
                gradient="bg-gradient-achievement"
                onClick={() => navigate('/teacher')}
              />
            </>
          ) : (
            // If not logged in, show auth options  
            <>
              <RoleCard
                title={t.studentRole}
                description={t.studentDesc}
                icon={<GraduationCap className="h-8 w-8 text-primary" />}
                gradient="bg-gradient-quest"
                onClick={() => navigate('/auth')}
              />
              
              <RoleCard
                title={t.teacherRole}
                description={t.teacherDesc}
                icon={<Users className="h-8 w-8 text-secondary" />}
                gradient="bg-gradient-achievement"
                onClick={() => navigate('/auth')}
              />
            </>
          )}
        </div>
        
        {!user && (
          <div className="text-center pt-8">
            <p className="text-muted-foreground mb-4">
              New to SafaQuest? Get started today!
            </p>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth')}>
              Create Account
            </Button>
          </div>
        )}
      </section>

      {/* Features Preview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quest-Based Learning</h3>
              <p className="text-muted-foreground">Structured micro-lessons with step-by-step guidance</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">AI Mentorship</h3>
              <p className="text-muted-foreground">Contextual hints and personalized feedback</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Guild Collaboration</h3>
              <p className="text-muted-foreground">Team up with classmates for shared missions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;