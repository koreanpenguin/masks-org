"use client";
import { useState } from "react";

const firstTimeSteps = [
  { step: "1", text: "Create a new repo on github.com — click + → New repository", command: null },
  { step: "2", text: 'Open the terminal in VS Code — press Ctrl + ` or go to Terminal → New Terminal', command: null },
  { step: "3", text: "Go to your project folder", command: "cd /Users/Haeon/Development/MasksOrg" },
  { step: "4", text: "Stage everything", command: "git add ." },
  { step: "5", text: "Make the first commit", command: 'git commit -m "first commit"' },
  { step: "6", text: "Connect to your GitHub repo (replace with your URL)", command: "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" },
  { step: "7", text: "Push for the first time", command: "git push -u origin main" },
  { step: "8", text: "Connect the repo to Vercel at vercel.com — it will auto-deploy from here on", command: null },
];

const updateSteps = [
  { step: "1", text: "Make your changes with Claude Code", command: null },
  { step: "2", text: 'Open the terminal in VS Code — press Ctrl + ` or go to Terminal → New Terminal', command: null },
  { step: "3", text: "Go to your project folder", command: "cd /Users/Haeon/Development/MasksOrg" },
  { step: "4", text: "Stage your changes", command: "git add ." },
  { step: "5", text: "Commit your changes", command: 'git commit -m "update site"' },
  { step: "6", text: "Push to GitHub", command: "git push" },
  { step: "7", text: "Vercel auto-detects the push and redeploys — done in ~1 minute", command: null },
];

function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-[#c17a5a]/10 hover:bg-[#c17a5a]/20 text-[#c17a5a] font-medium transition-colors duration-150"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StepList({ steps }: { steps: typeof updateSteps }) {
  return (
    <ol className="space-y-3">
      {steps.map(({ step, text, command }) => (
        <li key={step} className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#c17a5a] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {step}
          </span>
          <div className="flex-1 flex items-center gap-2 bg-[#f0e8dd] px-3 py-2 rounded-lg">
            {command ? (
              <code className="flex-1 text-sm text-[#2d2926] font-mono">{command}</code>
            ) : (
              <span className="flex-1 text-sm text-[#2d2926]">{text}</span>
            )}
            {command && <CopyButton command={command} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DeploySteps() {
  return (
    <div className="space-y-6">
      <section className="bg-[#fff8f5] border border-[#e8ddd0] rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">First Time Only</p>
        <h2 className="text-xl font-bold text-[#2d2926] mb-4">Setting Up GitHub & Vercel</h2>
        <StepList steps={firstTimeSteps} />
      </section>

      <section className="bg-[#fff8f5] border border-[#e8ddd0] rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">Every Time After</p>
        <h2 className="text-xl font-bold text-[#2d2926] mb-4">Updating the Website</h2>
        <StepList steps={updateSteps} />
      </section>
    </div>
  );
}
