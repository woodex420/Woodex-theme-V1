// QA Panel - Runs all automated tests and shows results

import { useState } from "react";
import { PageHeader, Button, EmptyState } from "./AdminLayout";
import { runQATests, type TestSuite, type TestResult } from "../../lib/qaTest";
import { IconCheck, IconClose, IconArrowRight, IconEye } from "../Icons";
import { cn } from "../../utils/cn";

export function QAPanel() {
  const [suite, setSuite] = useState<TestSuite | null>(null);
  const [running, setRunning] = useState(false);
  const [showPassed, setShowPassed] = useState(true);
  const [showFailed, setShowFailed] = useState(true);

  const runTests = async () => {
    setRunning(true);
    try {
      const result = await runQATests();
      setSuite(result);
    } catch (e) {
      console.error("QA test run failed:", e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="QA Test Suite"
        description="Automated tests for the entire platform - auth, builder, persistence, admin, and integrations."
        action={
          <div className="flex gap-2">
            <Button onClick={runTests} variant="primary" disabled={running}>
              {running ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-espresso border-t-transparent animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <IconArrowRight className="w-3.5 h-3.5" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        }
      />

      {!suite && !running && (
        <EmptyState
          title="No tests run yet"
          message="Click 'Run All Tests' to verify the entire platform. Tests cover auth, builder state, persistence, API endpoints, and integrations."
        />
      )}

      {suite && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-5">
              <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Total Tests</div>
              <div className="font-serif text-3xl text-heading">{suite.total}</div>
            </div>
            <div className="card p-5 bg-emerald-50/50">
              <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-1">Passed</div>
              <div className="font-serif text-3xl text-emerald-700">{suite.passed}</div>
            </div>
            <div className={cn("card p-5", suite.failed > 0 ? "bg-red-50/50" : "")}>
              <div className={cn("text-[10px] uppercase tracking-widest font-semibold mb-1", suite.failed > 0 ? "text-red-700" : "text-text-gray")}>
                Failed
              </div>
              <div className={cn("font-serif text-3xl", suite.failed > 0 ? "text-red-700" : "text-heading")}>
                {suite.failed}
              </div>
            </div>
            <div className="card p-5">
              <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Duration</div>
              <div className="font-serif text-3xl text-heading">{suite.duration}<span className="text-sm text-text-gray ml-1">ms</span></div>
            </div>
          </div>

          {/* Filter toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-text-gray font-bold">Filter:</span>
            <button
              onClick={() => setShowPassed(!showPassed)}
              className={cn("px-3 py-1 text-xs rounded border transition-colors",
                showPassed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-text-gray border-stone-200"
              )}
            >
              ✓ Passed ({suite.results.filter((r) => r.passed).length})
            </button>
            <button
              onClick={() => setShowFailed(!showFailed)}
              className={cn("px-3 py-1 text-xs rounded border transition-colors",
                showFailed ? "bg-red-50 text-red-700 border-red-200" : "bg-stone-50 text-text-gray border-stone-200"
              )}
            >
              ✗ Failed ({suite.results.filter((r) => !r.passed).length})
            </button>
            <span className="text-[10px] text-text-gray ml-auto">
              {new Date(suite.timestamp).toLocaleString()}
            </span>
          </div>

          {/* Results list */}
          <div className="card overflow-hidden">
            <ul className="divide-y divide-stone-200">
              {suite.results
                .filter((r) => (r.passed && showPassed) || (!r.passed && showFailed))
                .map((r) => (
                  <TestResultRow key={r.name} result={r} />
                ))}
            </ul>
          </div>

          {/* Run from console hint */}
          <div className="bg-cream-50 rounded-lg p-4 text-xs text-text-gray">
            <p className="font-semibold text-heading mb-1">Run from devtools:</p>
            <code className="block bg-stone-900 text-green-300 p-2 rounded mt-1 font-mono">
              await window.__wpi_run_qa__()
            </code>
            <p className="mt-2">
              Or add <code className="bg-stone-200 px-1 rounded">?qa=1</code> to the URL to auto-run on page load.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function TestResultRow({ result }: { result: TestResult }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className={cn("p-3 hover:bg-stone-50/50 transition-colors", result.passed ? "" : "bg-red-50/20")}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
          result.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        )}>
          {result.passed ? <IconCheck className="w-3.5 h-3.5" /> : <IconClose className="w-3.5 h-3.5" />}
        </span>
        <span className="flex-1 text-sm text-heading">{result.name}</span>
        <span className="text-[10px] text-text-gray tabular-nums">{result.duration}ms</span>
        {result.passed ? null : <IconEye className="w-3.5 h-3.5 text-text-gray" />}
      </button>
      {expanded && !result.passed && (
        <div className="mt-2 ml-9 p-2 bg-red-50 rounded text-xs text-red-700 font-mono">
          {result.message}
        </div>
      )}
    </li>
  );
}
