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
    
    try {
      const fairyTalePrompt = `You are a master storyteller who creates enchanting fairy tales. Your stories should be magical, whimsical, and suitable for all ages. Include vivid descriptions, memorable characters, and a satisfying conclusion with a positive message.

Create a fairy tale based on this context: "${context}"

The fairy tale should:
- Be appropriate for children
- Be around 250-300 words
- Include magical elements
- Have a positive message or moral
- Be engaging and imaginative
- Have a satisfying ending
- Start with a title in the format "**[A Title Related to Story]**"

Please write only the fairy tale text without any additional commentary.`

      const response = await fetch('https://ifpmhvxnqxzecdeeobjq.supabase.co/functions/v1/super-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fairyTalePrompt
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const data = await response.json()
      setStory(data.generatedText || data.response || 'A magical story was created, but it seems to have vanished into the enchanted mists!')
    } catch (error) {
      console.error('Error generating story:', error)
      setStory('Oops! The magic seems to be taking a little break. Please try again in a moment!')
    } finally {
      setIsGenerating(false)
    }
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