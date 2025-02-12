"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

function Motion({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
}

export default Motion;
