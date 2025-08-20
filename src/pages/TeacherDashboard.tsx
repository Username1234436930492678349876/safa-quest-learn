import React, { useState } from 'react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Trophy,
  Download
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  progress: number;
  questsCompleted: number;
  lastActive: string;
  status: 'active' | 'at-risk' | 'inactive';
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmed Ali',
    progress: 85,
    questsCompleted: 12,
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Fatima Hassan',
    progress: 92,
    questsCompleted: 15,
    lastActive: '1 hour ago', 
    status: 'active'
  },
  {
    id: '3',
    name: 'Omar Ibrahim',
    progress: 45,
    questsCompleted: 6,
    lastActive: '3 days ago',
    status: 'at-risk'
  },
  {
    id: '4',
    name: 'Layla Mohammed',
    progress: 78,
    questsCompleted: 10,
    lastActive: '5 hours ago',
    status: 'active'
  }
];

const statusColors = {
  active: 'bg-success text-success-foreground',
  'at-risk': 'bg-destructive text-destructive-foreground',
  inactive: 'bg-muted text-muted-foreground'
};

const TeacherDashboard = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const classStats = {
    totalStudents: 28,
    activeToday: 24,
    avgProgress: 73,
    questsCompleted: 156,
    atRiskStudents: 4
  };

  const texts = {
    en: {
      dashboard: 'Teacher Dashboard',
      classOverview: 'Class Overview',
      studentProgress: 'Student Progress',
      totalStudents: 'Total Students',
      activeToday: 'Active Today',
      avgProgress: 'Average Progress',
      questsCompleted: 'Quests Completed',
      atRiskStudents: 'At-Risk Students',
      exportData: 'Export Data',
      viewDetails: 'View Details',
      lastActive: 'Last Active',
      progress: 'Progress',
      quests: 'Quests'
    },
    ar: {
      dashboard: 'لوحة المعلم',
      classOverview: 'نظرة عامة على الفصل',
      studentProgress: 'تقدم الطلاب',
      totalStudents: 'إجمالي الطلاب',
      activeToday: 'نشط اليوم',
      avgProgress: 'متوسط التقدم',
      questsCompleted: 'المهام المكتملة',
      atRiskStudents: 'الطلاب المعرضون للخطر',
      exportData: 'تصدير البيانات',
      viewDetails: 'عرض التفاصيل',
      lastActive: 'آخر نشاط',
      progress: 'التقدم',
      quests: 'المهام'
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
            <Badge variant="outline" className="hidden sm:flex">
              Grade 7A
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t.exportData}
            </Button>
            <LanguageToggle 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t.dashboard}</h2>
          <p className="text-muted-foreground">Monitor student progress and engagement</p>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="quest-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalStudents}</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classStats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.activeToday}</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{classStats.activeToday}</div>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.avgProgress}</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{classStats.avgProgress}%</div>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.questsCompleted}</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{classStats.questsCompleted}</div>
            </CardContent>
          </Card>

          <Card className="quest-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.atRiskStudents}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{classStats.atRiskStudents}</div>
            </CardContent>
          </Card>
        </section>

        {/* Student Progress Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {t.studentProgress}
            </h3>
          </div>

          <Card className="quest-card">
            <CardHeader>
              <CardTitle>{t.classOverview}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {t.lastActive}: {student.lastActive}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">{student.progress}% {t.progress}</div>
                        <div className="text-xs text-muted-foreground">{student.questsCompleted} {t.quests}</div>
                      </div>
                      
                      <div className="w-24">
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      
                      <Badge className={statusColors[student.status]} variant="secondary">
                        {student.status}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        {t.viewDetails}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;