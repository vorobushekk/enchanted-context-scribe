import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { MagicalButton } from '@/components/ui/magical-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wand2, Sparkles, BookOpen, Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const StoryGenerator = () => {
  const [context, setContext] = useState('')
  const [story, setStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

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
      const storyText = data.generatedText || data.response || 'A magical story was created, but it seems to have vanished into the enchanted mists!'
      setStory(storyText + '\n\n✨ End of the story ✨')
    } catch (error) {
      console.error('Error generating story:', error)
      setStory('Oops! The magic seems to be taking a little break. Please try again in a moment!')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyStory = async () => {
    try {
      await navigator.clipboard.writeText(story)
      setIsCopied(true)
      toast({
        title: "Story copied!",
        description: "The magical tale has been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the story. Please try again.",
        variant: "destructive",
      })
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
            <CardTitle className="flex items-center justify-between text-xl text-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Your Magical Tale
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyStory}
                className="flex items-center gap-2 hover:bg-accent/50"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Story
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed font-storybook text-lg">
                {story.split('\n').map((line, index) => {
                  // Check if line starts and ends with **
                  const titleMatch = line.match(/^\*\*(.*)\*\*$/);
                  if (titleMatch) {
                    return (
                      <div key={index} className="text-center font-magical font-semibold text-xl text-primary mb-4 mt-2">
                        ✨ {titleMatch[1]} ✨
                      </div>
                    );
                  }
                  // Check if it's the "End of the story" line
                  if (line.includes('✨ End of the story ✨')) {
                    return (
                      <div key={index} className="text-center font-magical font-semibold text-lg text-primary mt-6">
                        {line}
                      </div>
                    );
                  }
                  // Return regular text lines
                  return line ? (
                    <div key={index} className="mb-2">
                      {line}
                    </div>
                  ) : (
                    <div key={index} className="mb-2"></div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StoryGenerator