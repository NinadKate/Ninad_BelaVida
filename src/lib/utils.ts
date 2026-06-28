import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Localization Helpers ---

export type LocalizedString = Record<string, string>;

export function getLocalized(
  obj: LocalizedString | string | number | boolean | null | undefined,
  locale: string,
): string {
  if (!obj || typeof obj !== "object") return String(obj || "");

  const localizedObject = obj as LocalizedString;
  return (
    localizedObject[locale] ||
    localizedObject["es-CL"] ||
    localizedObject["en"] ||
    Object.values(localizedObject)[0] ||
    ""
  );
}

// --- Currency & Pricing ---

const currencySymbols: Record<string, string> = {
  CLP: "CLP",
  PEN: "S/",
  PYG: "₲",
  UYU: "UYU",
  BOB: "Bs",
  ARS: "AR",
  INR: "₹",
  USD: "USD",
};

const currencyFractionDigits: Record<string, number> = {
  CLP: 0,
  PYG: 0,
};

const FALLBACK_LOCALE = "es-CL";

function getSafeLocale(locale: string): string {
  const normalizedLocale = locale || FALLBACK_LOCALE;
  const exactMatch = Intl.NumberFormat.supportedLocalesOf([
    normalizedLocale,
  ])[0];
  if (exactMatch) return exactMatch;

  const baseLocale = normalizedLocale.split("-")[0];
  const baseMatch = Intl.NumberFormat.supportedLocalesOf([baseLocale])[0];
  if (baseMatch) return baseMatch;

  return FALLBACK_LOCALE;
}

function parseAmountValue(amount: number | string): number {
  if (typeof amount === "number") return amount;

  return parseFloat(amount.replace(/,/g, ""));
}

export function formatCurrency(amount: number | string, currency: string = "CLP", locale: string = "es-CL"): string {
  const num = parseAmountValue(amount);
  if (isNaN(num)) return "";

  const symbol = currencySymbols[currency] || currency;
  const fractionDigits = currencyFractionDigits[currency] ?? 2;
  const safeLocale = getSafeLocale(locale);

  try {
    const formattedNumber = new Intl.NumberFormat(safeLocale, {
      useGrouping: false,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(num);

    return `${symbol} ${formattedNumber}`;
  } catch {
    return `${symbol} ${num.toLocaleString(safeLocale, {
      useGrouping: false,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
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

export type RegionalPriceSource = {
  price?: string | number;
  prices?: Record<string, string | number> | null;
};

export function getRegionalPrice(
  product: RegionalPriceSource,
  locale: string,
): { amount: number; currency: string } {
  const currency = getCurrencyForLocale(locale);

  // Check if there's a locale-specific price in the prices jsonb field
  if (product.prices && typeof product.prices === "object") {
    // Try exact locale key first (e.g. "es-CL")
    if (product.prices[locale])
      return { amount: parseAmountValue(product.prices[locale]), currency };
    // Then try currency key (e.g. "INR", "USD")
    if (product.prices[currency])
      return { amount: parseAmountValue(product.prices[currency]), currency };
  }

  // Fall back to base price in the locale's currency
  return { amount: parseAmountValue(product.price || "0"), currency };
}
