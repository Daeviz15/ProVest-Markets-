export const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    ngn: '₦',
    inr: '₹',
    // Add more as needed or use Intl.NumberFormat
  };
  return symbols[currency.toLowerCase()] || currency.toUpperCase();
};

export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl
    return `${getCurrencySymbol(currency)}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};
