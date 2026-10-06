/* =========================================================
   EDIT ME: everything personal lives here.
   Change names, dates and game content, then refresh.
   ========================================================= */
window.MAG = {
  // Masthead + issue details
  title: "VOGUE",
  issue: "October 2026",
  edition: "The Anniversary Issue",
  months: "Six",           // shown in headlines ("Six Months of Us")
  monthsNum: 6,

  // The two of you
  nameA: "Ziyad",
  nameB: "Fatima",

  // The day you became official (YYYY-MM-DD). Powers the "By the Numbers" page.
  together: "2026-04-07",

  // Placeholder shown until you drop real photos into /images
  mockup: "assets/mockup.jpg",
  // Exact file for each photo slot (in the images folder).
  // If a slot is missing here, the site tries images/imageN.png/.jpg/.jpeg/.webp.
  images: {
    1: "image1.jpeg",
    2: "image2.jpg",
    3: "image3.jpg",
    4: "image4.jpeg",
    5: "image5.jpeg",
    6: "image6.jpeg",
    7: "image7.jpeg",
    8: "image8.jpeg",
    9: "image9.jpeg",
    10: "image10.jpeg",
    11: "image11.jpg",
    12: "image12.jpg",
    13: "image13.jpg",
    14: "image14.jpeg",
    15: "image15.jpeg",
    16: "image3.jpg",   // reuses image 3
    17: "image17.jpeg",
    18: "image18.jpeg",
    19: "image19.jpeg",
    20: "image20.jpeg",
    21: "image21.jpeg",
    22: "image22.png",
    23: "image23.png",
    24: "image24.png",
    25: "image25.jpeg",
    26: "image26.jpeg",
    27: "image27.jpeg",
    28: "image28.jpeg",
    29: "image29.png",
    30: "image30.jpeg",
    31: "image31.jpeg",
    32: "image32.jpeg",
    33: "image33.jpeg",
    34: "image34.jpg",
    35: "image35.jpeg",
    36: "image36.jpeg"
  },
  imageExts: ["png", "jpg", "jpeg", "webp", "PNG", "JPG", "JPEG"],

  /* ---------- THE RECORD ----------
     Tapping the record plays this file. If it ever fails to load,
     it falls back to the official YouTube upload in a small player.  */
  song: {
    title: "The Cuppycake Song",
    artist: "Amy Castle",
    file: "audio/The_Cuppy_Cake_Song-639983-mobiles24.mp3",
    youtubeId: "12Z6pWhM6TA"
  },

  /* ---------- CROSSWORD ("How well do you know us?") ----------
     Just write answers + clues. The grid builds itself.          */
  crossword: [
    { answer: "FUNGHI",      clue: "Where we had our first date" },
    { answer: "BREW",        clue: "Our place (say hi to the waiter)" },
    { answer: "TURKEY",      clue: "Our dream destination" },
    { answer: "DIMPLES",     clue: "His best feature, officially" },
    { answer: "MINISO",      clue: "Ours and ours only" },
    { answer: "PEACH",       clue: "Our iced tea flavour" },
    { answer: "APRIL",       clue: "The month we became us" },
    { answer: "BANANABREAD", clue: "What the queen bakes best" },
    { answer: "DYLANBLUE",   clue: "Favourite smell (on you)" },
    { answer: "RAIN",        clue: "Every ___y day belongs a little to us" },
    { answer: "SIX",         clue: "Months we're celebrating" }
  ],

  /* ---------- WHO'S MORE LIKELY TO… ---------- */
  likely: [
    "Fall asleep during the movie they picked",
    "Say \"I'm not hungry\" and then steal the other's fries",
    "Get us lost because \"I know a shortcut\"",
    "Order the exact same thing at Brew again",
    "Start the argument and also end it with a hug",
    "Plan the Turkey trip at 1am",
    "Spend way too long in Miniso",
    "Remember every tiny detail of our first date",
    "Take 200 photos to get the one",
    "Say \"I love you\" first today"
  ],

  /* ---------- LOVE-OPOLY BOARD (20 squares, clockwise from START) ---------- */
  board: [
    { t: "Start With Love",   p: "Collect 1 kiss every time you pass START." },
    { t: "First Date",        p: "Recreate our Funghi order from memory." },
    { t: "Inside Jokes",      p: "Say our most ridiculous inside joke without laughing." },
    { t: "Brew Run",          p: "Name our usual order at Brew. Loser pays next time." },
    { t: "Movie Night",       p: "Pick tonight's movie. The loser makes the popcorn." },
    { t: "Holding Hands",     p: "Hold hands until your next turn." },
    { t: "Love Notes",        p: "Write a 3-word love note and hide it somewhere." },
    { t: "Peach Iced Tea",    p: "Loser buys the next round of peach iced tea." },
    { t: "Stolen Fries",      p: "Steal one (1) fry. TBC rules apply." },
    { t: "Rainy Day",         p: "Name your favourite rainy-day plan together." },
    { t: "Cuddle Jail",       p: "Stuck in cuddle jail. Skip a turn (and enjoy it)." },
    { t: "Dimples",           p: "Make Ziyad smile until the dimples show." },
    { t: "5PM Talks",         p: "Share a dream you've never said out loud." },
    { t: "Slow Dance",        p: "Slow dance to the next song that plays." },
    { t: "Free Kisses",       p: "Free parking, and free kisses." },
    { t: "Miniso Run",        p: "Plan our next Miniso trip. What are we buying?" },
    { t: "Turkey Trip",       p: "Plan day one of our Turkey trip, right now." },
    { t: "Dylan Blue",        p: "Describe how he smells. Be poetic." },
    { t: "Laughter",          p: "Make the other laugh in under 10 seconds." },
    { t: "Forever Promise",   p: "Make one tiny promise for the next six months." }
  ],

  /* ---------- BUCKET LIST ---------- */
  bucket: [
    "Go to Turkey together",
    "Bake banana bread together (the queen supervises)",
    "Try every sandwich on the Brew menu",
    "Watch the sunrise from a mountain top",
    "Road trip with no plan at all",
    "Dance in the rain (on purpose)",
    "Build a blanket fort and sleep in it",
    "Picnic under cherry blossoms",
    "See the northern lights",
    "Go back to Funghi on our one year"
  ],

  /* ---------- LOVE COUPONS ---------- */
  coupons: [
    { t: "Breakfast in Bed", s: "Pancakes, peach iced tea & zero responsibilities" },
    { t: "One Win-Any-Argument Card", s: "Valid once. Choose wisely." },
    { t: "A Funghi Date", s: "My treat. Same table if possible." },
    { t: "You Pick the Movie", s: "No complaints. Not even one." },
    { t: "A Miniso Spree", s: "Within reason. Mostly." },
    { t: "Unlimited Hugs", s: "Never expires" }
  ]
};
