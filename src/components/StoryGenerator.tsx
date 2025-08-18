import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { MagicalButton } from '@/components/ui/magical-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wand2, Sparkles, BookOpen } from 'lucide-react'

const StoryGenerator = () => {
  const [context, setContext] = useState('')
  const [story, setStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateStory = async () => {
    if (!context.trim()) return
    
    setIsGenerating(true)
    
    // Simulate story generation - replace with actual AI integration later
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const sampleStory = `Once upon a time, in a land where ${context.toLowerCase()}, there lived a brave little fairy named Luna. She discovered that the magic of the forest was fading, and only through courage and kindness could she restore the enchantment to her beloved home.

As Luna ventured deeper into the mystical woods, she encountered talking animals who had lost their voices, flowers that had forgotten how to bloom, and streams that had stopped their gentle babbling. But Luna's heart was pure, and her determination unwavering.

With each act of kindness, each moment of bravery, the magic slowly began to return. The animals found their voices in songs of joy, the flowers burst into brilliant colors, and the streams danced once more with crystalline laughter.

And so, through the power of believing in magic and the strength found in ${context.toLowerCase()}, Luna saved her enchanted world, proving that the greatest magic of all comes from within our hearts.

The End.`
    
    setStory(sampleStory)
    setIsGenerating(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Story Input Section */}
      <Card className="backdrop-blur-sm bg-card/80 shadow-magical border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-foreground">
            <Wand2 className="w-6 h-6 text-primary" />
            Create Your Magical Story
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </CardTitle>
          <p className="text-muted-foreground">
            Share a context, and watch as we weave it into an enchanting fairy tale!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Story Context
            </label>
            <Textarea
              placeholder="Enter your story context here... (e.g., 'a young dragon learns to fly', 'a magical library where books come alive', 'a village where everyone has forgotten how to laugh')"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[120px] resize-none border-primary/30 focus:border-primary bg-background/50"
            />
          </div>
          <MagicalButton
            variant="magical"
            size="lg"
            onClick={generateStory}
            disabled={!context.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Weaving Your Tale...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Magical Story
              </>
            )}
          </MagicalButton>
        </CardContent>
      </Card>

      {/* Generated Story Display */}
      {story && (
        <Card className="backdrop-blur-sm bg-card/80 shadow-sparkle border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              Your Magical Tale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed font-serif">
                {story}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StoryGenerator