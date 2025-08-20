import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Quest {
  id: string;
  title: string;
  subject: string;
  duration: string;
  difficulty: string;
  xp_reward: number;
  content: any;
}

interface QuestAttempt {
  id: string;
  quest_id: string;
  progress: number;
  completed: boolean;
  quests: Quest;
}

export const useStudentData = () => {
  const { user, studentData } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questAttempts, setQuestAttempts] = useState<QuestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch available quests
      const { data: questsData } = await supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: true });

      if (questsData) {
        setQuests(questsData);
      }

      // Fetch user's quest attempts
      const { data: attemptsData } = await supabase
        .from('quest_attempts')
        .select(`
          *,
          quests (*)
        `)
        .eq('user_id', user.id);

      if (attemptsData) {
        setQuestAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuest = async (questId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quest_attempts')
        .insert({
          user_id: user.id,
          quest_id: questId,
          progress: 0,
          completed: false
        })
        .select(`
          *,
          quests (*)
        `)
        .single();

      if (error) throw error;

      if (data) {
        setQuestAttempts(prev => [...prev, data]);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error starting quest:', error);
      return { data: null, error };
    }
  };

  const updateQuestProgress = async (attemptId: string, progress: number, completed: boolean = false) => {
    if (!user) return;

    try {
      const updateData: any = { progress };
      if (completed) {
        updateData.completed = true;
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('quest_attempts')
        .update(updateData)
        .eq('id', attemptId)
        .select(`
          *,
          quests (*)
        `)
        .single();

      if (error) throw error;

      if (data) {
        setQuestAttempts(prev => 
          prev.map(attempt => 
            attempt.id === attemptId ? data : attempt
          )
        );

        // If quest is completed, update student XP
        if (completed && data.quests) {
          await updateStudentXP(data.quests.xp_reward);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating quest progress:', error);
      return { data: null, error };
    }
  };

  const updateStudentXP = async (xpGained: number) => {
    if (!user || !studentData) return;

    try {
      const newTotalXP = studentData.total_xp + xpGained;
      const newLevel = Math.floor(newTotalXP / 100) + 1; // Simple level calculation

      const { error } = await supabase
        .from('students')
        .update({
          total_xp: newTotalXP,
          level: newLevel
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating student XP:', error);
    }
  };

  // Helper function to get quest attempt for a specific quest
  const getQuestAttempt = (questId: string) => {
    return questAttempts.find(attempt => attempt.quest_id === questId);
  };

  // Helper function to check if quest is locked (based on previous quest completion)
  const isQuestLocked = (questIndex: number) => {
    if (questIndex === 0) return false; // First quest is never locked
    
    const previousQuest = quests[questIndex - 1];
    if (!previousQuest) return false;
    
    const previousAttempt = getQuestAttempt(previousQuest.id);
    return !previousAttempt?.completed;
  };

  return {
    quests,
    questAttempts,
    loading,
    startQuest,
    updateQuestProgress,
    getQuestAttempt,
    isQuestLocked,
    refreshData: fetchData
  };
};