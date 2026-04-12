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

const currencySymbols: Record<string, string> = {
  CLP: "CLP$",
  PEN: "S/",
  PYG: "₲",
  UYU: "UY$",
  BOB: "Bs",
  ARS: "AR$",
  INR: "₹",
  USD: "US$",
};

const currencyFractionDigits: Record<string, number> = {
  CLP: 0,
  PYG: 0,
};

export function formatCurrency(amount: number | string, currency: string = "CLP", locale: string = "es-CL"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "";

  const symbol = currencySymbols[currency] || currency;
  const fractionDigits = currencyFractionDigits[currency] ?? 2;

  try {
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(num);

    return `${symbol} ${formattedNumber}`;
  } catch {
    return `${symbol} ${num.toLocaleString()}`;
  }
}

export function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    "es-CL": "CLP",
    "es-PE": "PEN",
    "es-PY": "PYG",
    "es-UY": "UYU",
    "es-BO": "BOB",
    "es-AR": "ARS",
    "en": "USD",  // default English → USD
    "en-IN": "INR", // India specific English override → INR
  };
  return currencyMap[locale] || "CLP";
}

export function getRegionalPrice(product: any, locale: string): { amount: number; currency: string } {
  const currency = getCurrencyForLocale(locale);

  // Check if there's a locale-specific price in the prices jsonb field
  if (product.prices && typeof product.prices === "object") {
    // Try exact locale key first (e.g. "es-CL")
    if (product.prices[locale]) return { amount: parseFloat(product.prices[locale]), currency };
    // Then try currency key (e.g. "INR", "USD")
    if (product.prices[currency]) return { amount: parseFloat(product.prices[currency]), currency };
  }

  // Fall back to base price in the locale's currency
  return { amount: parseFloat(product.price || "0"), currency };
}
