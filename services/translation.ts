/**
 * Servicio de traducción utilizando LibreTranslate API
 * Instancia local: http://localhost:5000
 */

// Códigos de idioma soportados por LibreTranslate
export type SupportedLanguage = 'es' | 'en' | 'fr' | 'it';

// URL base de la API local
const LIBRETRANSLATE_API_URL = 'https://api-translate.jvserver.com/translate';
console.log("Servicio de traducción configurado con URL:", LIBRETRANSLATE_API_URL);

/**
 * Traduce un texto de un idioma a otro
 * @param text Texto a traducir
 * @param source Idioma de origen (código ISO)
 * @param target Idioma de destino (código ISO)
 * @returns Texto traducido
 */
export async function translateText(
  text: string,
  source: SupportedLanguage | 'auto',
  target: SupportedLanguage
): Promise<string> {
  try {
    console.log(`Traduciendo texto de ${source} a ${target}:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
    const response = await fetch(LIBRETRANSLATE_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la traducción (${response.status}):`, errorText);
      throw new Error(`Error en la traducción: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Texto traducido de ${source} a ${target}:`, data.translatedText.substring(0, 50) + (data.translatedText.length > 50 ? '...' : ''));
    return data.translatedText;
  } catch (error) {
    console.error('Error detallado al traducir texto:', error);
    // En caso de error, devolvemos el texto original
    return text;
  }
}

/**
 * Traduce un objeto con campos de texto a múltiples idiomas
 * @param obj Objeto con campos de texto
 * @param sourceLanguage Idioma de origen
 * @param targetLanguages Lista de idiomas destino
 * @param fieldsToTranslate Lista de campos a traducir
 * @returns Objeto con traducciones
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  sourceLanguage: SupportedLanguage,
  targetLanguages: SupportedLanguage[],
  fieldsToTranslate: (keyof T)[]
): Promise<{ [key in SupportedLanguage]?: Partial<T> }> {
  const translations: { [key in SupportedLanguage]?: Partial<T> } = {};

  // Para cada idioma destino
  for (const targetLang of targetLanguages) {
    // Si el idioma destino es igual al origen, saltamos
    if (targetLang === sourceLanguage) continue;

    const translatedObj: Partial<T> = {};

    // Para cada campo a traducir
    for (const field of fieldsToTranslate) {
      if (obj[field] && typeof obj[field] === 'string') {
        // Traducir el campo
        const translatedText = await translateText(
          obj[field] as string,
          sourceLanguage,
          targetLang
        );
        translatedObj[field] = translatedText as any;
      } else if (Array.isArray(obj[field])) {
        // Si es un array (como tags o achievements), traducimos cada elemento
        const translatedArray = await Promise.all(
          obj[field].map((item: string) =>
            typeof item === 'string'
              ? translateText(item, sourceLanguage, targetLang)
              : item
          )
        );
        translatedObj[field] = translatedArray as any;
      }
    }

    translations[targetLang] = translatedObj;
  }

  return translations;
}

/**
 * Traduce un objeto y añade las traducciones en el campo 'translations'
 * @param obj Objeto a traducir
 * @param sourceLanguage Idioma de origen
 * @param targetLanguages Idiomas destino
 * @param fieldsToTranslate Campos a traducir
 * @returns Objeto con campo translations añadido
 */
export async function translateAndAddToObject<T extends Record<string, any>>(
  obj: T,
  sourceLanguage: SupportedLanguage = 'es',
  targetLanguages: SupportedLanguage[] = ['en', 'fr', 'it'],
  fieldsToTranslate: (keyof T)[]
): Promise<T & { translations: { [key in SupportedLanguage]?: Partial<T> } }> {
  console.log(`Iniciando traducción de objeto desde ${sourceLanguage} a [${targetLanguages.join(', ')}]`);
  console.log(`Campos a traducir:`, fieldsToTranslate);
  console.log(`Objeto original:`, obj);
  
  // Obtener traducciones
  const translations = await translateObject(
    obj,
    sourceLanguage,
    targetLanguages,
    fieldsToTranslate
  );
  
  console.log(`Traducciones generadas:`, translations);

  // Devolver objeto con traducciones
  const result = {
    ...obj,
    translations: translations as any
  };
  
  console.log(`Objeto final con traducciones:`, result);
  return result;
}
