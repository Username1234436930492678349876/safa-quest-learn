-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  school_id TEXT,
  language_pref TEXT DEFAULT 'en' CHECK (language_pref IN ('en', 'ar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table for student-specific data
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  baseline_scores JSONB DEFAULT '{}',
  mastery_state JSONB DEFAULT '{}',
  guild_id UUID,
  weekly_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guilds table
CREATE TABLE public.guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  shared_xp INTEGER DEFAULT 0,
  rank_in_class INTEGER,
  mission_submissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL DEFAULT 50,
  content JSONB NOT NULL DEFAULT '{}',
  skill_tags TEXT[] DEFAULT '{}',
  grade_level INTEGER,
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quest attempts table
CREATE TABLE public.quest_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  step_results JSONB DEFAULT '{}',
  time_spent INTEGER DEFAULT 0,
  hint_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB DEFAULT '{}',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user badges junction table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Add foreign key constraint for guild_id in students table
ALTER TABLE public.students ADD CONSTRAINT fk_students_guild FOREIGN KEY (guild_id) REFERENCES public.guilds(id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Students policies  
CREATE POLICY "Users can view their own student data" ON public.students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own student data" ON public.students FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own student data" ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guilds policies
CREATE POLICY "Users can view all guilds" ON public.guilds FOR SELECT USING (true);
CREATE POLICY "Only teachers can modify guilds" ON public.guilds FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
  )
);

-- Quests policies
CREATE POLICY "All users can view quests" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Only teachers can modify quests" ON public.quests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
  )
);

-- Quest attempts policies
CREATE POLICY "Users can view their own quest attempts" ON public.quest_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quest attempts" ON public.quest_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quest attempts" ON public.quest_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "All users can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Only admins can modify badges" ON public.badges FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only teachers can award badges" ON public.user_badges FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role, language_pref)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'language_pref', 'en')
  );
  
  -- If it's a student, create student record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_guilds_updated_at BEFORE UPDATE ON public.guilds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON public.quests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quest_attempts_updated_at BEFORE UPDATE ON public.quest_attempts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- Insert sample guilds
INSERT INTO public.guilds (id, name, member_count, shared_xp, rank_in_class) VALUES
  (gen_random_uuid(), 'Knowledge Seekers', 5, 1250, 1),
  (gen_random_uuid(), 'Math Masters', 4, 980, 2),
  (gen_random_uuid(), 'Science Squad', 6, 1180, 3);

-- Insert sample quests
INSERT INTO public.quests (title, subject, duration, difficulty, xp_reward, content) VALUES
  ('Algebra Fundamentals', 'Mathematics', '15 min', 'easy', 50, '{"description": "Learn basic algebra concepts and solve simple equations"}'),
  ('Poetry Analysis', 'Arabic Literature', '20 min', 'medium', 75, '{"description": "Analyze classical Arabic poetry and understand literary devices"}'),
  ('Chemical Reactions', 'Science', '25 min', 'hard', 100, '{"description": "Understand chemical reactions and balance equations"}'),
  ('Geometry Basics', 'Mathematics', '18 min', 'easy', 60, '{"description": "Learn about shapes, angles, and basic geometric principles"}'),
  ('Grammar Rules', 'Arabic Language', '12 min', 'easy', 40, '{"description": "Master Arabic grammar rules and sentence structure"}'),
  ('Physics Laws', 'Science', '30 min', 'hard', 120, '{"description": "Explore fundamental physics laws and their applications"}');

-- Insert sample badges
INSERT INTO public.badges (name, description, icon) VALUES
  ('First Quest', 'Complete your first quest', '🎯'),
  ('Math Wizard', 'Complete 5 mathematics quests', '🧮'),
  ('Science Explorer', 'Complete 5 science quests', '🔬'),
  ('Language Master', 'Complete 5 language quests', '📚'),
  ('Streak Champion', 'Maintain a 7-day streak', '🔥'),
  ('Guild Leader', 'Help your guild reach #1 rank', '👑');