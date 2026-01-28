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
