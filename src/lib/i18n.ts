import type { DurationBucket, FlatStatus, Language } from "./models";

export type TranslationKey =
  | "houseName"
  | "entryDate"
  | "session"
  | "theme"
  | "dark"
  | "light"
  | "language"
  | "english"
  | "traditionalChinese"
  | "floorsOneToSixteen"
  | "floorsSeventeenToThirtyOne"
  | "slideOne"
  | "slideTwo"
  | "slideThree"
  | "livePolling"
  | "entry"
  | "exit"
  | "pax"
  | "casStaff"
  | "casStaffNo"
  | "medicalNecessity"
  | "buildingSummary"
  | "realTimeStats"
  | "totalRegFlatsToday"
  | "totalPaxToday"
  | "activeFlats"
  | "activePax"
  | "completedFlats"
  | "completedPax"
  | "luggageLegend"
  | "dataSourceUnavailable"
  | "unableToLoad"
  | "pause"
  | "play"
  | "previousSlide"
  | "nextSlide"
  | "chartFlatStatus"
  | "chartDurationDistribution"
  | "chartCsaInFlatDuration"
  | "chartCsaStaffCount"
  | "statusNotStarted"
  | "statusVisiting"
  | "statusCompleted"
  | "noData"
  | "staffCountLabel"
  | "minutesShort";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    houseName: "House Name",
    entryDate: "Entry Date",
    session: "AM/PM",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    english: "English",
    traditionalChinese: "繁體中文",
    floorsOneToSixteen: "Floors 1-16",
    floorsSeventeenToThirtyOne: "Floors 17-31",
    slideOne: "Slide 1",
    slideTwo: "Slide 2",
    slideThree: "Slide 3",
    livePolling: "Live Google Sheets polling every 60s",
    entry: "Entry",
    exit: "Exit",
    pax: "Pax",
    casStaff: "CAS staff",
    casStaffNo: "CAS no.",
    medicalNecessity: "Medical Necessity",
    buildingSummary: "Building Summary",
    realTimeStats: "Real-time movement statistics",
    totalRegFlatsToday: "Total Reg Flats Today",
    totalPaxToday: "Total Pax Today",
    activeFlats: "Active Flats",
    activePax: "Active Pax",
    completedFlats: "Completed Flats",
    completedPax: "Completed Pax",
    luggageLegend: "Purple indicates more than 6 luggage items. Green indicates more than 4 luggage items.",
    dataSourceUnavailable: "Data source unavailable",
    unableToLoad: "Unable to load movement data",
    pause: "Pause",
    play: "Play",
    previousSlide: "Previous",
    nextSlide: "Next",
    chartFlatStatus: "Flat Status",
    chartDurationDistribution: "Duration Distribution",
    chartCsaInFlatDuration: "CSA Staff In-Flat Duration",
    chartCsaStaffCount: "CSA Staff Count Distribution",
    statusNotStarted: "Not registered",
    statusVisiting: "Packing",
    statusCompleted: "Completed",
    noData: "No data",
    staffCountLabel: "staff",
    minutesShort: " min"
  },
  "zh-Hant": {
    houseName: "樓宇名稱",
    entryDate: "進入日期",
    session: "上午/下午",
    theme: "主題",
    dark: "深色",
    light: "淺色",
    language: "語言",
    english: "English",
    traditionalChinese: "繁體中文",
    floorsOneToSixteen: "1至16樓",
    floorsSeventeenToThirtyOne: "17至31樓",
    slideOne: "第1頁",
    slideTwo: "第2頁",
    slideThree: "第3頁",
    livePolling: "每60秒從 Google Sheets 更新",
    entry: "進入",
    exit: "離開",
    pax: "人數",
    casStaff: "民安隊人數",
    casStaffNo: "民安隊編號",
    medicalNecessity: "醫療需要",
    buildingSummary: "樓宇總覽",
    realTimeStats: "即時出入統計",
    totalRegFlatsToday: "今日可訪單位",
    totalPaxToday: "今日總人數",
    activeFlats: "正在訪問單位",
    activePax: "正在訪問人數",
    completedFlats: "已完成單位",
    completedPax: "已完成人數",
    luggageLegend: "紫色代表行李超過6件。綠色代表行李超過4件。",
    dataSourceUnavailable: "資料來源未能使用",
    unableToLoad: "未能載入出入資料",
    pause: "暫停",
    play: "播放",
    previousSlide: "上一頁",
    nextSlide: "下一頁",
    chartFlatStatus: "單位狀態",
    chartDurationDistribution: "停留時間分佈",
    chartCsaInFlatDuration: "民安隊在單位時間分佈",
    chartCsaStaffCount: "民安隊人數分佈",
    statusNotStarted: "未登記",
    statusVisiting: "收拾中",
    statusCompleted: "已完成",
    noData: "無資料",
    staffCountLabel: "人",
    minutesShort: "分鐘"
  }
};

const HOUSE_NAME_ZH: Record<string, string> = {
  "Wang Yan House": "宏仁閣",
  "Wang Tao House": "宏道閣",
  "Wang Sun House": "宏新閣",
  "Wang Kin House": "宏建閣",
  "Wang Tai House": "宏泰閣",
  "Wang Cheong House": "宏昌閣",
  "Wang Shing House": "宏盛閣",
  "Wang Chi House": "宏志閣"
};

export function translateHouseName(language: Language, houseName: string): string {
  if (language === "zh-Hant" && HOUSE_NAME_ZH[houseName]) {
    return HOUSE_NAME_ZH[houseName];
  }
  return houseName;
}

export function formatFloorLabel(language: Language, floor: number): string {
  return language === "zh-Hant" ? `${floor}樓` : `${floor}/F`;
}

export function formatUnitLabel(language: Language, unit: number): string {
  const padded = unit.toString().padStart(2, "0");
  return language === "zh-Hant" ? `${padded}室` : `Unit ${padded}`;
}

const FLAT_STATUS_KEY: Record<FlatStatus, TranslationKey> = {
  "Not Started": "statusNotStarted",
  Visiting: "statusVisiting",
  Completed: "statusCompleted"
};

export function translateFlatStatus(language: Language, status: FlatStatus): string {
  return translations[language][FLAT_STATUS_KEY[status]];
}

export function formatDurationBucket(language: Language, bucket: DurationBucket): string {
  const m = translations[language].minutesShort;
  if (bucket === "180+") return `180${m}+`;
  return `${bucket}${m}`;
}
