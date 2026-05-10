import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading your experience..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-[var(--primary)] mb-4"
      >
        <Loader2 size={48} strokeWidth={2.5} />
      </motion.div>
      <div className="space-y-1">
        <p className="text-[var(--dark)] font-black text-xl tracking-tight">{message}</p>
        <small className="text-[var(--gray-400)] font-bold uppercase tracking-widest text-[10px]">
          Please wait patiently while your screen is showing
        </small>
      </div>
    </div>
  );
};

export default Loader;
