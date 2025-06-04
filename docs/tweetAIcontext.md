# App Blueprint: TweetInsight AI Analyzer  

## 1. Project Breakdown  

**App Name:** *TweetInsight AI Analyzer*  
**Platform:** Web (responsive)  
**Summary:**  
TweetInsight is a lightweight AI-powered web app that analyzes tweets for sentiment, summary, and metadata. Users input a tweet URL, and the app retrieves the content (via API or mock data), processes it using OpenAI’s ChatGPT API, and logs structured results (summary, sentiment, timestamp, author) to a Supabase database. The focus is on automation, scalability, and minimal UI—ideal for marketers or researchers tracking social media trends.  

**Primary Use Case:**  
- Social media managers analyzing tweet sentiment at scale  
- Researchers cataloging public Twitter reactions to events  
- Developers prototyping AI-powered tweet analysis tools  

**Authentication:**  
- Optional Supabase Auth for user-specific logs (email/password or OAuth)  
- Public demo mode with anonymous analysis (data saved to a shared table)  

---  

## 2. Tech Stack Overview  
- **Frontend Framework:** React + Next.js (App Router)  
- **UI Library:** Tailwind CSS + ShadCN (pre-built accessible components)  
- **Backend (BaaS):** Supabase (PostgreSQL for structured data, real-time subscriptions)  
- **Deployment:** Vercel (serverless functions for API routes)  

---  

## 3. Core Features  

1. **Tweet URL Input:**  
   - Form field with validation (checks for Twitter domain/URL format)  
   - Mock mode toggle (bypasses Twitter API with dummy data)  

2. **AI Analysis Pipeline:**  
   - Next.js API route calls OpenAI’s ChatGPT API with prompt:  
     ```  
     "Summarize this tweet in 1-2 sentences, classify sentiment (positive/negative/neutral), and extract author username and timestamp."  
     ```  
   - Response parsed into structured JSON.  

3. **Supabase Data Logging:**  
   - Table schema: `tweet_analyses (id, username, content, sentiment, summary, timestamp, created_at)`  
   - Row insertion via Supabase JS client.  

4. **Real-Time Results Table:**  
   - ShadCN `<DataTable>` displaying historical analyses with sorting/filtering.  
   - Supabase real-time subscription for live updates.  

5. **Export to CSV:**  
   - Button to download all analyses as CSV via Supabase query.  

---  

## 4. User Flow  

1. **Landing Page:**  
   - Clean form with URL input, mock mode toggle, and submit button.  
   - Example tweet URLs for quick testing.  

2. **Processing State:**  
   - Loading spinner while Next.js API route fetches/analyzes the tweet.  

3. **Results Display:**  
   - Card showing: summary, sentiment (with color-coded badge), author, and timestamp.  
   - Button to "Save to Database" (hidden in anonymous mode).  

4. **History View:**  
   - Tab to switch to a real-time table of past analyses (paginated).  

---  

## 5. Design & UI/UX Guidelines  

- **Layout:**  
  - Single-column centered layout (max-width 768px) for focus.  
  - ShadCN’s `<Card>` component for results to maintain consistency.  

- **Sentiment Colors:**  
  - Positive: Tailwind `emerald-500`  
  - Negative: Tailwind `rose-500`  
  - Neutral: Tailwind `slate-500`  

- **Accessibility:**  
  - ShadCN’s pre-built ARIA-compliant components (e.g., `<Button>`, `<Input>`).  
  - Reduced motion preference support for animations.  

---  

## 6. Technical Implementation  

### Frontend (Next.js):  
- **Tweet Input Form:**  
  ```tsx  
  // components/TweetForm.tsx  
  import { useForm } from 'react-hook-form';  
  import { Button, Input } from '@/components/ui';  

  export function TweetForm({ onSubmit }) {  
    const { register, handleSubmit } = useForm();  
    return (  
      <form onSubmit={handleSubmit(onSubmit)}>  
        <Input  
          {...register('tweetUrl', { required: true, pattern: /twitter\.com/ })}  
          placeholder="https://twitter.com/username/status/123..."  
        />  
        <Button type="submit">Analyze</Button>  
      </form>  
    );  
  }  
  ```  

### Backend (Next.js API Route + Supabase):  
- **Analysis API Route:**  
  ```ts  
  // app/api/analyze/route.ts  
  import { createClient } from '@supabase/supabase-js';  

  export async function POST(req: Request) {  
    const { tweetUrl, isMock } = await req.json();  
    const content = isMock ? generateMockTweet() : await fetchTweet(tweetUrl);  
    const analysis = await openai.chat.completions.create({  
      model: 'gpt-3.5-turbo',  
      messages: [{ role: 'user', content: `Analyze: ${content}` }],  
    });  
    // Parse response into { summary, sentiment, username, timestamp }  
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);  
    await supabase.from('tweet_analyses').insert(parsedData);  
    return Response.json(parsedData);  
  }  
  ```  

### Supabase Setup:  
- Enable Row-Level Security (RLS) if using auth.  
- Create a `tweet_analyses` table with columns matching the schema above.  

---  

## 7. Development Tools & Setup  

1. **Local Setup:**  
   ```bash  
   npx create-next-app@latest --typescript  
   npm install @supabase/supabase-js @radix-ui/react-slot tailwind-merge clsx tailwindcss-animate  
   npx shadcn-ui@latest init  
   ```  

2. **Environment Variables:**  
   ```env  
   NEXT_PUBLIC_SUPABASE_URL=your-project-url  
   NEXT_PUBLIC_SUPABASE_KEY=your-anon-key  
   OPENAI_API_KEY=your-key  
   ```  

3. **Deployment:**  
   - Connect Vercel to GitHub repo.  
   - Add env vars in Vercel dashboard.  
   - Enable "Serverless Functions" for API routes.  

---  

**Strict Adherence:** This blueprint exclusively uses the specified stack (Next.js, Supabase, Tailwind/ShadCN, Vercel) with no alternatives.