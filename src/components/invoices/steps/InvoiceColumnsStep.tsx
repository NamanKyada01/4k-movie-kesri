"use client";

import { InvoiceColumns, InvoiceColumn } from "@/types/invoice";
import { Plus, Trash2, ArrowUp, ArrowDown, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useStepper } from "@/components/ui/Stepper";

interface InvoiceColumnsStepProps {
  columns: InvoiceColumns;
  setColumns: (columns: InvoiceColumns) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InvoiceColumnsStep({ columns, setColumns, onNext, onBack }: InvoiceColumnsStepProps) {
  const { nextStep, prevStep } = useStepper();
  
  const handleUpdate = (id: string, field: keyof InvoiceColumn, value: any) => {
    setColumns(
      columns.map(col => col.id === id ? { ...col, [field]: value } : col)
    );
  };

  const moveUp = (index: number) => {
    if (index <= 1) return; // index 0 is description
    const newCols = [...columns];
    const temp = newCols[index];
    newCols[index] = newCols[index - 1];
    newCols[index - 1] = temp;
    setColumns(newCols);
  };

  const moveDown = (index: number) => {
    if (index === 0 || index >= columns.length - 1) return;
    const newCols = [...columns];
    const temp = newCols[index];
    newCols[index] = newCols[index + 1];
    newCols[index + 1] = temp;
    setColumns(newCols);
  };

  const addColumn = () => {
    const amountIndex = columns.findIndex(c => c.id === "amount");
    const newColumn: InvoiceColumn = {
      id: `custom_${Date.now()}`,
      label: "Custom Field",
      visible: true,
      isPermanent: false,
      isMovable: true
    };
    
    if (amountIndex !== -1) {
      const newCols = [...columns];
      newCols.splice(amountIndex, 0, newColumn);
      setColumns(newCols);
    } else {
      setColumns([...columns, newColumn]);
    }
    toast.success("Custom column added");
  };

  const deleteColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  return (
    <div className="animate-fade-up max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-4 text-gold bg-gold/5 px-8 py-3 rounded-full mb-10 border border-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
          <Building2 size={20} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Phase 02: Data Structure</span>
        </div>
        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-none text-white">Configure Columns</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">Fine-tune the horizontal data structure for your cinematic invoice table. Ensure every attribute is perfectly positioned.</p>
      </div>

      <div className="space-y-8">
        <div className="card !p-0 bg-black/40 border-white/5 overflow-hidden backdrop-blur-md shadow-3xl !rounded-[3rem]">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-6 px-12 py-8 bg-white/[0.03] border-b border-white/5">
            <div className="col-span-6 flex items-center gap-4">
               <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white/40">Field Designation</span>
            </div>
            <div className="col-span-2 text-center">
               <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white/40">Visibility</span>
            </div>
            <div className="col-span-4 text-center">
               <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white/40">Sequence Control</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {columns.map((col, index) => (
              <div 
                key={col.id} 
                className={`grid grid-cols-12 gap-6 px-12 py-12 items-center transition-all hover:bg-white/[0.02] group ${!col.visible ? 'opacity-40 grayscale-[0.5]' : ''}`}
              >
                {/* Column Label */}
                <div className="col-span-6">
                  <div className="relative group/input">
                    <input 
                      value={col.label} 
                      onChange={(e) => handleUpdate(col.id, "label", e.target.value)} 
                      placeholder={`Enter column label`}
                      className={`w-full bg-transparent border-none outline-none text-2xl font-black tracking-tighter transition-all placeholder:text-muted/10 ${
                        !col.isMovable ? "text-white/30 cursor-not-allowed" : "text-white group-hover/input:text-accent"
                      }`}
                      disabled={!col.isMovable}
                    />
                    {col.isMovable && (
                      <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(232,85,10,0.5)] transition-all group-hover/input:w-1/2"></div>
                    )}
                  </div>
                  <div className="text-[0.65rem] text-muted/30 font-black uppercase tracking-[0.25em] mt-3">
                    {col.isPermanent ? 'Core Logic Protocol' : 'Custom Defined Attribute'}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="col-span-2 flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={col.visible} 
                      onChange={(e) => handleUpdate(col.id, "visible", e.target.checked)} 
                      disabled={col.id === "description"}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-white"></div>
                  </label>
                </div>

                {/* Actions (Move/Delete) */}
                <div className="col-span-4 flex justify-center items-center gap-4">
                  <div className="flex bg-white/[0.03] p-2 rounded-2xl border border-white/5">
                    <button
                      type="button"
                      className="p-3 rounded-xl hover:bg-white/10 disabled:opacity-0 transition-all text-white/40 hover:text-white"
                      disabled={!col.isMovable || index <= 1}
                      onClick={() => moveUp(index)}
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-xl hover:bg-white/10 disabled:opacity-0 transition-all text-white/40 hover:text-white"
                      disabled={!col.isMovable || index === 0 || index >= columns.length - 1}
                      onClick={() => moveDown(index)}
                    >
                      <ArrowDown size={20} />
                    </button>
                  </div>
                  
                  {!col.isPermanent && (
                    <button
                      type="button"
                      className="p-4 rounded-2xl bg-error/5 text-error/30 hover:text-error hover:bg-error/10 transition-all shadow-lg"
                      onClick={() => deleteColumn(col.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Column Footer */}
          <div className="p-12 bg-white/[0.01] border-t border-white/5">
            <button 
              type="button" 
              onClick={addColumn} 
              className="group w-full flex items-center justify-center gap-6 py-8 border-2 border-dashed border-white/5 rounded-3xl text-muted/40 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-black uppercase tracking-[0.3em] text-[0.7rem]">Append Custom Service Field</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-8 pt-16 pb-20">
          <button 
            onClick={prevStep} 
            className="flex-1 btn btn-ghost !p-8 !rounded-[2rem] border-white/5 hover:bg-white/5 uppercase font-black tracking-widest text-xs"
          >
            Previous Stage
          </button>
          <button 
            onClick={() => { onNext(); nextStep(); }} 
            className="flex-[2] btn btn-primary !p-8 !rounded-[2rem] shadow-[0_20px_50px_rgba(232,85,10,0.2)] uppercase font-black tracking-widest text-xs"
          >
            Secure Studio Identity
          </button>
        </div>
      </div>
    </div>
  );
}
