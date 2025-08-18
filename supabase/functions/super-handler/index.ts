import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function extractContext(prompt: string): string | null {
  // Simple context extraction - look for key descriptive words
  const contextMatches = prompt.match(/(?:about|featuring|with|including)\s+([^.!?]+)/i);
  return contextMatches ? contextMatches[1].trim() : null;
}

function generateFallbackStory(ctx?: string): string {
  const contexts = {
    forest: "In the heart of an enchanted forest where ancient trees whispered secrets to the wind, lived a young fairy named Luna. Her wings shimmered with stardust, and her laughter could make flowers bloom instantly. One day, she discovered a hidden glade where time moved differently - what seemed like hours were merely minutes in the outside world.",
    ocean: "Beneath the crystal-blue waves of the Sapphire Sea, in a palace made of coral and pearls, lived Princess Marina. Unlike other mermaids, she could speak to all sea creatures and had the rare gift of controlling the tides. When mysterious storms began threatening the underwater kingdom, Marina set out on a quest to find the legendary Trident of Calm Waters.",
    castle: "High atop the Cloudy Mountains stood the magnificent Castle Stellaris, home to young Prince Cosmos who had the extraordinary ability to speak with stars. Each night, he would climb to the highest tower and listen to their ancient stories. When the stars began disappearing one by one, Prince Cosmos knew he had to embark on a celestial adventure to save them.",
    village: "In the quaint village of Willowbrook, where cobblestone streets wound between cozy cottages with thatched roofs, lived a baker's daughter named Hazel. She had a magical gift - everything she baked came to life at midnight. Her gingerbread men would dance, her bread loaves would sing, and her pies would tell jokes until dawn.",
    default: "Once upon a time, in a land where magic flowed like rivers and dreams took flight on butterfly wings, there lived a kind-hearted apprentice wizard named Sage. Though young and still learning, Sage possessed something rare - a heart so pure that even the most stubborn spells would bend to their will when cast with love and good intentions."
  };

  if (ctx) {
    const lowerCtx = ctx.toLowerCase();
    if (lowerCtx.includes('forest') || lowerCtx.includes('tree') || lowerCtx.includes('woods')) return contexts.forest;
    if (lowerCtx.includes('ocean') || lowerCtx.includes('sea') || lowerCtx.includes('mermaid')) return contexts.ocean;
    if (lowerCtx.includes('castle') || lowerCtx.includes('prince') || lowerCtx.includes('princess')) return contexts.castle;
    if (lowerCtx.includes('village') || lowerCtx.includes('town') || lowerCtx.includes('baker')) return contexts.village;
  }
  
  return contexts.default;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          error: 'Prompt is required',
          fallback: false 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.warn('OPENAI_API_KEY not found, using fallback story generation');
      const context = extractContext(prompt);
      const fallbackStory = generateFallbackStory(context);
      
      return new Response(
        JSON.stringify({ 
          story: fallbackStory,
          fallback: true,
          fallbackReason: 'No API key configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Making request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are a master storyteller who creates enchanting fairy tales. Your stories should be magical, whimsical, and suitable for all ages. Include vivid descriptions, memorable characters, and a satisfying conclusion with a positive message.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', response.status, response.statusText, errorData);
      
      // Handle specific error cases
      if (response.status === 429) {
        const context = extractContext(prompt);
        const fallbackStory = generateFallbackStory(context);
        
        return new Response(
          JSON.stringify({ 
            story: fallbackStory,
            fallback: true,
            fallbackReason: 'API rate limit exceeded'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (response.status === 401) {
        const context = extractContext(prompt);
        const fallbackStory = generateFallbackStory(context);
        
        return new Response(
          JSON.stringify({ 
            story: fallbackStory,
            fallback: true,
            fallbackReason: 'Invalid API key'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const context = extractContext(prompt);
      const fallbackStory = generateFallbackStory(context);
      
      return new Response(
        JSON.stringify({ 
          story: fallbackStory,
          fallback: true,
          fallbackReason: `API error: ${response.status}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Successfully received response from OpenAI');
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No story generated by AI');
    }

    const story = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        story,
        fallback: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in super-handler function:', error);
    
    // Try to extract context and provide fallback
    try {
      const body = await req.text();
      const { prompt } = JSON.parse(body);
      const context = extractContext(prompt);
      const fallbackStory = generateFallbackStory(context);
      
      return new Response(
        JSON.stringify({ 
          story: fallbackStory,
          fallback: true,
          fallbackReason: 'Unexpected error occurred'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return new Response(
        JSON.stringify({ 
          error: 'An unexpected error occurred',
          fallback: false 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }
});