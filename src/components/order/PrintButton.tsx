"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-botanical-800 hover:bg-botanical-700 border border-botanical-700 text-ivory text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      <Printer className="w-4 h-4" />
      <span>Print Invoice Receipt</span>
    </button>
  );
}

