import { type NextRequest, NextResponse } from "next/server"

// Simulated mood history data
const moodHistory: Array<{
  id: number
  mood: string
  timestamp: string
}> = [
  {
    id: 1,
    mood: "happy",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: 2,
    mood: "neutral",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 3,
    mood: "sad",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: 4,
    mood: "angry",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 5,
    mood: "surprise",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 6,
    mood: "happy",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latest = searchParams.get("latest") === "true"

    // In a real app, you would fetch from a database
    // For this example, we'll use our simulated data

    if (latest) {
      // Return only the latest mood entry
      const sortedHistory = [...moodHistory].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )

      if (sortedHistory.length > 0) {
        return NextResponse.json(sortedHistory[0])
      } else {
        return NextResponse.json({ mood: "neutral" })
      }
    }

    // Return all mood history
    return NextResponse.json(moodHistory)
  } catch (error) {
    console.error("Error fetching mood history:", error)
    return NextResponse.json({ error: "Failed to fetch mood history" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mood, timestamp } = await request.json()

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    // In a real app, you would save to a database
    // For this example, we'll add to our simulated data
    const newEntry = {
      id: moodHistory.length + 1,
      mood,
      timestamp: timestamp || new Date().toISOString(),
    }

    moodHistory.push(newEntry)

    return NextResponse.json(newEntry)
  } catch (error) {
    console.error("Error saving mood:", error)
    return NextResponse.json({ error: "Failed to save mood" }, { status: 500 })
  }
}
