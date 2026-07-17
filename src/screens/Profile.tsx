import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  auth,
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from "../firebase";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL || "");

        // Load address from local storage for this user
        const savedAddress = localStorage.getItem(`address_${currentUser.uid}`);
        if (savedAddress) {
          setAddress(savedAddress);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (displayName !== user.displayName || photoURL !== user.photoURL) {
        await updateProfile(user, { displayName, photoURL });
      }
      if (email !== user.email && email.trim() !== "") {
        await updateEmail(user, email);
      }
      if (password.trim() !== "") {
        await updatePassword(user, password);
      }

      // Save address locally
      localStorage.setItem(`address_${user.uid}`, address);

      setSuccess("Profile updated successfully!");
      setPassword(""); // Clear password field after update
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setError(
          "For security reasons, changing your email or password requires a recent login. Please log out and log back in to make these changes.",
        );
      } else {
        setError(
          err.message ||
            "Failed to update profile. Note: Changing email or password may require recent login.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-on-surface-variant">
          Please sign in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto min-h-[80vh]">
      <div className="mb-8 text-center">
        <h1 className="font-display-md text-on-surface tracking-tight mb-2 text-glow">
          Your Profile
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          Manage your personal information, address, and security settings.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container border-2 border-primary/30 flex items-center justify-center">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-on-surface-variant" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {displayName || "User"}
            </h2>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-200 leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle2
              className="text-green-500 shrink-0 mt-0.5"
              size={18}
            />
            <p className="text-sm text-green-200 leading-relaxed">{success}</p>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                  size={18}
                />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your Name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Shipping Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-4 text-on-surface-variant/50"
                  size={18}
                />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Your full delivery address..."
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Change Password (leave blank to keep current)
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="New password (min. 6 characters)"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-container text-black font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
