import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowDown, 
  Cpu, 
  Zap, 
  Target, 
  Briefcase, 
  Layers, 
  Copy, 
  CheckCircle2, 
  RotateCcw,
  AlertTriangle,
  FileJson
} from 'lucide-react';
import clsx from 'clsx';
import { FormData, AutomationPlan } from './types';
import { cleanAndParseResponse, formatBlueprintForClipboard } from './utils';
import { SkeletonLoader } from './components/SkeletonLoader';

const INITIAL_FORM: FormData = {
  industry: '',
  role: '',
  manual_task: '',
  tools: '',
  trigger: '',
  goal: ''
};

// Updated API Endpoint
const API_ENDPOINT = 'N8N_LINK';

export default function App() {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [plan, setPlan] = useState<AutomationPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.manual_task || !formData.industry) {
      setError("Please fill in at least the Industry and Manual Task fields.");
      return;
    }

    setStep('loading');
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server Error (${response.status})`);
      }

      const rawText = await response.text();
      
      // Check for generic n8n "workflow started" message which indicates webhook isn't returning data
      if (rawText.includes("Workflow was started")) {
        throw new Error("The Consultant AI is thinking but didn't return the blueprint immediately. Please try again.");
      }

      const blueprint = cleanAndParseResponse(rawText);
      
      setPlan(blueprint);
      setStep('results');
    } catch (err: any) {
      console.error("Full Error Details:", err);
      let errorMessage = "Failed to generate blueprint.";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network Error: Could not reach the AI server. Please check your connection.";
      } else if (err.message.includes("JSON") || err.message.includes("parse")) {
        errorMessage = "The AI returned an invalid format. Please try submitting again.";
      } else if (err.message.includes("Workflow was started")) {
        errorMessage = err.message;
      } else if (err.message.includes("Server Error")) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStep('form');
    }
  };

  const handleCopy = () => {
    if (!plan) return;
    const text = formatBlueprintForClipboard(plan);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setPlan(null);
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl opacity-60" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-100/50 blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <Cpu className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              Automation Consultant
            </h1>
          </div>
          <p className="text-slate-500 max-w-lg mx-auto">
            {step === 'results' 
              ? "Here is your architectural blueprint for efficiency." 
              : "Describe your manual process, and our AI Architect will design the perfect automation workflow."}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Industry
                  </label>
                  <input
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g. Real Estate, E-commerce"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" /> Role
                  </label>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g. Property Manager"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-slate-400" /> Manual Task (The Problem)
                </label>
                <textarea
                  name="manual_task"
                  value={formData.manual_task}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the repetitive process you want to automate..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" /> Current Tools
                </label>
                <input
                  name="tools"
                  value={formData.tools}
                  onChange={handleInputChange}
                  placeholder="e.g. Gmail, Excel, Trello"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400" /> Trigger
                  </label>
                  <input
                    name="trigger"
                    value={formData.trigger}
                    onChange={handleInputChange}
                    placeholder="e.g. New email received"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" /> Desired Goal
                  </label>
                  <input
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="e.g. Create Trello card automatically"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Architect Solution
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader />
            </motion.div>
          )}

          {step === 'results' && plan && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Top Controls */}
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleReset}
                  className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> New Consultation
                </button>
                <button
                  onClick={handleCopy}
                  className={clsx(
                    "text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    copied ? "bg-green-100 text-green-700" : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                  )}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Blueprint"}
                </button>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    {plan.industry}
                  </span>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  {/* Pain Point */}
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-amber-900 font-semibold text-sm uppercase tracking-wide mb-1">Identified Friction</h3>
                      <p className="text-amber-800 text-sm md:text-base leading-relaxed">{plan.pain_point}</p>
                    </div>
                  </div>

                  {/* Solution */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{plan.solution_title}</h2>
                    <p className="text-slate-600 leading-relaxed">{plan.solution_description}</p>
                  </div>
                </div>
              </div>

              {/* Visual Workflow Graph */}
              <div className="relative">
                <div className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-0.5 bg-slate-200 z-0 hidden md:block" />
                <h3 className="relative z-10 text-center text-slate-400 font-medium text-sm uppercase tracking-widest mb-6 bg-slate-50 inline-block px-4 mx-auto w-full">
                  Workflow Architecture
                </h3>
                
                <div className="space-y-0">
                  {plan.workflow_steps.map((step, index) => (
                    <div key={index} className="relative z-10 flex flex-col items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-slate-900">{step.tool_name}</h4>
                              {step.action && (
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                  {step.action}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Connector Line (visible between items) */}
                      {index < plan.workflow_steps.length - 1 && (
                        <div className="h-10 w-0.5 bg-slate-300 my-1 flex items-center justify-center">
                           <div className="bg-slate-50 p-1 rounded-full text-slate-400">
                             <ArrowDown className="w-4 h-4" />
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Grid */}
              <div>
                <h3 className="text-center text-slate-400 font-medium text-sm uppercase tracking-widest mb-6">
                  Recommended Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plan.saas_stack.map((tech, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{tech.tool_name}</h4>
                        {tech.connection_type && (
                          <span className={clsx(
                            "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide",
                            tech.connection_type.toLowerCase().includes('native') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {tech.connection_type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-auto">{tech.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
