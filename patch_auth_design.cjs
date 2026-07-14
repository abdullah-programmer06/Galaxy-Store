const fs = require('fs');

function updateSignIn() {
  let code = fs.readFileSync('src/screens/SignIn.tsx', 'utf8');
  
  // Add Eye, EyeOff icons
  code = code.replace(
    "import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';",
    "import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';"
  );
  
  // Add state for showPassword
  code = code.replace(
    "const [isResetting, setIsResetting] = useState(false);",
    "const [isResetting, setIsResetting] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);"
  );

  // Update form JSX
  const newForm = `
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
              <User className="text-primary" size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent py-4 px-4 text-white placeholder-on-surface-variant/50 focus:outline-none"
              placeholder="Email or Username"
            />
          </div>

          <div>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
                <Lock className="text-primary" size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent py-4 px-4 text-white placeholder-on-surface-variant/50 focus:outline-none"
                placeholder="Password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-on-surface-variant hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isResetting ? 'Sending...' : 'Forgot Password?'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(0,240,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,240,255,0.23)] hover:-translate-y-0.5 mt-2 text-lg"
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-container text-on-surface-variant">or continue with</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all shadow-lg hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-primary hover:underline font-medium">
              Sign Up
            </button>
          </p>
        </div>
`;
  
  // Replace everything from <form> to end of card
  code = code.replace(/<form onSubmit=\{handleSignIn\}[\s\S]*<\/motion\.div>/, newForm + '      </motion.div>');
  
  // Update header text to match image somewhat ("Welcome Back", "Login to continue your journey")
  code = code.replace("Sign in to your Galaxy Store account", "Login to continue your journey");

  fs.writeFileSync('src/screens/SignIn.tsx', code);
}

function updateSignUp() {
  let code = fs.readFileSync('src/screens/SignUp.tsx', 'utf8');
  
  code = code.replace(
    "import { UserPlus, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';",
    "import { UserPlus, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, User } from 'lucide-react';"
  );
  
  code = code.replace(
    "const [isLoading, setIsLoading] = useState(false);",
    "const [isLoading, setIsLoading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);"
  );

  const newForm = `
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
              <Mail className="text-primary" size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent py-4 px-4 text-white placeholder-on-surface-variant/50 focus:outline-none"
              placeholder="Email Address"
            />
          </div>

          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
              <Lock className="text-primary" size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent py-4 px-4 text-white placeholder-on-surface-variant/50 focus:outline-none"
              placeholder="Password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="pr-4 text-on-surface-variant hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
              <Lock className="text-primary" size={20} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent py-4 px-4 text-white placeholder-on-surface-variant/50 focus:outline-none"
              placeholder="Confirm Password"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="pr-4 text-on-surface-variant hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(0,240,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,240,255,0.23)] hover:-translate-y-0.5 mt-4 text-lg"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-container text-on-surface-variant">or continue with</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all shadow-lg hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Already have an account?{' '}
            <button onClick={() => onNavigate('signin')} className="text-primary hover:underline font-medium">
              Login
            </button>
          </p>
        </div>
`;

  code = code.replace(/<form onSubmit=\{handleSignUp\}[\s\S]*<\/motion\.div>/, newForm + '      </motion.div>');
  code = code.replace("Join Galaxy Store today", "Create an account to get started");

  fs.writeFileSync('src/screens/SignUp.tsx', code);
}

updateSignIn();
updateSignUp();
