"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import EventCreationForm from "@/components/event/EventCreationForm";

export default function CreateEventPage() {
  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "0 20px 100px 20px",
      animation: "fadeIn 0.5s ease"
    }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "3rem" }}
      >
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: "2.75rem", 
          color: "white", 
          marginBottom: "0.5rem" 
        }}>
          New Production
        </h1>
        <p style={{ 
          color: "var(--text-muted)", 
          fontSize: "0.95rem", 
          letterSpacing: "0.05em",
          maxWidth: "600px"
        }}>
          Schedule a new cinematic production. Fill in the details below to create a new event in your production calendar.
        </p>
      </motion.div>

      {/* Event Creation Form */}
      <EventCreationForm />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}