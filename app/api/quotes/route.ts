import { type NextRequest, NextResponse } from "next/server"

// Quotes organized by mood
const quotesByMood: Record<string, string[]> = {
  happy: [
    "Happiness is not something ready-made. It comes from your own actions.",
    "The most wasted of all days is one without laughter.",
    "Happiness is a warm puppy.",
    "The purpose of our lives is to be happy.",
    "Count your age by friends, not years. Count your life by smiles, not tears.",
  ],
  sad: [
    "Even the darkest night will end and the sun will rise.",
    "You're braver than you believe, stronger than you seem, and smarter than you think.",
    "In the middle of winter I at last discovered that there was in me an invincible summer.",
    "The pain you feel today is the strength you feel tomorrow.",
    "Rock bottom became the solid foundation on which I rebuilt my life.",
  ],
  angry: [
    "For every minute you remain angry, you give up sixty seconds of peace of mind.",
    "Speak when you are angry and you will make the best speech you will ever regret.",
    "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.",
    "When angry, count to ten before you speak. If very angry, count to one hundred.",
    "The greatest remedy for anger is delay.",
  ],
  fear: [
    "Fear is only as deep as the mind allows.",
    "Everything you want is on the other side of fear.",
    "The only thing we have to fear is fear itself.",
    "Fear is the main source of superstition, and one of the main sources of cruelty.",
    "Do the thing you fear and the death of fear is certain.",
  ],
  surprise: [
    "Life is full of surprises and serendipity.",
    "The moments of happiness we enjoy take us by surprise.",
    "Surprise is the greatest gift which life can grant us.",
    "The secret of happiness is not in doing what one likes, but in liking what one does.",
    "Each day holds a surprise.",
  ],
  neutral: [
    "Life isn't about finding yourself. Life is about creating yourself.",
    "The journey of a thousand miles begins with one step.",
    "The way to get started is to quit talking and begin doing.",
    "It does not matter how slowly you go as long as you do not stop.",
    "You are never too old to set another goal or to dream a new dream.",
  ],
}

// Default to neutral if mood not found
const getQuoteForMood = (mood: string): string => {
  const normalizedMood = mood.toLowerCase()

  // Map similar emotions to our categories
  const moodMap: Record<string, string> = {
    joy: "happy",
    disgust: "angry",
  }

  const mappedMood = moodMap[normalizedMood] || normalizedMood
  const quotes = quotesByMood[mappedMood] || quotesByMood.neutral

  return quotes[Math.floor(Math.random() * quotes.length)]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get("mood") || "neutral"

    // In a real app, you would fetch from a database
    // For this example, we'll use our predefined quotes
    const quote = getQuoteForMood(mood)

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Error fetching quote:", error)
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 })
  }
}
