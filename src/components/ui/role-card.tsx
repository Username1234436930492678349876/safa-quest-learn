import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
  className?: string;
}

export function RoleCard({
  title,
  description,
  icon,
  gradient,
  onClick,
  className
}: RoleCardProps) {
  return (
    <Card className={cn(
      "quest-card group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-quest border-0 overflow-hidden",
      className
    )}>
      <div className={cn("h-2", gradient)} />
      
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 animate-smooth">
          {icon}
        </div>
        <CardTitle className="text-xl group-hover:text-primary animate-smooth">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <Button 
          onClick={onClick}
          className="w-full bg-gradient-quest border-0 hover:opacity-90 animate-smooth"
          size="lg"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}