import { type NextRequest, NextResponse } from "next/server"

// Simulated recommendations data
const recommendationsByMood: Record<
  string,
  {
    music: Array<{ id: number; type: "music"; title: string; description: string }>
    habits: Array<{ id: number; type: "habit"; title: string; description: string }>
    readings: Array<{ id: number; type: "reading"; title: string; description: string }>
  }
> = {
  happy: {
    music: [
      {
        id: 1,
        type: "music",
        title: "Upbeat Pop Playlist",
        description: "Keep the good vibes going with these uplifting pop tracks",
      },
      { id: 2, type: "music", title: "Feel Good Classics", description: "Timeless songs that will make you smile" },
      { id: 3, type: "music", title: "Happy Dance Mix", description: "Get moving with these energetic dance tracks" },
    ],
    habits: [
      {
        id: 1,
        type: "habit",
        title: "Share Your Joy",
        description: "Call a friend or family member and share your positive energy",
      },
      {
        id: 2,
        type: "habit",
        title: "Random Act of Kindness",
        description: "Do something nice for someone else to spread happiness",
      },
      {
        id: 3,
        type: "habit",
        title: "Gratitude Journal",
        description: "Write down three things you're grateful for today",
      },
    ],
    readings: [
      {
        id: 1,
        type: "reading",
        title: "The Happiness Project",
        description: "Gretchen Rubin's year-long experiment in happiness",
      },
      {
        id: 2,
        type: "reading",
        title: "Authentic Happiness",
        description: "Martin Seligman's guide to positive psychology",
      },
      {
        id: 3,
        type: "reading",
        title: "Flow",
        description: "Mihaly Csikszentmihalyi on finding joy in everyday activities",
      },
    ],
  },
  sad: {
    music: [
      {
        id: 1,
        type: "music",
        title: "Calming Acoustic Playlist",
        description: "Gentle acoustic songs to soothe your mind",
      },
      {
        id: 2,
        type: "music",
        title: "Uplifting Instrumentals",
        description: "Beautiful instrumental pieces to lift your spirits",
      },
      { id: 3, type: "music", title: "Nostalgic Favorites", description: "Songs that remind you of happier times" },
    ],
    habits: [
      {
        id: 1,
        type: "habit",
        title: "Mindful Walking",
        description: "Take a 15-minute walk outside and focus on your surroundings",
      },
      {
        id: 2,
        type: "habit",
        title: "Warm Beverage Ritual",
        description: "Make yourself a cup of tea or hot chocolate and savor it",
      },
      { id: 3, type: "habit", title: "Reach Out", description: "Text or call someone who makes you feel supported" },
    ],
    readings: [
      {
        id: 1,
        type: "reading",
        title: "Reasons to Stay Alive",
        description: "Matt Haig's memoir about overcoming depression",
      },
      {
        id: 2,
        type: "reading",
        title: "The Upward Spiral",
        description: "Neuroscientist Alex Korb on reversing the course of depression",
      },
      {
        id: 3,
        type: "reading",
        title: "When Things Fall Apart",
        description: "Pema Chödrön's wisdom for difficult times",
      },
    ],
  },
  angry: {
    music: [
      { id: 1, type: "music", title: "Calming Classical", description: "Soothing classical music to help you relax" },
      { id: 2, type: "music", title: "Nature Sounds", description: "Peaceful nature recordings to reduce stress" },
      { id: 3, type: "music", title: "Meditation Playlist", description: "Ambient tracks designed for mindfulness" },
    ],
    habits: [
      {
        id: 1,
        type: "habit",
        title: "Deep Breathing",
        description: "Practice 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8",
      },
      {
        id: 2,
        type: "habit",
        title: "Physical Release",
        description: "Go for a run or do some push-ups to release tension",
      },
      {
        id: 3,
        type: "habit",
        title: "Journaling",
        description: "Write down what's making you angry without censoring yourself",
      },
    ],
    readings: [
      { id: 1, type: "reading", title: "Anger", description: "Thich Nhat Hanh's guide to transforming anger" },
      {
        id: 2,
        type: "reading",
        title: "The Dance of Anger",
        description: "Harriet Lerner on changing patterns of anger",
      },
      {
        id: 3,
        type: "reading",
        title: "Nonviolent Communication",
        description: "Marshall Rosenberg's approach to compassionate communication",
      },
    ],
  },
  fear: {
    music: [
      {
        id: 1,
        type: "music",
        title: "Grounding Playlist",
        description: "Songs with steady rhythms to help you feel centered",
      },
      { id: 2, type: "music", title: "Comforting Favorites", description: "Familiar songs that make you feel safe" },
      { id: 3, type: "music", title: "Positive Affirmations", description: "Guided affirmations set to gentle music" },
    ],
    habits: [
      {
        id: 1,
        type: "habit",
        title: "5-4-3-2-1 Exercise",
        description: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste",
      },
      {
        id: 2,
        type: "habit",
        title: "Progressive Muscle Relaxation",
        description: "Tense and release each muscle group to reduce physical anxiety",
      },
      {
        id: 3,
        type: "habit",
        title: "Worry Time",
        description: "Schedule 15 minutes to worry, then put anxious thoughts aside until then",
      },
    ],
    readings: [
      {
        id: 1,
        type: "reading",
        title: "Feel the Fear and Do It Anyway",
        description: "Susan Jeffers on moving past fear",
      },
      {
        id: 2,
        type: "reading",
        title: "The Anxiety and Phobia Workbook",
        description: "Edmund Bourne's practical exercises for anxiety",
      },
      { id: 3, type: "reading", title: "Dare", description: "Barry McDonagh's approach to overcoming anxiety" },
    ],
  },
  surprise: {
    music: [
      {
        id: 1,
        type: "music",
        title: "New Discoveries Playlist",
        description: "Fresh music from genres you don't usually explore",
      },
      {
        id: 2,
        type: "music",
        title: "World Music Collection",
        description: "Exciting sounds from different cultures around the world",
      },
      {
        id: 3,
        type: "music",
        title: "Instrumental Covers",
        description: "Familiar songs reimagined in surprising new ways",
      },
    ],
    habits: [
      {
        id: 1,
        type: "habit",
        title: "Try Something New",
        description: "Do one thing today that you've never done before",
      },
      {
        id: 2,
        type: "habit",
        title: "Creative Expression",
        description: "Spend 15 minutes drawing, writing, or making something",
      },
      {
        id: 3,
        type: "habit",
        title: "Change Your Routine",
        description: "Take a different route home or rearrange your workspace",
      },
    ],
    readings: [
      { id: 1, type: "reading", title: "Big Magic", description: "Elizabeth Gilbert on living a creative life" },
      {
        id: 2,
        type: "reading",
        title: "Stumbling on Happiness",
        description: "Daniel Gilbert on how we predict (often incorrectly) what will make us happy",
      },
      {
        id: 3,
        type: "reading",
        title: "The Power of Moments",
        description: "Chip and Dan Heath on creating memorable experiences",
      },
    ],
  },
  neutral: {
    music: [
      { id: 1, type: "music", title: "Focus Playlist", description: "Instrumental tracks to help you concentrate" },
      { id: 2, type: "music", title: "Mood Boosters", description: "Uplifting songs to enhance your mood" },
      { id: 3, type: "music", title: "Relaxation Mix", description: "Calming music to help you unwind" },
    ],
    habits: [
      { id: 1, type: "habit", title: "Mindfulness Meditation", description: "Spend 5 minutes focusing on your breath" },
      { id: 2, type: "habit", title: "Digital Detox", description: "Take a 30-minute break from screens" },
      {
        id: 3,
        type: "habit",
        title: "Nature Connection",
        description: "Spend time outdoors observing plants or wildlife",
      },
    ],
    readings: [
      {
        id: 1,
        type: "reading",
        title: "Atomic Habits",
        description: "James Clear on tiny changes that lead to remarkable results",
      },
      {
        id: 2,
        type: "reading",
        title: "The Power of Now",
        description: "Eckhart Tolle on living in the present moment",
      },
      {
        id: 3,
        type: "reading",
        title: "Digital Minimalism",
        description: "Cal Newport on focused living in a noisy world",
      },
    ],
  },
}

// Default to neutral if mood not found
const getRecommendationsForMood = (mood: string) => {
  const normalizedMood = mood.toLowerCase()

  // Map similar emotions to our categories
  const moodMap: Record<string, string> = {
    joy: "happy",
    disgust: "angry",
  }

  const mappedMood = moodMap[normalizedMood] || normalizedMood
  return recommendationsByMood[mappedMood] || recommendationsByMood.neutral
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get("mood") || "neutral"

    // In a real app, you would fetch from a database
    // For this example, we'll use our predefined recommendations
    const recommendations = getRecommendationsForMood(mood)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
