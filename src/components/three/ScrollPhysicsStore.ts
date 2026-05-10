import { create } from "zustand";

interface ScrollPhysicsState {
  scrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  isNearBottom: boolean;
  setScroll: (y: number, velocity: number, progress: number) => void;
  setMouse: (x: number, y: number) => void;
  setNearBottom: (near: boolean) => void;
}

export const useScrollPhysics = create<ScrollPhysicsState>((set) => ({
  scrollY: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  mouseX: 0,
  mouseY: 0,
  isNearBottom: false,
  setScroll: (y, velocity, progress) =>
    set({ scrollY: y, scrollVelocity: velocity, scrollProgress: progress }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setNearBottom: (near) => set({ isNearBottom: near }),
}));
