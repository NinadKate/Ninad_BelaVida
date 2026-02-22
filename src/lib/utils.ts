import { COUNTRIES } from "@/constants/countries";

export function getLocalized(content: unknown, locale: string, defaultLocale = 'es-CL'): string {
    if (typeof content !== 'object' || content === null) return '';
    const record = content as Record<string, string>;
    return record[locale] || record[defaultLocale] || '';
}

export function formatCurrency(amount: number | string, currency = 'CLP', locale = 'es-CL') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(Number(amount));
}

export function getRegionalPrice(product: any, locale: string) {
    const country = COUNTRIES.find(c => c.locale === locale) || COUNTRIES[0];
    const currency = country.currency;
    const regionalPrice = product.prices?.[currency];
    
    return {
        amount: regionalPrice || product.price,
        currency: currency
    };
}
