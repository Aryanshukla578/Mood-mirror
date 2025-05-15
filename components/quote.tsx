import { Card, CardContent } from "@/components/ui/card"

interface QuoteProps {
  text: string
  mood: string
}

export function Quote({ text, mood }: QuoteProps) {
  // Different background colors based on mood
  const getBgColor = () => {
    switch (mood.toLowerCase()) {
      case "happy":
      case "joy":
        return "bg-yellow-50 border-yellow-200"
      case "sad":
        return "bg-blue-50 border-blue-200"
      case "angry":
        return "bg-red-50 border-red-200"
      case "fear":
        return "bg-purple-50 border-purple-200"
      case "surprise":
        return "bg-green-50 border-green-200"
      case "neutral":
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className={`${getBgColor()} border shadow-sm`}>
      <CardContent className="p-4">
        <blockquote className="italic text-center">"{text}"</blockquote>
      </CardContent>
    </Card>
  )
}
