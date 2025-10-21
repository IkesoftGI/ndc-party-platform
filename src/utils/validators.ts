export function isValidGhanaCard(value: string): boolean {
  // Example Ghana Card number pattern: GHA-XXXXXXXXXX-X
  return /^GHA-\d{9,10}-\d{1}$/.test(value.trim());
}

export function isValidVoterId(value: string): boolean {
  // Accepts only 10 digits
  return /^\d{10}$/.test(value.trim());
}

export function isValidPartyCard(value: string): boolean {
  // Accepts formats like GRA-DMK-1234567890
  return /^[A-Z]{3}-[A-Z]{3}-\d{10}$/.test(value.trim());
}
