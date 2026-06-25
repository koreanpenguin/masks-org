"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { createCoupon, checkAndRegisterPlay } from "@/app/actions/game";
import { useLanguageStore } from "@/store/languageStore";
import { t } from "@/lib/translations";

const SYMBOLS = ["🍀", "⭐", "🌸", "💎", "🎯", "💫", "🌺", "🎁", "✨"];
const CONFETTI_COLORS = ["#c17a5a","#e8a882","#ffd700","#ff6b6b","#4ecdc4","#a8654a","#f5c0a0","#ffb347","#9b59b6","#2ecc71"];

interface GameConfig {
  winPercent: number;
  discountUsd: number;
  discountKrw: number;
}

function Confetti() {
  const items = Array.from({ length: 56 }, (_, i) => ({
    id: i,
    x: (i * 13 + 7) % 100,
    delay: (i * 0.053) % 2.8,
    dur: 2.4 + (i * 0.07) % 2.2,
    color: CONFETTI_COLORS[i % 10],
    w: 5 + (i % 8),
    h: i % 3 === 2 ? (5 + (i % 8)) * 1.6 : 5 + (i % 8),
    radius: i % 3 === 0 ? "50%" : "2px",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {items.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.radius,
            animationName: "confetti-fall",
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
          }}
        />
      ))}
    </div>
  );
}

