"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

// --- EVENT MUTATIONS ---

export async function createEvent(data: any) {
  try {
    const docRef = await adminDb.collection("events").add({
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    await adminDb.collection("events").doc(id).update({
      ...data,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    await adminDb.collection("events").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
}

// --- EQUIPMENT MUTATIONS ---

export async function createEquipment(data: any) {
  try {
    const docRef = await adminDb.collection("equipment").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEquipment(id: string, data: any) {
  try {
    await adminDb.collection("equipment").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEquipment(id: string) {
  try {
    await adminDb.collection("equipment").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- STAFF MUTATIONS ---

export async function createStaff(data: any) {
  try {
    const docRef = await adminDb.collection("staff").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStaff(id: string, data: any) {
  try {
    await adminDb.collection("staff").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStaff(id: string) {
  try {
    await adminDb.collection("staff").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- GALLERY MUTATIONS ---

export async function createGalleryPhoto(data: any) {
  try {
    const docRef = await adminDb.collection("gallery").add({
      ...data,
      uploadedAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGalleryPhoto(id: string, data: any) {
  try {
    await adminDb.collection("gallery").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryPhoto(id: string) {
  try {
    await adminDb.collection("gallery").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- INQUIRY MUTATIONS ---

export async function updateInquiry(id: string, data: any) {
  try {
    await adminDb.collection("contacts").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await adminDb.collection("contacts").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- BLOG MUTATIONS ---

export async function createBlogPost(data: any) {
  try {
    const docRef = await adminDb.collection("blogPosts").add({
      ...data,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBlogPost(id: string, data: any) {
  try {
    await adminDb.collection("blogPosts").doc(id).update({
      ...data,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    console.log("ServerAction: Attempting to delete blog post:", id);
    if (!id) throw new Error("Missing ID for deletion");
    await adminDb.collection("blogPosts").doc(id).delete();
    console.log("ServerAction: Deletion successful:", id);
    return { success: true };
  } catch (error: any) {
    console.error("ServerAction: Deletion failed:", error.message);
    return { success: false, error: error.message };
  }
}

// --- AI GENERATION ---

const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * Generates a full blog article (HTML) + a Pollinations.ai cover image URL.
 * 
 * Flow:
 *  1. Groq (llama-3.3-70b) writes the full article in HTML
 *  2. Groq (llama-3.3-70b) writes a detailed image prompt for the cover
 *  3. Pollinations.ai (Flux model, free, no API key) renders the image
 */
export async function generateAIContent(topic: string) {
  try {
    if (!GROQ_API_KEY) {
      return { success: false, error: "GROQ_API_KEY is not set in environment variables." };
    }

    // ── Step 1: Generate the blog article ──────────────────────────────
    const articleResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional blog writer for '4K Movie Kesri', a luxury cinematic wedding photography and videography studio based in Surat, Gujarat, India. 
Write SEO-optimized, highly engaging blog posts in clean HTML format. 
Use proper h2, h3 tags for structure. Include an intro, 3-4 sections, and a closing CTA. 
Content should feel premium, artistic, and trust-building. 
Do NOT include <html>, <head>, or <body> tags — only the inner content.`,
          },
          {
            role: "user",
            content: `Write a complete blog post about: "${topic}". Return only the HTML content.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const articleResult = await articleResponse.json();
    if (!articleResponse.ok) throw new Error(articleResult.error?.message || "Article generation failed");
    const articleContent: string = articleResult.choices[0].message.content;

    // ── Step 2: Generate a detailed image prompt using Groq ────────────
    const promptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert at writing text-to-image prompts for Flux (a photorealistic AI image model). 
Your prompts produce stunning, cinematic, editorial-quality images. 
Always include: lighting style, mood, color palette, camera style, and subject details. 
Keep the prompt under 120 words. Return ONLY the prompt text — no explanation, no quotes.`,
          },
          {
            role: "user",
            content: `Write a Flux image generation prompt for the cover photo of a blog post titled: "${topic}". 
The image should suit a luxury Indian wedding photography studio. 
Style: cinematic, warm golden tones, bokeh, professional photography aesthetic.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    const promptResult = await promptResponse.json();
    if (!promptResponse.ok) throw new Error(promptResult.error?.message || "Image prompt generation failed");
    const imagePrompt: string = promptResult.choices[0].message.content.trim();

    // ── Step 3: Build Pollinations.ai URL (free, no API key needed) ────
    // Pollinations uses Flux model — just encode the prompt as a URL path
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const seed = Math.floor(Math.random() * 999999);
    const coverImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&model=flux&seed=${seed}&nologo=true&enhance=true`;

    return {
      success: true,
      content: articleContent,
      coverImage: coverImageUrl,
      imagePrompt, // expose so user can see/edit the prompt
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}

// --- YOUTUBE MUTATIONS ---

export async function createYouTubeVideo(data: any) {
  try {
    const docRef = await adminDb.collection("youtubeVideos").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteYouTubeVideo(id: string) {
  try {
    await adminDb.collection("youtubeVideos").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
