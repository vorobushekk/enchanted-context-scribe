import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const getLanguageLabel = (lang: Language) => {
    return lang === 'en' ? 'EN' : 'РУ';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 transition-magical"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{getLanguageLabel(language)}</span>
    </Button>
  );
};