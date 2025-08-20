import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AuthPage = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: 'student' as 'student' | 'teacher',
    schoolId: ''
  });

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const texts = {
    en: {
      welcome: 'Welcome to SafaQuest',
      subtitle: 'Transform learning into epic adventures',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      displayName: 'Full Name',
      role: 'I am a',
      student: 'Student',
      teacher: 'Teacher',
      schoolCode: 'School Code',
      createAccount: 'Create Account',
      signInAccount: 'Sign In',
      alreadyHaveAccount: 'Already have an account?',
      needAccount: "Don't have an account?",
      passwordsDontMatch: 'Passwords do not match',
      fillAllFields: 'Please fill in all fields'
    },
    ar: {
      welcome: 'أهلاً بكم في سافا كويست',
      subtitle: 'حوّل التعلم إلى مغامرات ملحمية',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      displayName: 'الاسم الكامل',
      role: 'أنا',
      student: 'طالب',
      teacher: 'معلم',
      schoolCode: 'رمز المدرسة',
      createAccount: 'إنشاء الحساب',
      signInAccount: 'دخول',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      needAccount: 'لا تملك حساباً؟',
      passwordsDontMatch: 'كلمات المرور غير متطابقة',
      fillAllFields: 'يرجى ملء جميع الحقول'
    }
  };

  const t = texts[language];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Redirect based on user role or default to home
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.email || !signUpData.password || !signUpData.displayName) {
      alert(t.fillAllFields);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      alert(t.passwordsDontMatch);
      return;
    }

    setLoading(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, {
      display_name: signUpData.displayName,
      role: signUpData.role,
      language_pref: language,
      school_id: signUpData.schoolId
    });

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email || !signInData.password) {
      alert(t.fillAllFields);
      return;
    }

    setLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);

    setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-hero flex items-center justify-center p-4 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle 
          currentLanguage={language} 
          onLanguageChange={setLanguage} 
        />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">SafaQuest</h1>
          </div>
          <h2 className="text-2xl font-bold text-white">{t.welcome}</h2>
          <p className="text-white/80">{t.subtitle}</p>
        </div>

        {/* Auth Form */}
        <Card className="quest-card">
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
                <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t.email}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t.password}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '...' : t.signInAccount}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.displayName}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpData.displayName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, displayName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t.role}</Label>
                    <Select value={signUpData.role} onValueChange={(value: 'student' | 'teacher') => setSignUpData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            {t.student}
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {t.teacher}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school-code">{t.schoolCode}</Label>
                    <Input
                      id="school-code"
                      type="text"
                      value={signUpData.schoolId}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, schoolId: e.target.value }))}
                      placeholder="DEMO2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.email}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.password}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '...' : t.createAccount}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;