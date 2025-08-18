import React from 'react'
import StoryGenerator from '@/components/StoryGenerator'
import magicalForest from '@/assets/magical-forest.jpg'
import { Sparkles } from 'lucide-react'

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-enchanted relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${magicalForest})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-10 text-primary-glow animate-pulse w-6 h-6" />
        <Sparkles className="absolute top-32 right-20 text-accent animate-pulse w-4 h-4 animation-delay-1000" />
        <Sparkles className="absolute bottom-40 left-1/4 text-primary animate-pulse w-5 h-5 animation-delay-2000" />
        <Sparkles className="absolute bottom-20 right-1/3 text-secondary animate-pulse w-6 h-6 animation-delay-500" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-magical bg-clip-text text-transparent mb-4">
            Magical Stories
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where imagination meets enchantment. Share your context and let us craft a fairy tale that will transport you to worlds beyond your dreams.
          </p>
        </div>
        
        {/* Story Generator Component */}
        <StoryGenerator />
      </div>
    </div>
  )
}

export default Index