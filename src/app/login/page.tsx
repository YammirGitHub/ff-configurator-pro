"use client";

import { auth, db, googleProvider } from "@/shared/config/firebase";
import { GlassCard } from "@/shared/ui/GlassCard";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Modal de recuperación
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const ensureUserDoc = async (user: any, customName?: string) => {
    const isAdmin = user.email === "jjhor24@gmail.com";
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email,
        displayName: isAdmin
          ? "Yammir (Admin)"
          : customName || user.displayName || "Usuario FF",
        activo: isAdmin ? true : false,
        rol: isAdmin ? "admin" : "user",
        createdAt: serverTimestamp(),
      });
    }
  };

  const showMsg = (type: "error" | "success", msg: string) => {
    if (type === "error") {
      setError(msg);
      setSuccess(null);
    } else {
      setSuccess(msg);
      setError(null);
    }
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(cred.user);
      showMsg("success", "¡Bienvenido! Redirigiendo...");
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential")
        showMsg("error", "Credenciales incorrectas.");
      else showMsg("error", "Error al iniciar sesión.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return showMsg("error", "Las contraseñas no coinciden.");
    if (password.length < 6) return showMsg("error", "Mínimo 6 caracteres.");

    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await ensureUserDoc(cred.user, name);
      showMsg("success", "¡Cuenta creada! Redirigiendo...");
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use")
        showMsg("error", "El correo ya está registrado.");
      else showMsg("error", "Error al crear la cuenta.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // 👇 MAGIA PWA: Esto entra y sale de la app nativa sin romper iOS
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      showMsg("error", "Error al iniciar sesión con Google.");
      setIsLoading(false);
    }
  };

  const submitForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      showMsg(
        "success",
        "Correo enviado. Revisa tu bandeja de entrada o spam.",
      );
      setShowForgotModal(false);
      setResetEmail("");
    } catch (err: any) {
      if (err.code === "auth/user-not-found")
        showMsg("error", "Este correo no está registrado.");
      else showMsg("error", "Error al enviar el correo de recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const animationDirection = activeTab === "login" ? -1 : 1;

  return (
    // 👇 FIX 1: 100dvh en contenedor principal
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center px-4 py-10 font-body">
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-[400px]"
            >
              <GlassCard className="p-8 border border-white/10 shadow-[0_0_50px_rgba(255,107,53,0.15)]">
                <h3 className="text-xl font-display font-black text-white mb-2">
                  Recuperar Contraseña
                </h3>
                <p className="text-[#8b8fa5] text-xs font-medium mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace seguro
                  para restablecer tu contraseña.
                </p>

                <form
                  onSubmit={submitForgotPassword}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 grayscale">
                      📧
                    </span>
                    {/* 👇 FIX 2: text-base sm:text-[14px] */}
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#141728]/80 py-3.5 pl-12 pr-4 text-base sm:text-[14px] text-white transition-all placeholder:text-zinc-600 focus:border-[#ff6b35]/60 focus:bg-[#141728] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] focus:outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 rounded-xl bg-white/5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#f7931e] py-3 text-[13px] font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                    >
                      {isLoading ? "Enviando..." : "Enviar Enlace"}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-display text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,107,53,0.25)]">
            EA YAMMIR{" "}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffd700] bg-clip-text text-transparent">
              FF
            </span>
          </h1>
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#8b8fa5]">
            Configurador PRO
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_80px_rgba(255,107,53,0.1)] transition-shadow duration-700">
          <div className="relative mb-8 flex w-full rounded-2xl bg-[#0a0a14]/60 p-1.5 backdrop-blur-md border border-white/5">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setActiveTab(tab);
                }}
                className="relative z-10 flex-1 py-3 text-[13px] font-bold uppercase tracking-wider outline-none transition-colors"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#f7931e] shadow-[0_4px_15px_rgba(255,107,53,0.4)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={
                    activeTab === tab
                      ? "text-white"
                      : "text-[#6b6f8a] hover:text-[#a5a8be]"
                  }
                >
                  {tab === "login" ? "Ingresar" : "Registro"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 overflow-hidden"
              >
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-center text-[13px] font-medium text-red-400 backdrop-blur-md">
                  {error}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 overflow-hidden"
              >
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 text-center text-[13px] font-medium text-green-400 backdrop-blur-md">
                  {success}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={activeTab === "login" ? handleLogin : handleRegister}
            className="relative flex flex-col gap-5"
          >
            <AnimatePresence custom={animationDirection} mode="wait">
              <motion.div
                key={activeTab}
                custom={animationDirection}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {activeTab === "register" && (
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#8b8fa5]">
                      Usuario
                    </label>
                    <div className="group relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 transition-opacity group-focus-within:opacity-100 grayscale group-focus-within:grayscale-0">
                        👤
                      </span>
                      {/* 👇 FIX 3: text-base sm:text-[14px] */}
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#141728]/50 py-3.5 pl-12 pr-4 text-base sm:text-[14px] text-white transition-all placeholder:text-zinc-600 focus:border-[#ff6b35]/60 focus:bg-[#141728] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] focus:outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#8b8fa5]">
                    Correo Electrónico
                  </label>
                  <div className="group relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 transition-opacity group-focus-within:opacity-100 grayscale group-focus-within:grayscale-0">
                      📧
                    </span>
                    {/* 👇 FIX 4: text-base sm:text-[14px] */}
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#141728]/50 py-3.5 pl-12 pr-4 text-base sm:text-[14px] text-white transition-all placeholder:text-zinc-600 focus:border-[#ff6b35]/60 focus:bg-[#141728] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] focus:outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8b8fa5]">
                      Contraseña
                    </label>
                    {activeTab === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] font-bold text-[#ff6b35] hover:text-[#f7931e] transition-colors outline-none"
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="group relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 transition-opacity group-focus-within:opacity-100 grayscale group-focus-within:grayscale-0">
                      🔒
                    </span>
                    {/* 👇 FIX 5: text-base sm:text-[14px] */}
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#141728]/50 py-3.5 pl-12 pr-[50px] text-base sm:text-[14px] text-white transition-all placeholder:text-zinc-600 focus:border-[#ff6b35]/60 focus:bg-[#141728] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[16px] text-zinc-500 hover:text-[#ff6b35] transition-colors outline-none"
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                {activeTab === "register" && (
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#8b8fa5]">
                      Confirmar Contraseña
                    </label>
                    <div className="group relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 transition-opacity group-focus-within:opacity-100 grayscale group-focus-within:grayscale-0">
                        🔒
                      </span>
                      {/* 👇 FIX 6: text-base sm:text-[14px] */}
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#141728]/50 py-3.5 pl-12 pr-[50px] text-base sm:text-[14px] text-white transition-all placeholder:text-zinc-600 focus:border-[#ff6b35]/60 focus:bg-[#141728] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] focus:outline-none"
                        placeholder="Repite tu contraseña"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              disabled={isLoading}
              type="submit"
              className="group relative mt-2 w-full overflow-hidden rounded-[14px] bg-gradient-to-r from-[#ff6b35] to-[#f7931e] py-4 text-[14px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(255,107,53,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(255,107,53,0.45)] active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
            >
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              {isLoading
                ? "⏳ Procesando..."
                : activeTab === "login"
                  ? "🚀 Ingresar al Sistema"
                  : "✨ Crear Cuenta VIP"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#4a4f6a]">
            <div className="h-px flex-1 bg-white/5" />
            O Ingresa con
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.02] py-3.5 text-[14px] font-bold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </GlassCard>
      </motion.div>
    </div>
  );
}
