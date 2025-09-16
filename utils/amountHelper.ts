/**
 * Peso Amount Helper Utilities
 * Provides consistent formatting and validation for Philippine Peso amounts
 */

export interface AmountFormatOptions {
  showSymbol?: boolean;
  decimalPlaces?: number;
  showCommas?: boolean;
}

/**
 * Format a number as Philippine Peso
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted peso string
 */
export const formatPeso = (
  amount: number, 
  options: AmountFormatOptions = {}
): string => {
  const {
    showSymbol = true,
    decimalPlaces = 2,
    showCommas = true
  } = options;

  // Ensure amount is a valid number
  const validAmount = isNaN(amount) ? 0 : amount;
  
  // Format the number
  let formatted = validAmount.toFixed(decimalPlaces);
  
  // Add commas for thousands separator
  if (showCommas) {
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // Add peso symbol
  return showSymbol ? `₱${formatted}` : formatted;
};

/**
 * Parse a peso string back to a number
 * @param pesoString - String like "₱1,234.56" or "1234.56"
 * @returns Parsed number
 */
export const parsePeso = (pesoString: string): number => {
  if (!pesoString) return 0;
  
  // Remove peso symbol and commas
  const cleanString = pesoString.replace(/[₱,]/g, '');
  
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate if a string is a valid peso amount
 * @param amount - String to validate
 * @returns True if valid peso amount
 */
export const isValidPesoAmount = (amount: string): boolean => {
  if (!amount) return false;
  
  // Remove peso symbol and commas for validation
  const cleanAmount = amount.replace(/[₱,]/g, '');
  
  // Check if it's a valid number
  const num = parseFloat(cleanAmount);
  return !isNaN(num) && num >= 0;
};

/**
 * Format amount for display in cards/lists (shorter format)
 * @param amount - The amount to format
 * @returns Short formatted peso string
 */
export const formatPesoShort = (amount: number): string => {
  return formatPeso(amount, { decimalPlaces: 0 });
};

/**
 * Format amount for detailed display (with decimals)
 * @param amount - The amount to format
 * @returns Detailed formatted peso string
 */
export const formatPesoDetailed = (amount: number): string => {
  return formatPeso(amount, { decimalPlaces: 2 });
};

/**
 * Calculate total with tax (assuming 12% VAT)
 * @param amount - Base amount
 * @param taxRate - Tax rate (default 0.12 for 12% VAT)
 * @returns Amount with tax
 */
export const addTax = (amount: number, taxRate: number = 0.12): number => {
  return amount * (1 + taxRate);
};

/**
 * Calculate amount without tax
 * @param totalAmount - Total amount including tax
 * @param taxRate - Tax rate (default 0.12 for 12% VAT)
 * @returns Base amount without tax
 */
export const removeTax = (totalAmount: number, taxRate: number = 0.12): number => {
  return totalAmount / (1 + taxRate);
};

/**
 * Round amount to nearest peso (no decimals)
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export const roundToPeso = (amount: number): number => {
  return Math.round(amount);
};

/**
 * Format amount for cart/checkout display
 * @param amount - The amount to format
 * @returns Formatted string for cart display
 */
export const formatPesoForCart = (amount: number): string => {
  return formatPeso(amount, { decimalPlaces: 2, showCommas: true });
};

/**
 * Format amount for price display in menu items
 * @param amount - The amount to format
 * @returns Formatted string for price display
 */
export const formatPesoForPrice = (amount: number): string => {
  return formatPeso(amount, { decimalPlaces: 0, showCommas: false });
};
