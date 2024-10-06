import CryptoES from "crypto-es";

const secretKey = "your-secret-key"; // Replace with a secure key, preferably stored in environment variables

export const encrypt = (text) => {
  try {
    const ciphertext = CryptoES.AES.encrypt(text, secretKey).toString();
    return btoa(ciphertext); // Base64 encode the result
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decrypt = (encryptedText) => {
  try {
    const ciphertext = atob(encryptedText); // Base64 decode the input
    const bytes = CryptoES.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoES.enc.Utf8);
    if (!originalText) {
      throw new Error("Decryption resulted in empty string");
    }
    return originalText;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
