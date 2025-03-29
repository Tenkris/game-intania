import { createContext, useContext, useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { LevelWithQuestions } from "@/types/level"
import { Question, QuestionType } from "@/types/question"

interface HistoryAccordianProps {
    onClick: () => void,
    isActive: boolean,
    data: LevelWithQuestions,
}

export default function HistoryAccordian({ isActive, onClick, data, ...props }: HistoryAccordianProps) {
  return (
    <div className="border-b border-slate-200">
      <button onClick={onClick} className="w-full flex justify-between items-center py-5 ">
        <div className="font-bold">Level {data.level} <span className="text-xs font-normal">({data.question_ids.length} questions)</span></div>
        <span className="text-slate-800 transition-all duration-300">
          {isActive ? <ChevronDown className="rotate-180" /> : <ChevronDown />}
        </span>
      </button>
      <div className={"transition-all overflow-hidden duration-300 ease-in-out" + (isActive ? "  max-h-fit opacity-100" : " max-h-0 opacity-0")}>
        {
          data.questions.map((question, index) => (
            <HistoryAccordianQuestion key={index} data={question} />
          ))
        }
      </div>
    </div>
  )
}

function HistoryAccordianQuestion({ data }: { data: Question }) {

  return (
    <div className="flex flex-col gap-2 p-4 border-b border-slate-200">
      <span className="font-bold">{data.question}</span>
      <span className="text-xs text-slate-500">{(data.type === QuestionType.MULTIPLE_CHOICE) ? "Multiple Choice Question" : "Short Answer Question"}</span>
      {
        data.type === QuestionType.MULTIPLE_CHOICE ? (
          <div className="flex flex-col gap-2">
            {
              data.answer.split(",")[1].split("|").map((choice, index) => (
                <QuestionChoice key={index} choice={choice} isCorrect={data.answer.split(",")[0] === choice} />
              ))
            }
          </div>
        ) : (
          <div>
            <span className="text-sm ">Correct Answer: </span>
            <span className="text-sm ">{data.answer}</span>
          </div>
        )
      }
    </div>
  )
}

function QuestionChoice({ choice, isCorrect }: { choice: string, isCorrect: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-md ${isCorrect ? "bg-green-200" : "bg-red-200"}`}>
      <span className={`w-4 h-4 rounded-full ${isCorrect ? "bg-green-800" : "bg-red-800"}`}></span>
      <span className={`text-sm ${isCorrect ? "text-green-800" : "text-red-800"}`}>{choice}</span>
    </div>
  )
}