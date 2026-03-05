import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Localization Helpers ---

export type LocalizedString = Record<string, string>;

export function getLocalized(obj: LocalizedString | any, locale: string): string {
  if (!obj || typeof obj !== "object") return String(obj || "");
  return obj[locale] || obj["es-CL"] || obj["en"] || Object.values(obj)[0] || "";
}

// --- Currency & Pricing ---

export function formatCurrency(amount: number | string, currency: string = "CLP", locale: string = "es-CL"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "CLP" ? 0 : 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toLocaleString()}`;
  }
}

export function getRegionalPrice(product: any, locale: string): { amount: number; currency: string } {
  const currencyMap: Record<string, string> = {
    "es-CL": "CLP",
    "en": "USD",
    "pt-BR": "BRL",
  };
  const currency = currencyMap[locale] || "CLP";

  // Check if there's a locale-specific price in the prices jsonb field
  if (product.prices && typeof product.prices === "object" && product.prices[locale]) {
    return { amount: parseFloat(product.prices[locale]), currency };
  }

  // Fall back to base price
  return { amount: parseFloat(product.price || "0"), currency: "CLP" };
}
