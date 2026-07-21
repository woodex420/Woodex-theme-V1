import React, { useState, useCallback, useEffect } from 'react';
import {
  X,
  MousePointerClick,
  Type,
  Palette,
  FileText,
  Keyboard,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

interface BuilderGuideProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'woodex-builder-guide-seen';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <MousePointerClick size={40} />,
    title: 'Welcome to Woodex Live Builder',
    description:
      'Edit your website content in real-time. Click any text or image to start editing.',
  },
  {
    icon: <MousePointerClick size={40} />,
    title: 'Select Elements',
    description:
      'Click on any element to select it. The inspector panel will open on the right.',
  },
  {
    icon: <Type size={40} />,
    title: 'Inline Editing',
    description:
      'Double-click on any text to edit it directly on the page. Changes save automatically.',
  },
  {
    icon: <Palette size={40} />,
    title: 'Style Panel',
    description:
      'Use the Style tab in the inspector to change fonts, colors, spacing, borders, and more.',
  },
  {
    icon: <FileText size={40} />,
    title: 'Content Panel',
    description:
      'Use the Content tab to change text, images, links, and visibility.',
  },
  {
    icon: <Keyboard size={40} />,
    title: 'Keyboard Shortcuts',
    description:
      'Cmd+Shift+B: Toggle builder. Cmd+Z: Undo. Escape: Close panel.',
  },
  {
    icon: <Download size={40} />,
    title: 'Export & Save',
    description:
      'All changes save automatically to your browser. Export your settings as JSON to back them up.',
  },
];

export default function BuilderGuide({ open, onClose }: BuilderGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const totalSteps = steps.length;

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleClose = useCallback(() => {
    if (dontShowAgain) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
    setCurrentStep(0);
    onClose();
  }, [dontShowAgain, onClose]);

  // Reset step when opened fresh
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStep < totalSteps - 1) {
          goNext();
        } else {
          handleClose();
        }
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentStep, handleClose, goNext, goPrev, totalSteps]);

  if (!open) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full mx-4 rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[#111110] shadow-2xl"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close guide"
        >
          <X size={20} />
        </button>

        {/* Content area */}
        <div className="p-8 pb-6">
          {/* Step counter */}
          <div className="text-xs font-medium text-gray-500 mb-6 tracking-wider uppercase">
            Step {currentStep + 1} / {totalSteps}
          </div>

          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-[#C9A84C]/10 border border-[rgba(201,168,76,0.2)]">
            <div className="text-[#C9A84C]">{step.icon}</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-[#C9A84C] mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed text-[15px]">
            {step.description}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-[rgba(201,168,76,0.1)]" />

        {/* Navigation footer */}
        <div className="px-8 py-5">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`transition-all duration-200 rounded-full ${
                  i === currentStep
                    ? 'w-6 h-2 bg-[#C9A84C]'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Don't show again */}
          <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none group">
            <div
              className={`flex items-center justify-center w-4.5 h-4.5 rounded border transition-colors ${
                dontShowAgain
                  ? 'bg-[#C9A84C] border-[#C9A84C]'
                  : 'border-gray-600 group-hover:border-gray-500 bg-transparent'
              }`}
              style={{ width: '18px', height: '18px' }}
            >
              {dontShowAgain && <Check size={12} className="text-[#0A0A0A]" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              Don&apos;t show this again
            </span>
          </label>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            {!isFirstStep ? (
              <button
                onClick={goPrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[rgba(201,168,76,0.2)] text-gray-300 hover:text-white hover:border-[rgba(201,168,76,0.4)] hover:bg-white/5 transition-all text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={isLastStep ? handleClose : goNext}
              className="flex items-center gap-1.5 ml-auto px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#d4b355] transition-colors text-sm font-semibold"
            >
              {isLastStep ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
