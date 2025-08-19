export interface Translations {
  // Main page
  title: string;
  subtitle: string;
  
  // Story generator
  createStory: string;
  storyContext: string;
  contextPlaceholder: string;
  contextDescription: string;
  generateButton: string;
  generatingButton: string;
  yourMagicalTale: string;
  copyStory: string;
  copied: string;
  endOfStory: string;
  
  // Toast messages
  storyCopiedTitle: string;
  storyCopiedDescription: string;
  copyFailedTitle: string;
  copyFailedDescription: string;
  
  // Error messages
  magicBreakMessage: string;
}

export const translations: Record<string, Translations> = {
  en: {
    title: "Magical Stories",
    subtitle: "Where imagination meets enchantment. Share your context and let us craft a fairy tale that will transport you to worlds beyond your dreams.",
    
    createStory: "Create Your Magical Story",
    storyContext: "Story Context",
    contextPlaceholder: "Enter your story context here... (e.g., 'a young dragon learns to fly', 'a magical library where books come alive', 'a village where everyone has forgotten how to laugh')",
    contextDescription: "Share a context, and watch as we weave it into an enchanting fairy tale!",
    generateButton: "Generate Magical Story",
    generatingButton: "Weaving Your Tale...",
    yourMagicalTale: "Your Magical Tale",
    copyStory: "Copy Story",
    copied: "Copied!",
    endOfStory: "✨ End of the story ✨",
    
    storyCopiedTitle: "Story copied!",
    storyCopiedDescription: "The magical tale has been copied to your clipboard.",
    copyFailedTitle: "Copy failed",
    copyFailedDescription: "Unable to copy the story. Please try again.",
    
    magicBreakMessage: "Oops! The magic seems to be taking a little break. Please try again in a moment!"
  },
  ru: {
    title: "Волшебные Истории",
    subtitle: "Где воображение встречается с волшебством. Поделитесь своим контекстом, и мы создадим сказку, которая перенесёт вас в миры за пределами ваших мечтаний.",
    
    createStory: "Создайте Свою Волшебную Историю",
    storyContext: "Контекст Истории",
    contextPlaceholder: "Введите контекст вашей истории здесь... (например, 'молодой дракон учится летать', 'волшебная библиотека, где книги оживают', 'деревня, где все забыли, как смеяться')",
    contextDescription: "Поделитесь контекстом, и смотрите, как мы превращаем его в очаровательную сказку!",
    generateButton: "Создать Волшебную Историю",
    generatingButton: "Создаём Вашу Сказку...",
    yourMagicalTale: "Ваша Волшебная Сказка",
    copyStory: "Копировать Историю",
    copied: "Скопировано!",
    endOfStory: "✨ Конец истории ✨",
    
    storyCopiedTitle: "История скопирована!",
    storyCopiedDescription: "Волшебная сказка была скопирована в ваш буфер обмена.",
    copyFailedTitle: "Не удалось скопировать",
    copyFailedDescription: "Не удаётся скопировать историю. Попробуйте снова.",
    
    magicBreakMessage: "Упс! Волшебство, кажется, немного отдыхает. Попробуйте снова через мгновение!"
  }
};