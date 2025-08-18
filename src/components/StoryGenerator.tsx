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
      const fairyTalePrompt = `You are an enchanted storyteller from the realm of wonder, gifted with the ability to weave magical tales that transport readers to extraordinary worlds. Create a captivating fairy tale that beautifully incorporates this context: "${context}"

Craft your story following these magical guidelines:

**Story Structure:**
- Begin with a compelling opening that immediately draws readers into a magical world
- Develop the story through exciting adventures, challenges, and discoveries
- Conclude with a heartwarming resolution that brings joy and wisdom

**Fairy Tale Elements:**
- Include enchanted settings (mystical forests, sparkling castles, hidden valleys, magical kingdoms)
- Feature magical creatures or beings (fairies, talking animals, wise wizards, friendly dragons, etc.)
- Incorporate magical objects or powers that drive the story forward
- Weave in a meaningful life lesson about friendship, courage, kindness, or believing in oneself

**Writing Style:**
- Use rich, descriptive language that paints vivid pictures in readers' minds
- Include engaging dialogue that brings characters to life
- Create memorable characters with distinct personalities and motivations
- Build emotional connections between characters and readers
- Maintain a sense of wonder and possibility throughout

**Story Requirements:**
- Length: 500-700 words for a complete, satisfying tale
- Tone: Warm, optimistic, and magical while being age-appropriate for all readers
- The provided context should be the central focus or catalyst of the story
- Include moments of gentle conflict or challenge that are resolved through positive means
- End with a satisfying conclusion that ties all story elements together

Remember: This tale should sparkle with imagination, warm the heart, and leave readers feeling inspired and enchanted. Let the magic flow through every word!`

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