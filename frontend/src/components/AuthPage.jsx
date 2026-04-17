import { useState, useEffect } from "react";

export default function AuthPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate auth network request
    setTimeout(() => {
       setLoading(false);
       onLogin(email);
    }, 1200);
  };

  return (
    <main 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden selection:bg-[#8a2be2] selection:text-white" 
      style={{ background: "#050505" }}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Mouse Tracker Background Glow */}
      <div 
         className="absolute pointer-events-none transition-opacity duration-500 will-change-transform z-0" 
         style={{
            width: "800px",
            height: "800px",
            left: mousePos.x - 400,
            top: mousePos.y - 400,
            background: "radial-gradient(circle, rgba(138,43,226,0.15) 0%, rgba(8,12,255,0.05) 40%, rgba(0,0,0,0) 70%)",
            filter: "blur(60px)",
         }}
      />
      
      {/* Static ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#080cff] opacity-[0.03] filter blur-[100px]" />
      </div>

      <div className="absolute top-8 left-8 z-20">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 font-inter text-sm text-[#988ca0] hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"
         >
           <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
           Return
         </button>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
         {/* Glassmorphic Auth Card */}
         <div className="rounded-3xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10">
            
            <div className="flex justify-center mb-8">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8a2be2]/20 to-[#080cff]/20 border border-white/5 flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.2)]">
                  <span className="material-symbols-outlined text-[#dcb8ff]">vpn_key</span>
               </div>
            </div>

            <h2 className="font-manrope text-white text-center text-3xl font-bold mb-2 tracking-tight">Identity Verification</h2>
            <p className="font-inter text-[#988ca0] text-center text-sm mb-8">Authenticate to securely access your localized financial mirror instance.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div>
                  <label className="sr-only">Email address</label>
                  <input 
                     type="email" 
                     placeholder="name@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3.5 text-white font-inter text-sm focus:outline-none focus:border-[#8a2be2]/50 focus:bg-[#1a1a1a] transition-all placeholder:text-[#4c4354]"
                     required
                  />
               </div>
               
               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full relative group rounded-xl font-manrope font-semibold overflow-hidden shadow-[0_0_20px_rgba(138,43,226,0.2)] transition-all hover:shadow-[0_0_30px_rgba(138,43,226,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ padding: "0.875rem 0", color: "#fff" }}
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] to-[#080cff]" />
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                     {loading ? (
                        <>
                           <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                           Authenticating...
                        </>
                     ) : "Continue with Email"}
                  </span>
               </button>
            </form>

            <div className="flex items-center gap-4 my-8 opacity-60">
               <div className="h-px bg-white/10 flex-1" />
               <span className="font-inter text-[#988ca0] text-xs font-semibold tracking-widest uppercase">Or</span>
               <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="flex flex-col gap-3">
               <button 
                  type="button" 
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-3 bg-[#131313] border border-white/10 rounded-xl py-3.5 hover:bg-[#1a1a1a] transition-all group"
               >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-inter text-[#e5e2e1] text-sm font-semibold">Sign in with Google</span>
               </button>
               
               <button 
                  type="button" 
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-3 bg-[#131313] border border-white/10 rounded-xl py-3.5 hover:bg-[#1a1a1a] transition-all group"
               >
                  <span className="material-symbols-outlined text-white text-xl group-hover:scale-110 transition-transform">apple</span>
                  <span className="font-inter text-[#e5e2e1] text-sm font-semibold">Sign in with Apple</span>
               </button>
            </div>
            
            <p className="font-inter text-[#4c4354] text-xs text-center mt-8">
               Your session data remains strictly localized. We do not transmit transaction payloads to third-party providers.
            </p>
         </div>
      </div>
    </main>
  );
}
