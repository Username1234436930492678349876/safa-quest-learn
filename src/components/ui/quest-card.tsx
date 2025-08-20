import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  title: string;
  subject: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  completed?: boolean;
  locked?: boolean;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

const difficultyColors = {
  easy: "bg-success text-success-foreground",
  medium: "bg-secondary text-secondary-foreground",
  hard: "bg-destructive text-destructive-foreground"
};

export function QuestCard({
  title,
  subject,
  duration,
  difficulty,
  xpReward,
  completed = false,
  locked = false,
  progress = 0,
  onClick,
  className
}: QuestCardProps) {
  return (
    <Card 
      className={cn(
        "quest-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-quest",
        locked && "opacity-50 cursor-not-allowed",
        completed && "ring-2 ring-success",
        className
      )}
      onClick={!locked ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary animate-smooth">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
          {completed && (
            <div className="flex items-center gap-1 text-success">
              <Trophy className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          <Badge className={cn("text-xs", difficultyColors[difficulty])}>
            {difficulty}
          </Badge>
        </div>

        {progress > 0 && !completed && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-progress h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-secondary">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">{xpReward} XP</span>
          </div>
          
          <Button 
            variant={completed ? "outline" : "default"}
            size="sm"
            disabled={locked}
            className={cn(
              "animate-smooth",
              !completed && !locked && "bg-gradient-quest border-0 hover:opacity-90"
            )}
          >
            {locked ? "Locked" : completed ? "Review" : "Start Quest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}