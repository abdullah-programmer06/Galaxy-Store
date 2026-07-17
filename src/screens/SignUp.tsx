import React, { useState } from "react";
import { motion } from "motion/react";
import { Route } from "../types";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "../firebase";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthHeader } from "../components/AuthHeader";

interface SignUpProps {
  onNavigate: (route: Route) => void;
}

export function SignUp({ onNavigate }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleSignUp = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onNavigate("home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up with Google.");
    }
  };
  const handleAppleSignUp = async () => {
    setError(null);
    const provider = new OAuthProvider("apple.com");
    try {
      await signInWithPopup(auth, provider);
      onNavigate("home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up with Apple.");
    }
  };
  const handleFacebookSignUp = async () => {
    setError(null);
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onNavigate("home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up with Facebook.");
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onNavigate("home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 bg-[#070721] min-h-screen relative overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#7B61FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-[#00f0ff]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Container for Auth Content */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Dynamic 3D Header & Winking Mascot placed outside card */}
        <AuthHeader
          title="Create Account"
          subtitle="Create an account to get started"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-full bg-[#1e1d38] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-visible"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-5 flex items-start gap-3 mt-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="flex-grow">
                {error.includes("auth/operation-not-allowed") ||
                error.includes("operation-not-allowed") ? (
                  <div className="space-y-2 text-left">
                    <p className="text-sm text-red-200 font-bold leading-relaxed">
                      Firebase Authentication Sign-In Method is Disabled
                    </p>
                    <p className="text-xs text-red-300/95 leading-relaxed">
                      You need to enable the **Email/Password** or **Google**
                      sign-in provider under the "Sign-in method" tab in your
                      Firebase project console: **galaxy-store-2cd1a**.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href="https://console.firebase.google.com/project/galaxy-store-2cd1a/authentication/providers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        Enable Sign-In Providers Now
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ) : error.includes("auth/network-request-failed") ||
                  error.includes("network-request-failed") ? (
                  <div className="space-y-2 text-left">
                    <p className="text-sm text-red-200 font-bold leading-relaxed">
                      Network Connection Blocked or Iframe Sandboxed
                    </p>
                    <p className="text-xs text-red-300/95 leading-relaxed">
                      This error is usually caused by browser sandbox
                      restrictions inside the preview iframe, or an ad-blocker /
                      Brave Shields blocking Firebase Auth APIs.
                    </p>
                    <div className="text-xs text-red-300/80 space-y-1 font-semibold list-decimal list-inside pl-1 mt-1">
                      <p>
                        1. Open the app in a **New Tab** (click the external
                        link icon on the top right of the screen).
                      </p>
                      <p>
                        2. Disable any Ad-blocker or Brave Shields for this
                        domain.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-200 leading-relaxed font-medium">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4 mt-2">
            {/* Email input in 3D claymation style */}
            <div className="relative flex items-center bg-[#070721]/60 border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#A288E3]/60 transition-all h-14">
              <div className="w-11 h-11 rounded-xl bg-[#A288E3]/15 flex items-center justify-center shrink-0 ml-1.5 text-[#A288E3]">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent py-4 px-4 text-white placeholder-white/30 font-medium focus:outline-none"
                placeholder="Email Address"
              />
            </div>

            {/* Password Input with eye toggle */}
            <div className="relative flex items-center bg-[#070721]/60 border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#A288E3]/60 transition-all h-14">
              <div className="w-11 h-11 rounded-xl bg-[#A288E3]/15 flex items-center justify-center shrink-0 ml-1.5 text-[#A288E3]">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent py-4 px-4 text-white placeholder-white/30 font-medium focus:outline-none"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-[#A99EB1] hover:text-[#A288E3] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Input with eye toggle */}
            <div className="relative flex items-center bg-[#070721]/60 border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#A288E3]/60 transition-all h-14">
              <div className="w-11 h-11 rounded-xl bg-[#A288E3]/15 flex items-center justify-center shrink-0 ml-1.5 text-[#A288E3]">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent py-4 px-4 text-white placeholder-white/30 font-medium focus:outline-none"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="pr-4 text-[#A99EB1] hover:text-[#A288E3] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Responsive 3D Clay Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#A288E3] to-[#8F71E1] text-white font-extrabold py-4 rounded-2xl shadow-[0_6px_0_0_#7459C5] hover:shadow-[0_4px_0_0_#7459C5] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all text-lg mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-4 bg-[#1e1d38] text-[#A99EB1] text-xs font-bold uppercase tracking-wider">
              or continue with
            </span>
          </div>

          {/* High-Fidelity Circular Social Buttons */}
          <div className="flex justify-center gap-4">
            {/* Google (Working Integration) */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-14 h-14 bg-[#070721]/60 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#070721]/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/20"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={handleAppleSignUp}
              className="w-14 h-14 bg-[#070721]/60 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#070721]/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/20 text-white"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.99 1.12.09 2.27-.58 2.98-1.43z" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookSignUp}
              className="w-14 h-14 bg-[#070721]/60 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#070721]/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/20 text-[#1877F2]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#9A8F9E] text-sm font-semibold">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate("signin")}
                className="text-[#A288E3] hover:text-white hover:underline font-bold transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
