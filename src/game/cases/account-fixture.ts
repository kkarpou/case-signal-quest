// Authored anonymous simulation labels, not recovered platform records.
export const residentAccounts = Array.from({ length: 18 }, (_, i) => `N-${String(i + 1).padStart(2, "0")}`);
export const unresolvedAccounts = ["N-19", "N-20", "N-21", "N-22", "N-23"];
export const unresolvedPosts = unresolvedAccounts.map((account, i) => ({
  account, post: `P-${String(i + 19).padStart(2, "0")}`,
  text: "Το φως έσβησε στις 22:14. Κανείς δεν μιλά.",
}));
export const briefIdentifier = "NEA-COM-06";
export const companyName = "Νήμα Επικοινωνίας";
export const clientName = "Ακτή Κατασκευές";