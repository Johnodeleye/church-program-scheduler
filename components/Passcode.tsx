"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Shield,
  Sparkles,
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
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const MAX_ATTEMPTS = 5;
  const CORRECT_PASSCODE = ["2", "0", "2", "6"];

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
        localStorage.setItem('rccg_auth', 'true');
        onSuccess();
      } else {
        setError(true);
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPasscode([]);
          setError(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-40%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-[-40%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s", animationDuration: "4s" }} />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 transition-all">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                <Image
                  src="/rccg.png"
                  alt="RCCG Logo"
                  width={64}
                  height={64}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              RCCG David's Pavilion
            </h1>
            <p className="text-sm text-gray-600 font-medium mt-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Bible Study - Digging Deep
              <Sparkles className="w-4 h-4 text-purple-500" />
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure Access</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Virtual Service</span>
            </div>
          </div>

          {isLocked ? (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-700 text-lg">Too Many Attempts</h3>
              <p className="text-sm text-red-600 mt-2">
                Please contact the administrator to reset your access.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
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
                          bg-gradient-to-br from-gray-50 to-white border-2 rounded-2xl
                          focus:outline-none focus:ring-4
                          transition-all duration-200
                          ${
                            error
                              ? "border-red-400 focus:ring-red-100 focus:border-red-500 animate-shake"
                              : "border-gray-200 focus:ring-purple-100 focus:border-purple-500"
                          }
                          ${passcode[index] ? "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50" : ""}
                        `}
                        disabled={isLoading}
                      />
                      {passcode[index] && !error && (
                        <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-green-500 bg-white rounded-full shadow-sm" />
                      )}
                    </div>
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-sm font-medium mt-4 text-center animate-in fade-in duration-300">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Invalid passcode. {MAX_ATTEMPTS - attempts} attempts remaining
                  </p>
                )}
                <div className="mt-5 flex justify-center gap-1.5">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        passcode[index]
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-110"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  Secure
                </span>
                <span>v2.0.1</span>
                <span>{new Date().getFullYear()} © RCCG</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <span className="inline-block animate-pulse text-purple-500">●</span> Built with ❤️ by John (The PDev)
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}