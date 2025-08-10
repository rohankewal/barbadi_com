import { writable } from "svelte/store"

// Sample data for demonstration
const initialPosts = [
  {
    id: "1",
    title: "We barely talk anymore and I don't know how to fix it",
    content:
      "My husband and I have been married for 8 years, and lately it feels like we're just roommates. We used to talk for hours about everything and nothing, but now our conversations are limited to logistics - who's picking up the kids, what's for dinner, etc. I've tried bringing up deeper topics but he seems distracted or gives short responses. I miss the connection we used to have. Has anyone else experienced this? How did you work through it?",
    category: "communication",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    hearts: 12,
    replies: [
      {
        id: "r1",
        content:
          'I went through something very similar. What helped us was scheduling "phone-free" time together every evening, even if it was just 20 minutes. We started with small talk but gradually opened up more. It takes time but it\'s worth it.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        hearts: 5,
        anonymous: true,
      },
      {
        id: "r2",
        content:
          "Have you considered couples counseling? Sometimes having a neutral third party can help facilitate those deeper conversations. My partner and I were skeptical at first but it really helped us reconnect.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        hearts: 3,
        anonymous: true,
      },
    ],
    anonymous: true,
  },
  {
    id: "2",
    title: "Struggling with trust after discovering lies about finances",
    content:
      "I recently found out my spouse has been hiding debt from me for over a year. It's not a huge amount, but the fact that they lied repeatedly when I asked about our finances has shattered my trust. I don't know how to move forward. Part of me understands they were probably embarrassed, but I feel like our whole relationship is built on lies now. How do you rebuild trust after something like this?",
    category: "trust",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    hearts: 8,
    replies: [
      {
        id: "r3",
        content:
          "Trust can be rebuilt, but it takes time and complete transparency from both sides. My partner and I went through something similar. We had to have very uncomfortable conversations, but we came out stronger.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        hearts: 4,
        anonymous: true,
      },
    ],
    anonymous: true,
  },
  {
    id: "3",
    title: "Mother-in-law constantly criticizes how I parent our children",
    content:
      "Every time we visit my in-laws, my mother-in-law makes comments about how I'm raising our kids. She questions my decisions about screen time, bedtime, food choices, everything. My spouse says \"that's just how she is\" but it's affecting my mental health and making me dread family visits. I want our kids to have a relationship with their grandmother, but I also need to protect my own wellbeing. Any advice?",
    category: "family",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    hearts: 15,
    replies: [
      {
        id: "r4",
        content:
          "Your spouse needs to step up and set boundaries with their mother. This is their family, their responsibility to handle. You shouldn't have to deal with this alone.",
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        hearts: 8,
        anonymous: true,
      },
      {
        id: "r5",
        content:
          "I had a similar situation. What worked for me was having a calm, direct conversation with my MIL about how her comments made me feel. She didn't realize the impact. Sometimes they just need to hear it directly.",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        hearts: 6,
        anonymous: true,
      },
    ],
    anonymous: true,
  },
  {
    id: "4",
    title: "Feeling disconnected after having our first baby",
    content:
      "Our baby is 6 months old now and while we're both over the moon about being parents, I feel like my partner and I have become strangers. We're both exhausted, we barely have time for each other, and when we do talk it's usually about the baby or household stuff. I love our little family but I miss US. Is this normal? Will it get better?",
    category: "parenting",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    hearts: 9,
    replies: [
      {
        id: "r6",
        content:
          "This is SO normal! The first year is incredibly hard on relationships. It does get better as you both adjust and the baby sleeps more. Try to be patient with each other and remember you're both learning.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        hearts: 7,
        anonymous: true,
      },
    ],
    anonymous: true,
  },
  {
    id: "5",
    title: "Different spending habits causing constant arguments",
    content:
      "My partner is very frugal and I'm more of a spender. We've been together for 3 years and this has become a major source of conflict. They get upset when I buy things they consider unnecessary, and I feel controlled and judged. We've tried budgeting together but we can't seem to find a middle ground. How do couples with different money philosophies make it work?",
    category: "finances",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    hearts: 6,
    replies: [],
    anonymous: true,
  },
]

export const postsStore = writable(initialPosts)
