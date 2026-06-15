import { useState } from 'react';
import { AssessmentAnswers } from '../types';
import { ArrowLeft, Car, Zap, Utensils, ShoppingBag, MoveRight } from 'lucide-react';

const steps = [
  { key: 'travelDistance', icon: Car, label: 'Daily Travel', color: 'bg-blue-50 text-blue-600' },
  { key: 'vehicleType', icon: Car, label: 'Vehicle Type', color: 'bg-purple-50 text-purple-600' },
  { key: 'electricityBill', icon: Zap, label: 'Electricity', color: 'bg-yellow-50 text-yellow-600' },
  { key: 'foodPreference', icon: Utensils, label: 'Food', color: 'bg-orange-50 text-orange-600' },
  { key: 'shoppingFrequency', icon: ShoppingBag, label: 'Shopping', color: 'bg-pink-50 text-pink-600' },
];

export default function AssessmentPage({
  onComplete,
  setPage,
}: {
  onComplete: (answers: AssessmentAnswers) => void;
  setPage: (p: string) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({});


  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers as AssessmentAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const VALID_VEHICLE_TYPES = ['walk', 'cycle', 'public', 'auto', 'bike', 'car_petrol', 'car_diesel', 'car_ev'];
  const VALID_FOOD_PREFS = ['vegan', 'veg', 'omnivore', 'non_veg'];
  const VALID_SHOPPING_FREQ = ['rare', 'monthly', 'weekly', 'daily'];

  const updateAnswer = (key: string, value: string | number) => {
    if (key === 'travelDistance') {
      value = Math.max(0, Math.min(50, Math.round(Number(value) || 0)));
    } else if (key === 'electricityBill') {
      value = Math.max(500, Math.min(10000, Math.round(Number(value) || 500)));
    } else if (key === 'vehicleType' && !VALID_VEHICLE_TYPES.includes(value as string)) {
      return;
    } else if (key === 'foodPreference' && !VALID_FOOD_PREFS.includes(value as string)) {
      return;
    } else if (key === 'shoppingFrequency' && !VALID_SHOPPING_FREQ.includes(value as string)) {
      return;
    }
    setAnswers({ ...answers, [key]: value });
  };

  const isCurrentStepValid = () => {
    const stepKey = current.key;
    return !!answers[stepKey as keyof AssessmentAnswers];
  };

  const renderStepContent = () => {
    switch (current.key) {
      case 'travelDistance':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">How far do you travel daily? (one way, in km)</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={answers.travelDistance || 0}
                onChange={(e) => updateAnswer('travelDistance', Number(e.target.value))}
                className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <span className="text-2xl font-bold text-gray-900 min-w-[4rem] text-center">
                {answers.travelDistance || 0} km
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 km (Home)</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
              💡 Think of your daily commute — home to work/school and back.
            </p>
          </div>
        );

      case 'vehicleType':
        const vehicles = [
          { value: 'walk', label: 'Walking', emoji: '🚶', desc: 'Zero emissions!' },
          { value: 'cycle', label: 'Cycling', emoji: '🚴', desc: 'Zero emissions!' },
          { value: 'public', label: 'Bus / Train', emoji: '🚌', desc: 'Public transport' },
          { value: 'auto', label: 'Auto / Taxi', emoji: '🛺', desc: 'Shared ride' },
          { value: 'bike', label: 'Motorbike', emoji: '🏍️', desc: 'Two wheeler' },
          { value: 'car_petrol', label: 'Petrol Car', emoji: '🚗', desc: 'Petrol vehicle' },
          { value: 'car_diesel', label: 'Diesel Car', emoji: '🚙', desc: 'Diesel vehicle' },
          { value: 'car_ev', label: 'Electric Car', emoji: '⚡', desc: 'EV vehicle' },
        ];
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">What vehicle do you use most often?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vehicles.map((v) => (
                <button
                  key={v.value}
                  onClick={() => updateAnswer('vehicleType', v.value)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    answers.vehicleType === v.value
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/10 scale-105'
                      : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{v.emoji}</div>
                  <div className="text-sm font-semibold text-gray-900">{v.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'electricityBill':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">What is your monthly electricity bill? (₹)</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={answers.electricityBill || 2000}
                onChange={(e) => updateAnswer('electricityBill', Number(e.target.value))}
                className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <span className="text-2xl font-bold text-gray-900 min-w-[6rem] text-center">
                ₹{answers.electricityBill || 2000}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
            </div>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
              💡 Check your last electricity bill. The average Indian household pays ~₹2,000/month.
            </p>
          </div>
        );

      case 'foodPreference':
        const foods = [
          { value: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products' },
          { value: 'veg', label: 'Vegetarian', emoji: '🥛', desc: 'Dairy & eggs OK' },
          { value: 'omnivore', label: 'Omnivore', emoji: '🍽️', desc: 'Eat everything' },
          { value: 'non_veg', label: 'Non-Veg', emoji: '🍗', desc: 'Mostly non-vegetarian' },
        ];
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">What is your food preference?</p>
            <div className="grid grid-cols-2 gap-3">
              {foods.map((f) => (
                <button
                  key={f.value}
                  onClick={() => updateAnswer('foodPreference', f.value)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
                    answers.foodPreference === f.value
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/10 scale-105'
                      : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{f.emoji}</div>
                  <div className="text-base font-semibold text-gray-900">{f.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'shoppingFrequency':
        const shopping = [
          { value: 'rare', label: 'Rarely', emoji: '🏠', desc: 'Once in a while', impact: 'Low' },
          { value: 'monthly', label: 'Monthly', emoji: '📅', desc: 'Once a month', impact: 'Medium' },
          { value: 'weekly', label: 'Weekly', emoji: '🛒', desc: 'Every week', impact: 'High' },
          { value: 'daily', label: 'Daily', emoji: '🔥', desc: 'Almost daily', impact: 'Very High' },
        ];
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">How often do you shop (clothes, gadgets, etc.)?</p>
            <div className="grid grid-cols-2 gap-3">
              {shopping.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateAnswer('shoppingFrequency', s.value)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
                    answers.shoppingFrequency === s.value
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/10 scale-105'
                      : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{s.emoji}</div>
                  <div className="text-base font-semibold text-gray-900">{s.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                  <div className={`text-xs font-bold mt-2 ${
                    s.impact === 'Low' ? 'text-green-600' :
                    s.impact === 'Medium' ? 'text-yellow-600' :
                    s.impact === 'High' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {s.impact} Impact
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => setPage('home')}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Quick Assessment
          </h1>
          <p className="text-gray-600 mt-2">5 questions to understand your carbon footprint</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i < currentStep
                      ? 'bg-green-500 text-white'
                      : i === currentStep
                      ? 'bg-green-500 text-white ring-4 ring-green-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < currentStep ? (
                    <span className="text-sm font-bold">✓</span>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs mt-2 font-medium hidden sm:block ${
                  i <= currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < 4 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 mb-6 sm:mb-5 transition-colors duration-300 ${
                  i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div
          key={currentStep}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${current.color}`}>
              <current.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{current.label}</h2>
              <p className="text-sm text-gray-500">Question {currentStep + 1} of 5</p>
            </div>
          </div>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all ${
              isCurrentStepValid()
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25 hover:shadow-green-600/40'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {currentStep === 4 ? 'See Results' : 'Continue'}
            <MoveRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
