"use client";

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface StepperContextType {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  isCompleted: boolean;
  setTotalSteps: (total: number) => void;
  direction: number;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) throw new Error("useStepper must be used within a StepperProvider or Stepper component");
  return context;
};

interface StepperProviderProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
}

export function StepperProvider({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
}: StepperProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [totalSteps, setTotalSteps] = useState(0);
  const [direction, setDirection] = useState(0);

  const isLastStep = currentStep === totalSteps;
  const isCompleted = currentStep > totalSteps;

  const goToStep = (step: number) => {
    if (step < 1 || step > totalSteps) return;
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    onStepChange(step);
  };

  const nextStep = () => {
    if (isLastStep) {
      setCurrentStep(totalSteps + 1);
      onFinalStepCompleted();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      onStepChange(currentStep - 1);
    }
  };

  const contextValue: StepperContextType = {
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    prevStep,
    isLastStep,
    isCompleted,
    setTotalSteps,
    direction
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
}

const PRIMARY_COLOR = "#E8550A"; // Saffron

export function StepperIndicators({ disableStepIndicators = false, renderStepIndicator, stepCircleContainerClassName = '' }: any) {
  const { currentStep, totalSteps, goToStep } = useStepper();
  const steps = Array.from({ length: totalSteps });

  return (
    <div className={`flex items-center justify-center mb-10 ${stepCircleContainerClassName}`}>
      {steps.map((_, index) => {
        const stepNumber = index + 1;
        const isStepCompleted = currentStep > stepNumber;
        const isStepActive = currentStep === stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            {renderStepIndicator ? (
              renderStepIndicator({
                step: stepNumber,
                currentStep,
                onStepClick: goToStep,
              })
            ) : (
              <StepIndicator
                step={stepNumber}
                isCompleted={isStepCompleted}
                isActive={isStepActive}
                onClick={() => !disableStepIndicators && goToStep(stepNumber)}
              />
            )}
            {stepNumber < totalSteps && (
              <StepConnector isCompleted={isStepCompleted} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function StepperContent({ children, contentClassName = '' }: any) {
  const { currentStep, isCompleted, direction, setTotalSteps } = useStepper();
  const steps = Children.toArray(children);
  
  useEffect(() => {
    setTotalSteps(steps.length);
  }, [steps.length, setTotalSteps]);

  return (
    <StepContentWrapper
      isCompleted={isCompleted}
      currentStep={currentStep}
      direction={direction}
      className={contentClassName}
    >
      {steps[currentStep - 1]}
    </StepContentWrapper>
  );
}

// Default export for backward compatibility
export default function Stepper({
  children,
  initialStep,
  onStepChange,
  onFinalStepCompleted,
  ...props
}: any) {
  return (
    <StepperProvider 
      initialStep={initialStep} 
      onStepChange={onStepChange} 
      onFinalStepCompleted={onFinalStepCompleted}
    >
      <StepperIndicators {...props} />
      <StepperContent {...props}>
        {children}
      </StepperContent>
    </StepperProvider>
  );
}

function StepIndicator({ step, isCompleted, isActive, onClick }: { 
  step: number; 
  isCompleted: boolean; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-300
        ${isCompleted ? 'bg-[var(--accent)] border-[var(--accent)]' : isActive ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-neutral-700 text-neutral-500'}
      `}
      style={{
        background: isCompleted ? PRIMARY_COLOR : 'transparent',
        borderColor: (isCompleted || isActive) ? PRIMARY_COLOR : undefined
      }}
    >
      {isCompleted ? <CheckIcon className="w-5 h-5 text-white" /> : <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{step}</span>}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -inset-1.5 border-2 rounded-full"
          style={{ borderColor: PRIMARY_COLOR, opacity: 0.5 }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}

function StepConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="flex-1 h-[2px] mx-4 bg-neutral-800 overflow-hidden min-w-[30px]">
      <motion.div
        className="h-full"
        style={{ background: PRIMARY_COLOR }}
        initial={{ width: '0%' }}
        animate={{ width: isCompleted ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className = '' }: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    position: 'absolute',
  }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
