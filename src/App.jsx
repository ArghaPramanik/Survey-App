import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

const questions = [
  { id: 1, text: "How satisfied are you with our products?", type: "rating", max: 5 },
  { id: 2, text: "How fair are the prices compared to similar retailers?", type: "rating", max: 5 },
  { id: 3, text: "How satisfied are you with the value for money of your purchase?", type: "rating", max: 5 },
  { id: 4, text: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", max: 10 },
  { id: 5, text: "What could we do to improve our service?", type: "text" },
]

export default function SurveyApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [sessionId, setSessionId] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    setSessionId(uuidv4())
  }, [])

  useEffect(() => {
    let timer
    if (currentScreen === 'thanks') {
      timer = setTimeout(() => {
        setCurrentScreen('welcome')
        setAnswers({})
        setSessionId(uuidv4())
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [currentScreen])

  const startSurvey = () => {
    setCurrentScreen('survey')
    setCurrentQuestion(0)
  }

  const handleAnswer = (answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questions[currentQuestion].id]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowConfirmDialog(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const skipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowConfirmDialog(true)
    }
  }

  const submitSurvey = () => {
    const surveyData = {
      sessionId,
      answers,
      completed: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(`survey_${sessionId}`, JSON.stringify(surveyData))
    setCurrentScreen('thanks')
  }

  const renderQuestion = () => {
    const question = questions[currentQuestion]
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{question.text}</h2>
        {question.type === 'rating' ? (
          <div className="flex space-x-2">
            {[...Array(question.max)].map((_, i) => (
              <Button
                key={i}
                variant={answers[question.id] === i + 1 ? "default" : "outline"}
                className="w-10 h-10"
                onClick={() => handleAnswer(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        ) : (
          <Textarea
            placeholder="Type your answer here..."
            onChange={(e) => handleAnswer(e.target.value)}
            value={answers[question.id] || ''}
          />
        )}
      </div>
    )
  }

  if (currentScreen === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Survey</h1>
        <p className="text-xl mb-8">We value your feedback!</p>
        <Button onClick={startSurvey}>Start Survey</Button>
      </div>
    )
  }

  if (currentScreen === 'survey') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
          <div className="mb-4 text-right">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          {renderQuestion()}
          <div className="flex justify-between mt-8">
            <Button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</Button>
            <Button onClick={skipQuestion} variant="outline">Skip</Button>
            <Button onClick={nextQuestion}>
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Survey</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your survey responses?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submitSurvey}>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  if (currentScreen === 'thanks') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl mb-8">We appreciate your feedback.</p>
        <p className="text-lg">Returning to welcome screen in 5 seconds...</p>
      </div>
    )
  }
}