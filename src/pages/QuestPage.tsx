import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Star, Lightbulb } from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const QuestPage = () => {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quests, updateQuestProgress, getQuestAttempt } = useStudentData();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState(false);

  const quest = quests.find(q => q.id === questId);
  const attempt = getQuestAttempt(questId || '');

  useEffect(() => {
    if (!quest) {
      navigate('/student');
    }
  }, [quest, navigate]);

  if (!quest) {
    return null;
  }

  // Mock quest steps for demonstration
  const steps = [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2,
      hint: 'Think about the city known for the Eiffel Tower!'
    },
    {
      id: 2,
      type: 'multiple_choice',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 1,
      hint: 'This planet is named after the Roman god of war.'
    },
    {
      id: 3,
      type: 'text',
      question: 'Name one renewable energy source.',
      hint: 'Think about energy from the sun, wind, or water.'
    }
  ];

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer.toString() }));
  };

  const handleNext = async () => {
    const step = steps[currentStep];
    const userAnswer = answers[currentStep];
    
    if (!userAnswer) {
      toast({
        title: "Please provide an answer",
        description: "You need to answer the question before proceeding.",
        variant: "destructive"
      });
      return;
    }

    let isCorrect = false;
    if (step.type === 'multiple_choice') {
      isCorrect = parseInt(userAnswer) === step.correct;
    } else {
      // For text questions, accept any non-empty answer for demo
      isCorrect = userAnswer.trim().length > 0;
    }

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! Moving to next step.",
      });
    } else {
      toast({
        title: "Try again",
        description: "That's not quite right. Check the hint if you need help.",
        variant: "destructive"
      });
      return;
    }

    const nextStep = currentStep + 1;
    const progress = Math.round((nextStep / steps.length) * 100);
    
    if (nextStep >= steps.length) {
      // Quest completed
      if (attempt) {
        await updateQuestProgress(attempt.id, 100, true);
      }
      
      toast({
        title: "Quest Completed!",
        description: `Congratulations! You earned ${quest.xp_reward} XP!`,
      });
      
      navigate('/student');
    } else {
      // Update progress
      if (attempt) {
        await updateQuestProgress(attempt.id, progress);
      }
      setCurrentStep(nextStep);
      setShowHint(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    } else {
      navigate('/student');
    }
  };

  const currentStepData = steps[currentStep];
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">{quest.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-1" />
              {quest.duration}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              {quest.xp_reward} XP
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps.length - currentStep - 1} remaining</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="quest-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Question {currentStep + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{currentStepData.question}</p>

            {/* Multiple Choice Options */}
            {currentStepData.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentStepData.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={answers[currentStep] === index.toString() ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Text Input */}
            {currentStepData.type === 'text' && (
              <div className="space-y-3">
                <textarea
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none"
                  rows={3}
                  placeholder="Type your answer here..."
                  value={answers[currentStep] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </div>
            )}

            {/* Hint Section */}
            {showHint && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Hint</h4>
                    <p className="text-muted-foreground mt-1">{currentStepData.hint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                disabled={showHint}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHint ? 'Hint Shown' : 'Need a Hint?'}
              </Button>

              <Button 
                onClick={handleNext}
                disabled={!answers[currentStep]}
                className="bg-gradient-quest border-0 hover:opacity-90"
              >
                {currentStep === steps.length - 1 ? 'Complete Quest' : 'Next Step'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuestPage;