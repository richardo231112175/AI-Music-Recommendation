'use server';

import { GoogleGenAI, Type, type GenerateContentConfig, type ContentListUnion, type GenerateContentResponse } from '@google/genai';
import { youtube_v3 } from '@googleapis/youtube';
import { type GaxiosPromise, type GaxiosResponse } from 'gaxios';

export type musicType = {
    title: string;
    artist: string;
    youtube_link?: string;
};

export async function sendPrompt(prompt: string): Promise<musicType[] | undefined> {
    const ai: GoogleGenAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const model: string = 'gemini-2.0-flash-001';
    const contents: ContentListUnion = getContents(prompt);
    const config: GenerateContentConfig = {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                },
                propertyOrdering: [ 'title', 'artist' ],
            },
        },
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({ model, contents, config });

        if (response.text) {
            const promptResults: musicType[] = await JSON.parse(response.text);
            const musics: musicType[] = await getYoutubeLinks(promptResults);
            return musics;
        }
    } catch {}
}

function getContents(prompt: string): ContentListUnion {
    return [
        {
            role: 'user',
            parts: [
                {
                    text: `
Give 5 music recommendations based on the following reference

Song like "someone like you"

Output should be provided in JSON format with title and artist
                    `,
                },
            ],
        },
        {
            role: 'model',
            parts: [
                {
                    text: `
Here's my thinking process to arrive at the recommendations:

1.  **Deconstruct the Request:**
    *   **Reference Song:** "Someone Like You" (by Adele)
    *   **Output Format:** JSON with "title" and "artist" keys.
    *   **Number of Recommendations:** 5

2.  **Analyze "Someone Like You":**
    *   **Artist:** Adele
    *   **Genre:** Soul, Pop, Ballad
    *   **Key Characteristics:**
        *   **Vocal Power:** Strong, emotive female vocals.
        *   **Instrumentation:** Primarily piano-driven, simple, allowing vocals to shine.
        *   **Lyrical Theme:** Heartbreak, loss, longing, reflection on a past relationship.
        *   **Tempo:** Slow, ballad.
        *   **Emotional Impact:** Sad, poignant, cathartic.
        *   **Structure:** Relatively traditional verse-chorus structure, often with a powerful bridge.

3.  **Brainstorming Strategy - How to find similar songs?**
    *   **Same Artist (but different song):** Are there other Adele songs with a similar vibe? Yes, many.
    *   **Similar Artists (Contemporaries):** Who else was making similar music around the same time or has a similar vocal style/genre? (e.g., Amy Winehouse, Duffy, Florence + The Machine, Birdy).
    *   **Similar Artists (Classic Influences):** Who might have influenced Adele or shares similar soul/blues roots? (e.g., Etta James, Aretha Franklin - though their overall sound might be too different for *this specific* request, it's good to consider).
    *   **Similar Instrumentation/Arrangement:** Piano ballads are a key.
    *   **Similar Lyrical Themes:** Songs about heartbreak and lost love.
    *   **Similar Vocal Style:** Powerful female vocalists.

4.  **Generating Potential Candidates (and filtering):**

    *   **Adele - "Hello":** Very similar. Piano, powerful vocals, emotional. *Keep.*
    *   **Adele - "Turning Tables":** Also very similar. Piano, emotional. *Keep as a backup if I need more Adele, but "Hello" is a stronger first pick from her.*
    *   **Adele - "Rolling in the Deep":** More uptempo, more band-driven. Less "Someone Like You." *Discard for this specific request.*

    *   **Birdy - "Skinny Love":** Piano cover, haunting female vocals, emotional, heartbreak. *Excellent match.*
    *   **Birdy - "People Help the People":** Similar vibe. *Good, but "Skinny Love" is closer.*

    *   **Florence + The Machine - "Never Let Me Go":** Powerful female vocals, emotional, builds. Instrumentation is a bit more complex than just piano, but the *feeling* is there. *Good candidate.*
    *   **Florence + The Machine - "Dog Days Are Over":** Too upbeat. *Discard.*

    *   **Amy Winehouse - "Back to Black":** Soulful, heartbreak, powerful vocals. More retro-soul than pure piano ballad, but the emotional core is similar. *Strong contender.*
    *   **Amy Winehouse - "Love Is a Losing Game":** Even closer in terms of ballad feel. *Very strong contender.*

    *   **Hozier - "Take Me To Church":** Male vocalist, but powerful, emotional, slightly similar themes of intense love/loss. Instrumentation is different. *Maybe, but prioritize female vocalists first.*

    *   **Sam Smith - "Stay With Me":** Male vocalist, gospel-influenced, emotional, ballad. *Similar vibe, good candidate.*
    *   **Sam Smith - "I'm Not The Only One":** Also good.

    *   **Christina Perri - "Jar of Hearts":** Piano-driven, female vocals, heartbreak. *Very strong match.*

    *   **Labrinth ft. Emeli Sandé - "Beneath Your Beautiful":** Duet, but Emeli's parts are very Adele-esque. Piano, emotional. *Good, but maybe a solo artist is better for direct comparison.*

    *   **Sia - "Chandelier":** Powerful female vocals, emotional, but more pop production and a different kind of despair. *Less direct match than others.*

5.  **Selecting the Top 5 (and ensuring variety where possible while staying true to the "Someone Like You" essence):**

    *   **"Hello" - Adele:** Almost a direct follow-up in feel. Essential.
    *   **"Skinny Love" - Birdy:** The piano, the raw emotion, the female vocal. Perfect.
    *   **"Jar of Hearts" - Christina Perri:** Again, piano, heartbreak, strong female vocal. Spot on.
    *   **"Stay With Me" - Sam Smith:** While male, the gospel-tinged soulful balladry and themes of longing are very close. Offers a slight variation.
    *   **"Love Is a Losing Game" - Amy Winehouse:** The quintessential modern soul heartbreak ballad. The raw emotion is palpable.

    *Self-correction/Refinement:*
    *   Are these distinct enough? Yes.
    *   Do they all capture the core essence of "Someone Like You"? Yes (powerful vocals, emotional depth, often piano-driven, themes of love/loss).
    *   Could I swap any? "Never Let Me Go" by Florence + The Machine is a strong alternative for Amy Winehouse or Sam Smith if I wanted *only* female vocalists or a slightly different instrumental texture, but the current selection feels very solid.

6.  **Formatting as JSON:**

    \`\`\`json
    [
    {
        "title": "Hello",
        "artist": "Adele"
    },
    {
        "title": "Skinny Love",
        "artist": "Birdy"
    },
    {
        "title": "Jar of Hearts",
        "artist": "Christina Perri"
    },
    {
        "title": "Stay With Me",
        "artist": "Sam Smith"
    },
    {
        "title": "Love Is a Losing Game",
        "artist": "Amy Winehouse"
    }
    ]
    \`\`\`

This systematic approach ensures all constraints are met and the recommendations are relevant and well-justified.
                    `,
                },
                {
                    text: `
\`\`\`json
[
    {
        "title": "Hello",
        "artist": "Adele"
    },
    {
        "title": "Skinny Love",
        "artist": "Birdy"
    },
    {
        "title": "Jar of Hearts",
        "artist": "Christina Perri"
    },
    {
        "title": "Stay With Me",
        "artist": "Sam Smith"
    },
    {
        "title": "All I Ask",
        "artist": "Adele"
    }
]
\`\`\`
                    `,
                },
            ],
        },
        {
            role: 'user',
            parts: [
                {
                    text: `
Give 5 music recommendations based on the following reference

${prompt}

Output should be provided in JSON format with title and artist
                    `,
                },
            ],
        },
    ];
}

async function getYoutubeLinks(musics: musicType[]): Promise<musicType[]> {
    try {
        const youtube: youtube_v3.Youtube = new youtube_v3.Youtube({
            auth: process.env.GOOGLE_API_KEY,
        });

        const searches: GaxiosPromise<youtube_v3.Schema$SearchListResponse>[] = musics.map((song) => youtube.search.list({
            part: [ 'snippet' ],
            q: `${song.title} by ${song.artist}`,
            type: [ 'video' ],
            maxResults: 1,
        }));

        const responses: GaxiosResponse<youtube_v3.Schema$SearchListResponse>[] = await Promise.all(searches);

        const result: musicType[] = responses.map((response, index) => {
            const video: youtube_v3.Schema$SearchResult | undefined = response.data.items?.[0];
            const videoId: string | null | undefined = video?.id?.videoId;

            return {
                ...musics[index],
                youtube_link: video?.id?.videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined,
            };
        });

        return result;
    } catch {
        return musics;
    }
}
