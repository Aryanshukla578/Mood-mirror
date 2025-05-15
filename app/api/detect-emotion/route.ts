import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Instead of writing to a file and simulating DeepFace with file operations,
    // we'll directly simulate the emotion detection result

    // Generate a random emotion (simulating DeepFace analysis)
    const emotions = ["happy", "sad", "angry", "neutral", "surprise", "fear"]
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]

    // Add a small delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ emotion: randomEmotion })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
