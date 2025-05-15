"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CameraIcon, Loader2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Quote } from "@/components/quote"

interface CameraProps {
  setCurrentMood: (mood: string) => void
}

export function Camera({ setCurrentMood }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [quote, setQuote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMobile()

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: "user",
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        setError(null)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please ensure you've granted camera permissions.")
    }
  }, [isMobile])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Could not get canvas context")
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data as base64 string
      const imageData = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageData)

      // Send to API for emotion detection
      const response = await fetch("/api/detect-emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to detect emotion")
      }

      const data = await response.json()

      if (!data.emotion) {
        throw new Error("No emotion detected in the response")
      }

      const detectedMood = data.emotion
      setMood(detectedMood)
      setCurrentMood(detectedMood)

      // Get quote based on mood
      try {
        const quoteResponse = await fetch(`/api/quotes?mood=${detectedMood}`)
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json()
          setQuote(quoteData.quote)
        }
      } catch (quoteErr) {
        console.error("Error fetching quote:", quoteErr)
        // Don't fail the whole process if quote fetching fails
      }

      // Save mood to history
      try {
        await fetch("/api/mood-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mood: detectedMood,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (historyErr) {
        console.error("Error saving mood history:", historyErr)
        // Don't fail the whole process if history saving fails
      }
    } catch (err) {
      console.error("Error capturing or processing image:", err)
      setError(err instanceof Error ? err.message : "Failed to process your image. Please try again.")
      setCapturedImage(null)
    } finally {
      setIsCapturing(false)
    }
  }, [setCurrentMood])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
    setMood(null)
    setQuote(null)
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mood Scanner</CardTitle>
        <CardDescription>Scan your face to detect your current mood and get a personalized quote</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 w-full">{error}</div>}

        <div className="relative w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isStreaming ? "block" : "hidden"}`}
              onCanPlay={() => videoRef.current?.play()}
            />
          ) : (
            <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
          )}

          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CameraIcon className="w-16 h-16 text-muted-foreground opacity-50" />
            </div>
          )}

          {isCapturing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {mood && (
          <div className="w-full mb-6">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Your Current Mood: <span className="text-primary">{mood}</span>
            </h3>
            {quote && <Quote text={quote} mood={mood} />}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {!isStreaming && !capturedImage ? (
          <Button onClick={startCamera}>
            <CameraIcon className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : capturedImage ? (
          <Button onClick={resetCapture} variant="outline">
            Try Again
          </Button>
        ) : (
          <Button onClick={captureImage} disabled={isCapturing}>
            {isCapturing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CameraIcon className="mr-2 h-4 w-4" />
                Capture Mood
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
