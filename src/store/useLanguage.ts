import { create } from "zustand";

export type Lang = "en" | "ru";

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const useLanguage = create<Store>((set) => ({
  lang: "en",
  setLang: (l) => set({ lang: l }),
}));

export const T = {
  en: {
    nav: {
      portfolio: "Portfolio",
      manifesto: "Approach",
      contact: "Contact",
      hire: "Hire Me",
    },
    hero: {
      status: "Available for projects",
      title1: "Video Editing & Motion",
      title2: "that holds",
      sells: "[ attention ]",
      sub1: "Pacing and visual accents",
      sub2: "that stop scrolling.",
      sub3: "Turning viewers into",
      buyers: "subscribers",
      viewPortfolio: "View Portfolio",
      getInTouch: "Get In Touch",
      scroll: "Scroll Down",
    },
    manifesto: {
      title: "Approach",
      text1Pre: "I focus on",
      red1: "retention",
      text1Mid: ". Not just cuts, but proper",
      red2: "pacing",
      text1End:
        ". Documentaries, brands, YouTube. Every graphic element serves the",
      tochno: "result",
      text2:
        "Editing in DaVinci Resolve. I structure raw footage into fast-paced videos that keep viewers watching until the end screen.",
    },
    portfolio: {
      label: "// Selected Works //",
      title: "Portfolio.",
      all: "ALL",
      reels: "REELS / SHORTS",
      longform: "YOUTUBE LONG",
      commercial: "COMMERCIALS",
    },
    cta: {
      label: "// Contact //",
      title1: "Let's discuss",
      title2: "your",
      now: "project.",
      sub: "We'll build visuals that look premium, drive engagement, and make your audience stay.",
    },
  },
  ru: {
    nav: {
      portfolio: "Портфолио",
      manifesto: "Подход",
      contact: "Контакты",
      hire: "Нанять",
    },
    hero: {
      status: "Открыт для проектов",
      title1: "Монтаж и моушн-дизайн",
      title2: "которые держат",
      sells: "[ внимание ]",
      sub1: "Пейсинг и визуальные акценты",
      sub2: "для высокого удержания.",
      sub3: "Конвертирую просмотры в",
      buyers: "продажи",
      viewPortfolio: "Смотреть работы",
      getInTouch: "Связаться",
      scroll: "Листай вниз",
    },
    manifesto: {
      title: "Подход",
      text1Pre: "Я работаю на",
      red1: "удержание",
      text1Mid: ". Не просто режу кадры, а выстраиваю",
      red2: "пейсинг",
      text1End: ". Документалки, бренды, YouTube. Вся графика работает на",
      tochno: "результат",
      text2:
        "Монтирую в DaVinci Resolve. Выстраиваю из сырого материала плотную структуру, которая не даёт зрителю закрыть видео до самых титров.",
    },
    portfolio: {
      label: "// Избранные работы //",
      title: "Проекты.",
      all: "ВСЕ",
      reels: "REELS / SHORTS",
      longform: "YOUTUBE",
      commercial: "РЕКЛАМА",
    },
    cta: {
      label: "// Сотрудничество //",
      title1: "Обсудим",
      title2: "твой",
      now: "проект.",
      sub: "Сделаем визуал, который работает на метрики: вовлекает аудиторию и конвертирует просмотры в целевые действия.",
    },
  },
};
