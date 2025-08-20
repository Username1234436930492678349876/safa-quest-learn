import * as React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  currentLanguage: 'en' | 'ar';
  onLanguageChange: (language: 'en' | 'ar') => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en')}
      className="gap-2 animate-smooth hover:bg-primary/10"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
}