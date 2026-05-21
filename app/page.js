"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Animation for heading text
    gsap.fromTo(
      ".heading",
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power2.out",
        stagger: 0.4,
      }
    );

    // Animation for subheading text
    gsap.fromTo(
      ".subheading",
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power2.out",
        delay: 0.7,
      }
    );

    // Animation for the Get Started button
    gsap.fromTo(
      ".start-button",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "back.out(1.7)",
        delay: 1.5,
      }
    );
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 heading">
          Welcome to AI Interview Evaluator
        </h1>
        <p className="text-lg md:text-xl mb-8 subheading">
          Empower your interview process with AI-driven evaluation.
        </p>
        <Button
          onClick={() => router.replace("/dashboard")}
          className="bg-white text-blue-500 hover:bg-gray-100 transition-colors duration-300 start-button"
        >
          Lessss Go
        </Button>
        <p className="credit mt-4 text-sm text-right text-gray-400 font-serif">
          © All rights reserved.<br/> Owned by Roushan <br />from NSUT
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="raindrop"></div>
        <div className="thunder"></div>
      </div>

      {/* CSS for positioning the credit */}
      <style jsx>{`
        .credit {
          position: absolute;
          bottom: 10px;
          right: 10px;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </main>
  );
}
