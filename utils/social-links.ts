/**
 * Utilidades para manejar enlaces a redes sociales
 */

// Número de WhatsApp sin el signo +
const WHATSAPP_NUMBER = "584125086548";

/**
 * Abre el chat de WhatsApp en una nueva pestaña
 */
export const openWhatsApp = (): void => {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
};

/**
 * Abre el chat de WhatsApp con un mensaje predefinido
 * @param message Mensaje predefinido para enviar
 */
export const openWhatsAppWithMessage = (message: string): void => {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
};
