"use client";
import BackgroundUi from "@/components/ethreal-shadow";
import Navbar from "./_components/Navbar";
import RepoTextarea from "@/components/RepoTextarea";

export default function Home() {
  const handleSend = (message) => {
    alert("Message sent:", message);
  };

  return (
    <div className="relative w-full h-screen">
      <BackgroundUi
        color="rgba(139, 92, 246, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      />
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6">
        <h1 className="max-w-6xl text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Turn Raw Code Into Beautiful Documentation Instantly.
        </h1>

        <p className="mt-6 text-center text-lg font-semibold sm:text-xl md:text-2xl lg:text-3xl">
          Paste your GitHub repository link below and let AI compile...
        </p>

        {/* Prompt Box */}
        <div className="mt-10 w-full max-w-3xl">
          <RepoTextarea
            placeholder="Paste your GitHub repository URL..."
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
