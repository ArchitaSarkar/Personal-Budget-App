import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("Frontend cn helper utility", () => {
  it("merges standard class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const isHidden = false;
    expect(cn("base-class", isActive && "active", isHidden && "hidden")).toBe("base-class active");
  });

  it("resolves and deduplicates conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
