"use client";
import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/common/BackButton";

export default function TutorialPage() {
  const steps = [
    { step: 1, title: "Game Start", description: "The game starts with a question that you need to answer." },
    { step: 2, title: "Critical Damage", description: "If you answer correctly, press the spacebar at the right time to deal critical damage to the boss. If you answer incorrectly, you will lose health." },
    { step: 3, title: "Guarding", description: "Press spacebar repeatedly to guard the boss from attacks." },
    { step: 4, title: "Gift Selection", description: "After defeating the boss, choose your gift and proceed to the next question." },
    { step: 5, title: "Game Over", description: "If your health drops to zero, you lose the game." }
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-11/12 lg:w-2/5 items-center justify-center">
        {/* Header */}
        <div className="flex justify-between items-center w-full p-2 lg:p-4">
            <BackButton href="/" />
            <h1 className="text-2xl font-bold mx-auto">Tutorial</h1>
        </div>

        {/* Tutorial Step */}
        <div className="flex flex-col justify-center w-full px-4 py-2 gap-2">
          <span className="font-bold">Step {steps[currentStep].step}: {steps[currentStep].title}</span>
          <p className="text-gray-700">{steps[currentStep].description}</p>
        </div>

        {/* Navigation */}
        <div className="w-full border-b border-gray-300"></div>
        <div className="w-full flex justify-between items-center px-4 py-2">
          <button
            className={`btn ${currentStep > 0 ? "btn-primary" : "btn-disabled opacity-50"}`}
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className={`btn ${currentStep < steps.length - 1 ? "btn-primary" : "btn-disabled opacity-50"}`}
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}