export function ScratchGame({ config }: { config: GameConfig }) {
  const locale = useLanguageStore((s) => s.locale);
  const tr = t[locale].game;

  // Phase: "email" → "playing"
  const [phase, setPhase] = useState<"email" | "playing">("email");
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Game state — determined once the email gate passes
  const [game, setGame] = useState<{ win: boolean; nums: [number, number, number] } | null>(null);

  // Scratch / reveal state
  const [fading, setFading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDown = useRef(false);
  const hasRevealed = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Draw the scratch surface whenever the game starts
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,    "#d6d6d6");
    bg.addColorStop(0.25, "#e8e8e8");
    bg.addColorStop(0.5,  "#c8c8c8");
    bg.addColorStop(0.75, "#dcdcdc");
    bg.addColorStop(1,    "#bebebe");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const shine = ctx.createLinearGradient(0, 0, W, H);
    shine.addColorStop(0,   "rgba(255,255,255,0.38)");
    shine.addColorStop(0.4, "rgba(255,255,255,0.06)");
    shine.addColorStop(1,   "rgba(255,255,255,0.18)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(90,90,90,0.75)";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillText(tr.scratchLabel, W / 2, H / 2 - 11);
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(120,120,120,0.65)";
    ctx.fillText(
      tr.scratchSub(config.winPercent, config.discountUsd, config.discountKrw),
      W / 2,
      H / 2 + 12,
    );
  }, [phase, config, tr]);

  async function handleStartGame() {
    const trimmed = emailInput.trim();
    if (!trimmed) { setEmailError(tr.emailEmpty); return; }
    setEmailLoading(true);
    setEmailError("");
    const result = await checkAndRegisterPlay(trimmed);
    if (!result.allowed) {
      setEmailError(result.error ?? tr.emailUnable);
      setEmailLoading(false);
      return;
    }
    // Generate game outcome now
    const win = Math.random() < config.winPercent / 100;
    let nums: [number, number, number];
    if (win) {
      const n = Math.floor(Math.random() * 9) + 1;
      nums = [n, n, n];
    } else {
      do {
        nums = [
          Math.floor(Math.random() * 9) + 1,
          Math.floor(Math.random() * 9) + 1,
          Math.floor(Math.random() * 9) + 1,
        ] as [number, number, number];
      } while (nums[0] === nums[1] && nums[1] === nums[2]);
    }
    setGame({ win, nums });
    setEmailLoading(false);
    setPhase("playing");
  }

  function getCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function scratch(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas || hasRevealed.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 50;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    lastPos.current = { x, y };

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) cleared++;
    }
    if (cleared / (canvas.width * canvas.height) > 0.52) triggerReveal();
  }

  function triggerReveal() {
    if (hasRevealed.current || !game) return;
    hasRevealed.current = true;
    setFading(true);
    setTimeout(async () => {
      setRevealed(true);
      if (game.win) {
        setCouponLoading(true);
        try {
          const result = await createCoupon();
          setCouponCode(result.code);
        } catch {
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          let code = "MASKS-";
          for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
          setCouponCode(code);
        } finally {
          setCouponLoading(false);
          setShowConfetti(true);
        }
      }
    }, 520);
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDown.current = true;
    lastPos.current = null;
    const { x, y } = getCoords(e);
    scratch(x, y);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDown.current) return;
    const { x, y } = getCoords(e);
    scratch(x, y);
  }

  function onPointerUp() {
    isDown.current = false;
    lastPos.current = null;
  }

  async function copyCode() {
    if (!couponCode) return;
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-[#f0e8dd] to-cream flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && !prefersReducedMotion && <Confetti />}

      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-terracotta font-medium mb-2">MasksOrg</p>
        <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-2">MasksOrgEry</h1>
        <p className="text-muted text-sm">
          {phase === "email"
            ? tr.subtitle(config.winPercent)
            : tr.subtitlePlaying(config.winPercent)}
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Card header */}
        <div className="bg-gradient-to-r from-terracotta via-[#b56e4f] to-[#a8654a] px-6 py-4 text-center text-white">
          <p className="text-xs uppercase tracking-widest font-semibold opacity-80 mb-0.5">{tr.headerLabel}</p>
          <p className="text-2xl font-bold tracking-tight">
            ${config.discountUsd.toFixed(2)} · ₩{config.discountKrw.toLocaleString("ko-KR")}
          </p>
          <p className="text-xs opacity-70 mt-0.5">{tr.headerSub}</p>
        </div>

        <div className="p-5">
          {/* ── Email gate ── */}
          {phase === "email" && (
            <div className="animate-fade-up space-y-4">
              <p className="text-sm text-muted text-center">
                {tr.emailHint}
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder={tr.emailPlaceholder}
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && !emailLoading && handleStartGame()}
                  className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-terracotta transition-colors"
                  autoFocus
                />
                {emailError && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span>✕</span> {emailError}
                  </p>
                )}
              </div>
              <button
                onClick={handleStartGame}
                disabled={emailLoading || !emailInput.trim()}
                className="w-full py-3 rounded-xl bg-terracotta text-white font-bold text-sm hover:bg-[#a8654a] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {emailLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    {tr.checking}
                  </>
                ) : (
                  tr.play
                )}
              </button>
            </div>
          )}

          {/* ── Scratch card ── */}
          {phase === "playing" && game && (
            <>
              <div className="relative rounded-2xl overflow-hidden border border-parchment" style={{ height: 200 }}>
                {/* Numbers underneath */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 px-5 bg-gradient-to-b from-cream to-[#f0e8dd]">
                  {game.nums.map((n, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-1.5"
                      style={{
                        height: 130,
                        maxWidth: 100,
                        background: game.win ? "linear-gradient(135deg,#fff5ef,#fde8db)" : "#f7f3ef",
                        border: `2.5px solid ${game.win ? "#c17a5a" : "#ddd4c8"}`,
                        boxShadow: game.win
                          ? "0 4px 16px rgba(193,122,90,0.25)"
                          : "inset 0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <span className="text-2xl leading-none">{SYMBOLS[n - 1]}</span>
                      <span
                        className="text-3xl font-bold leading-none"
                        style={{ color: game.win ? "#c17a5a" : "#2d2926" }}
                      >
                        {n}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Canvas */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="absolute inset-0 touch-none select-none"
                  style={{
                    width: "100%",
                    height: "100%",
                    cursor: hasRevealed.current ? "default" : "crosshair",
                    opacity: fading ? 0 : 1,
                    transition: "opacity 0.5s ease-out",
                    pointerEvents: hasRevealed.current ? "none" : "auto",
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                />
              </div>

              {/* Result */}
              {revealed && (
                <div
                  className="mt-4 rounded-2xl p-4 text-center animate-fade-up"
                  style={{
                    background: game.win ? "linear-gradient(135deg,#fff5ef,#fde8db)" : "#faf6f1",
                    border: `2px solid ${game.win ? "#c17a5a" : "#e8ddd0"}`,
                  }}
                >
                  {game.win ? (
                    <>
                      <p className="text-3xl mb-1">🎉</p>
                      <p className="text-xl font-bold text-charcoal mb-0.5">{tr.wonTitle}</p>
                      <p className="text-sm text-muted mb-3">
                        {tr.wonSub(config.discountUsd, config.discountKrw)}
                      </p>
                      {couponLoading ? (
                        <div className="flex justify-center py-3">
                          <div className="w-5 h-5 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
                        </div>
                      ) : couponCode ? (
                        <>
                          <div className="flex items-center gap-2 bg-white rounded-xl border border-parchment px-4 py-3 mb-2">
                            <code className="flex-1 text-left font-bold text-terracotta tracking-widest text-base">
                              {couponCode}
                            </code>
                            <button
                              onClick={copyCode}
                              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                              style={{ background: copied ? "#6b9e6b" : "#c17a5a" }}
                            >
                              {copied ? tr.copied : tr.copy}
                            </button>
                          </div>
                          <p className="text-xs text-[#bbb]">{tr.staffNote}</p>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-1">😔</p>
                      <p className="text-lg font-bold text-charcoal mb-0.5">{tr.lostTitle}</p>
                      <p className="text-sm text-muted">{tr.lostSub}</p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-8 text-sm text-muted">
        <Link href="/" className="hover:text-terracotta transition-colors">{tr.home}</Link>
        <Link href="/shop" className="hover:text-terracotta transition-colors">{tr.browse}</Link>
      </div>
    </div>
  );
}
