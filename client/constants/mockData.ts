export type JournalEntry = {
  id: string;
  dateLabel: string;
  duration: string;
  mood: "😊" | "😔" | "😤" | "🙏" | "😴";
  transcript: string;
  refined: string;
  summary: string[];
  tags: string[];
  aiInsight: string;
};

export type DailyPrompt = {
  id: string;
  category: "Reflection" | "Gratitude" | "Growth";
  text: string;
};

export const tagOptions = [
  "#gratitude",
  "#work",
  "#family",
  "#growth",
  "#anxiety",
] as const;

export const dailyPrompts: DailyPrompt[] = [
  {
    id: "p1",
    category: "Reflection",
    text: "What moment today made you feel most alive?",
  },
  {
    id: "p2",
    category: "Gratitude",
    text: "Who or what are you grateful for right now, and why?",
  },
  {
    id: "p3",
    category: "Growth",
    text: "What challenge today helped you grow, even a little?",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "1",
    dateLabel: "Mon, Apr 21 • 9:41 AM",
    duration: "3:12",
    mood: "😊",
    transcript:
      "I had a surprisingly calm morning and finished the task I kept delaying.",
    refined:
      "I had a calm morning and completed a long-delayed task, which boosted my confidence.",
    summary: [
      "Started the day with focus and calm.",
      "Completed a delayed task.",
      "Felt more confident afterward.",
    ],
    tags: ["#work", "#growth"],
    aiInsight:
      "You seem to be building momentum through small wins. Protect your morning focus block.",
  },
  {
    id: "2",
    dateLabel: "Tue, Apr 22 • 7:08 PM",
    duration: "2:34",
    mood: "🙏",
    transcript:
      "Dinner with family felt grounding, and I noticed I was less anxious than usual.",
    refined:
      "Family time at dinner felt grounding and noticeably reduced my anxiety.",
    summary: [
      "Family interaction felt restorative.",
      "Anxiety levels were lower than usual.",
      "Ended the evening with gratitude.",
    ],
    tags: ["#family", "#gratitude"],
    aiInsight:
      "Connection appears to regulate your stress. Consider adding a short daily check-in ritual.",
  },
  {
    id: "3",
    dateLabel: "Wed, Apr 23 • 11:22 PM",
    duration: "4:01",
    mood: "😴",
    transcript:
      "I am mentally exhausted and need to sleep earlier this week.",
    refined:
      "I feel mentally exhausted and want to prioritize earlier sleep this week.",
    summary: [
      "Energy is low tonight.",
      "Sleep schedule needs attention.",
      "Clear intent to recover.",
    ],
    tags: ["#work", "#growth"],
    aiInsight:
      "Fatigue is showing up consistently. A strict 10 PM wind-down could improve your baseline mood.",
  },
  {
    id: "4",
    dateLabel: "Thu, Apr 24 • 8:03 AM",
    duration: "1:58",
    mood: "😊",
    transcript:
      "Quick walk and sunlight helped me feel fresh before meetings.",
    refined:
      "A short walk and sunlight helped me feel fresh before meetings.",
    summary: [
      "Morning movement improved mood.",
      "Felt prepared for meetings.",
      "Small habits are working.",
    ],
    tags: ["#growth", "#gratitude"],
    aiInsight:
      "Your mood responds strongly to movement and light. Keep this as a non-negotiable habit.",
  },
  {
    id: "5",
    dateLabel: "Fri, Apr 25 • 6:27 PM",
    duration: "5:10",
    mood: "😤",
    transcript:
      "Work felt chaotic today and I kept switching tasks without finishing.",
    refined:
      "Work felt chaotic; frequent task-switching reduced my ability to finish important items.",
    summary: [
      "High mental load at work.",
      "Frequent context switching.",
      "Needs a clearer task boundary strategy.",
    ],
    tags: ["#work", "#anxiety"],
    aiInsight:
      "You seem to be processing work stress. Try a 25-minute single-task block with notifications off.",
  },
  {
    id: "6",
    dateLabel: "Sat, Apr 26 • 10:15 AM",
    duration: "2:49",
    mood: "😔",
    transcript:
      "I felt a bit low this morning but journaling made things lighter.",
    refined:
      "I started the morning feeling low, but journaling helped me process emotions and feel lighter.",
    summary: [
      "Morning mood was low.",
      "Journaling improved emotional clarity.",
      "Felt lighter after reflection.",
    ],
    tags: ["#anxiety", "#growth"],
    aiInsight:
      "Naming emotions helped reduce their intensity. Keep using journaling as emotional first-aid.",
  },
];
