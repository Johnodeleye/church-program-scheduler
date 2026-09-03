"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Shield,
  Sparkles,
  Circle,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
} from "lucide-react";

interface PasscodeProps {
  onSuccess: () => void;
}

export default function Passcode({ onSuccess }: PasscodeProps) {
  const [passcode, setPasscode] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const MAX_ATTEMPTS = 5;
  const CORRECT_PASSCODE = ["2", "0", "2", "6"];

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('rccg_auth');
    if (isAuthenticated === 'true') {
      onSuccess();
    }
  }, [onSuccess]);

  useEffect(() => {
    if (passcode.length === 4) {
      verifyPasscode();
    }
  }, [passcode]);

  const verifyPasscode = () => {
    setIsLoading(true);
    const entered = passcode.join("");
    const correct = CORRECT_PASSCODE.join("");

    setTimeout(() => {
      if (entered === correct) {
        // Save to localStorage
        localStorage.setItem('rccg_auth', 'true');
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPasscode([]);
          setError(false);
          setShake(false);
          inputRefs.current[0]?.focus();
        }, 600);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const isLocked = attempts >= MAX_ATTEMPTS;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-40%] right-[-20%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-40%] left-[-20%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10 transition-all hover:shadow-blue-200/50">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="relative w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform">
                <Image
                  src="/rccg.png"
                  alt="RCCG Logo"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              RCCG David's Pavilion
            </h1>
            <p className="text-sm text-blue-600 font-medium mt-1 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Bible Study - Digging Deep
              <Sparkles className="w-4 h-4" />
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secure Access</span>
              <Circle className="w-1 h-1 fill-gray-300" />
              <span>Virtual Service</span>
            </div>
          </div>

          {isLocked ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-700">Too Many Attempts</h3>
              <p className="text-sm text-red-600 mt-1">
                Please contact the administrator to reset your access.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter 4-digit passcode
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative">
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="password"
                        maxLength={1}
                        inputMode="numeric"
                        autoFocus={index === 0}
                        value={passcode[index] || ""}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`
                          w-16 h-20 text-center text-2xl font-bold
                          bg-gray-50 border-2 rounded-2xl
                          focus:outline-none focus:ring-4
                          transition-all duration-200
                          ${
                            error
                              ? "border-red-400 focus:ring-red-200 focus:border-red-500 animate-[shake_0.5s_ease-in-out]"
                              : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                          }
                          ${passcode[index] ? "border-blue-400 bg-blue-50" : ""}
                        `}
                        disabled={isLoading}
                      />
                      {passcode[index] && !error && (
                        <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-blue-500 bg-white rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-sm font-medium mt-3 text-center animate-[fadeIn_0.3s]">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Invalid passcode. {MAX_ATTEMPTS - attempts} attempts remaining
                  </p>
                )}
                <div className="mt-4 flex justify-center gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        passcode[index]
                          ? "bg-blue-500 scale-110"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                <span className="flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" />
                  Secure
                </span>
                <span>v2.0.1</span>
                <span>{new Date().getFullYear()} © RCCG</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            <span className="inline-block animate-pulse">●</span> Built with ❤️ by John (The PDev)
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-10px);
          }
          40% {
            transform: translateX(10px);
          }
          60% {
            transform: translateX(-10px);
          }
          80% {
            transform: translateX(10px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}