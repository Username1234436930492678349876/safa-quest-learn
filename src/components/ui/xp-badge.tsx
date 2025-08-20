import * as React from "react";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPBadgeProps {
  xp: number;
  level?: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2"
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4", 
  lg: "h-5 w-5"
};

export function XPBadge({ 
  xp, 
  level, 
  showAnimation = false, 
  size = 'md',
  className 
}: XPBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 bg-gradient-achievement text-secondary-foreground rounded-full font-medium shadow-achievement",
      sizeClasses[size],
      showAnimation && "animate-bounce-in",
      className
    )}>
      {showAnimation ? (
        <Sparkles className={cn(iconSizes[size], "animate-pulse")} />
      ) : (
        <Star className={iconSizes[size]} />
      )}
      
      <span>{xp.toLocaleString()} XP</span>
      
      {level && (
        <>
          <div className="w-px h-4 bg-secondary-foreground/30" />
          <span>Lv.{level}</span>
        </>
      )}
    </div>
  );
}