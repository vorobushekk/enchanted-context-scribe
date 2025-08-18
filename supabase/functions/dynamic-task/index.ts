import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractContext(prompt: string): string | null {
  try {
    const m = prompt.match(/following context:\s*"([\s\S]*?)"/i) || prompt.match(/context:\s*"([\s\S]*?)"/i);
    return m?.[1]?.trim() || null;
  } catch {
    return null;
  }
}

function generateFallbackStory(ctx?: string) {
  const context = (ctx && ctx.length > 0 ? ctx : 'a brave dreamer on a wondrous quest');
  return (
    `Once upon a time, beneath skies brushed with lavender dawn, there lived ${context}. ` +
    `Their home lay at the edge of an ancient forest where moonlight silvered the leaves and fireflies stitched constellations between the trees. ` +
    `On the eve of the Star-Bloom, when every wish is said to borrow a pair of wings, our hero felt a stirring in their heart: a call to venture beyond the familiar path.\n\n` +

    `With a satchel of hope and a lantern trimmed with courage, they stepped into the whispering wood. ` +
    `There they met a fox with ember-bright eyes, a moth that wore twilight on its wings, and a brook that spoke in lullabies. ` +
    `“Keep kindness close,” hummed the brook, “for kindness is a compass when maps grow dim.”\n\n` +

    `The path soon forked: one way steep with shadow, the other glittering with easy answers. ` +
    `Remembering the brook’s song, our traveler chose the honest road, the one that asked for patience. ` +
    `At its end rose an enchanted clearing where stones pulsed with gentle light, and a quiet voice—perhaps the forest’s own—asked what dream should be woven.\n\n` +

    `“I seek wisdom,” they said, “and the strength to use it well.” ` +
    `From the canopy, a ribbon of starlight unfurled, showing moments of triumph and misstep—each a teacher dressed in different clothes. ` +
    `They learned that bravery is not the absence of fear, but the promise to walk kindly with it.\n\n` +

    `As dawn pressed gold upon the leaves, our hero returned home. ` +
    `The fox trotted at their heels, the moth kept soft watch, and the brook hummed a parting hymn. ` +
    `Though the world looked the same, the traveler’s gaze had grown—a lantern now lit from within.\n\n` +

    `And so the lesson settled like dew: wonder visits those who meet the day with gentleness, and even the smallest kindness can turn a path into a bridge. ` +
    `From that morning on, the village spoke of the traveler who carried starlight in their pocket, and whenever choices grew tangled, they shared the song of the brook: “Keep kindness close.” The end.`
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) throw new Error('Prompt is required');

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const context = extractContext(prompt) || undefined;

    if (!openAIApiKey) {
      // No key configured: graceful fallback
      const generatedText = generateFallbackStory(context);
      return new Response(JSON.stringify({ generatedText, fallback: true, reason: 'missing_api_key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating story with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: 'You are a master storyteller who creates enchanting, age-appropriate fairy tales with vivid imagery, dialogue, character growth, and meaningful lessons.' },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 900,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenAI API error:', text);
      // Attempt to parse error payload
      let code = '';
      try { code = JSON.parse(text)?.error?.code || ''; } catch { /* ignore */ }

      if (response.status === 429 || code === 'insufficient_quota') {
        const generatedText = generateFallbackStory(context);
        return new Response(JSON.stringify({ generatedText, fallback: true, reason: 'insufficient_quota' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText: string | undefined = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      const fallback = generateFallbackStory(context);
      return new Response(JSON.stringify({ generatedText: fallback, fallback: true, reason: 'empty_response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Story generated successfully');
    return new Response(JSON.stringify({ generatedText, fallback: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dynamic-task function:', error);
    const generatedText = generateFallbackStory();
    return new Response(JSON.stringify({ 
      generatedText,
      fallback: true,
      reason: 'unhandled_exception',
      error: error?.message ?? 'Failed to generate story'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});