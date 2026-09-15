import astrologyWheel from "@/assets/astrology-wheel.jpg";
import tarotHands from "@/assets/tarot-hands.jpg";
import onlineReading from "@/assets/online-reading.jpg";

export interface Post {
  slug: string;
  cat: string;
  title: string;
  img: string;
  alt: string;
  text: string;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "the-fool-new-beginnings",
    cat: "Tarot Meanings",
    title: "The Fool: Embracing New Beginnings Without Fear",
    img: tarotHands,
    alt: "Hands laying out tarot cards for a reading of The Fool",
    text: "The Fool is the most misunderstood card in the Major Arcana. Far from representing foolishness, it carries the energy of pure potential.",
    body: [
      "The Fool stands at the very beginning of the Major Arcana, numbered zero — the moment before the first step, when every path is still open. Far from representing foolishness, the card carries the energy of pure potential.",
      "When The Fool appears in a reading, it usually answers a question about a beginning: a move, a relationship, a career change, a decision that feels larger than the information available. The card does not promise an easy road. It suggests that the leap itself is the lesson.",
      "In a practical reading, look at the cards surrounding The Fool. Beside cups, the beginning is emotional. Beside pentacles, it concerns work or money. Beside swords, a decision must be spoken aloud before it can move.",
    ],
  },
  {
    slug: "mercury-retrograde-meaning",
    cat: "Astrology",
    title: "Mercury Retrograde: What It Actually Means for You",
    img: astrologyWheel,
    alt: "An astrology wheel showing planetary positions and zodiac signs",
    text: "There is more to Mercury retrograde than communication breakdowns and old situations returning.",
    body: [
      "Mercury retrograde is the period when Mercury appears to move backwards through the zodiac from our vantage point on Earth. It happens three or four times a year, for roughly three weeks each time.",
      "Mercury governs communication, contracts, travel and the small mechanics of daily life. During the retrograde these areas often ask for a second look rather than a fresh start — reread the message, confirm the booking, revisit the conversation you left unfinished.",
      "The most useful approach is not avoidance but attention. Sign what must be signed, but read it twice. Travel if you must, but leave margin. Old names resurfacing are an invitation to close something, not always to reopen it.",
    ],
  },
  {
    slug: "lunar-phases-tarot-practice",
    cat: "Tarot & Astrology",
    title: "Reading the Moon: How Lunar Phases Amplify Your Tarot Practice",
    img: onlineReading,
    alt: "A candlelit desk set up for an online tarot reading",
    text: "The moon has guided mystics, farmers, and lovers for millennia. Aligning your tarot practice adds deeper rhythm.",
    body: [
      "The moon moves through its full cycle in about twenty-nine and a half days, and each phase carries a distinct quality that a tarot practice can borrow.",
      "At the new moon, pull for intentions: what wants to begin. Through the waxing phase, pull for what needs feeding. At the full moon, pull for what is now visible — this is the clearest moment for questions you have avoided. Through the waning phase, pull for release.",
      "Keeping a simple lunar journal for three cycles is enough to see the pattern. The cards do not change, but the questions you bring to them do.",
    ],
  },
  {
    slug: "the-tower-card-meaning",
    cat: "Tarot Meanings",
    title: "The Tower Card: Why Destruction Is Sometimes the Greatest Gift",
    img: tarotHands,
    alt: "Tarot cards spread on dark cloth illustrating The Tower",
    text: "No card creates more fear than The Tower. Yet its message is one of release, truth, and renewal.",
    body: [
      "The Tower shows a structure struck by lightning, its occupants falling. Understandably, no card in the deck creates more fear when it lands on the table.",
      "What The Tower describes is a structure that was already unsound. The lightning reveals rather than causes. In readings it often arrives alongside relief — the job you knew you had outgrown, the arrangement that only held together through effort.",
      "The kind approach to a Tower reading is to ask what is actually falling and what remains standing. Almost always, more remains than the querent expects.",
    ],
  },
  {
    slug: "venus-in-your-birth-chart",
    cat: "Astrology",
    title: "Venus in Your Birth Chart: Love, Beauty, and What You Truly Value",
    img: astrologyWheel,
    alt: "A birth chart wheel highlighting the position of Venus",
    text: "Venus reveals how you attract and experience love, what brings you joy, and what you consider beautiful.",
    body: [
      "Venus in a birth chart describes how you love rather than whom. Its sign shows the texture of your affection; its house shows the area of life where you seek beauty and ease.",
      "Venus in an earth sign tends to express love through reliability and shared resources. In water, through emotional attunement. In air, through conversation and shared ideas. In fire, through enthusiasm and pursuit.",
      "Reading Venus alongside the Lovers or the Two of Cups in a tarot spread often clarifies a relationship question faster than either method alone.",
    ],
  },
  {
    slug: "daily-tarot-practice",
    cat: "Practice & Ritual",
    title: "How to Build a Daily Tarot Practice That Actually Sticks",
    img: onlineReading,
    alt: "A single tarot card and notebook laid out for a daily practice",
    text: "A daily tarot practice is one of the most transformative habits a seeker can develop.",
    body: [
      "Most daily tarot practices fail because they are too ambitious. A three-card spread with written interpretation every morning is a project, not a habit.",
      "Start with one card and one sentence. Draw before the day begins, write a single line about what the card might be pointing at, and close the notebook. The whole practice takes ninety seconds.",
      "After a month, read the sentences back. The value of the practice is rarely in any single day's card — it is in the pattern that becomes visible only across weeks.",
    ],
  },
];

export const categories = ["All", "Tarot Meanings", "Astrology", "Tarot & Astrology", "Practice & Ritual"];
