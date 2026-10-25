

/**
 * Wajelwa rule-based chatbot.
 * Uses fuzzy keyword matching so typos and phrasing variations still hit
 * the correct reply. No external AI service — deterministic and offline.
 */

// ---------------------------------------------------------------------------
// Fuzzy scoring: Levenshtein distance for typo tolerance
// ---------------------------------------------------------------------------

function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length;
    const bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    const prev = new Array(bl + 1);
    const curr = new Array(bl + 1);

    for (let j = 0; j <= bl; j++) prev[j] = j;

    for (let i = 1; i <= al; i++) {
        curr[0] = i;
        for (let j = 1; j <= bl; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(
                curr[j - 1] + 1,
                prev[j] + 1,
                prev[j - 1] + cost
            );
        }
        for (let j = 0; j <= bl; j++) prev[j] = curr[j];
    }

    return prev[bl];
}

// A word "matches" a keyword if it is close enough. Short keywords require
// an exact match, longer keywords allow up to 2 typos.
function wordMatches(word, keyword) {
    if (word === keyword) return true;
    if (keyword.length < 5) return false;
    const tolerance = keyword.length < 8 ? 1 : 2;
    return levenshtein(word, keyword) <= tolerance;
}

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------

const KNOWLEDGE = [
    {
        id: 'greeting',
        patterns: ['hi', 'hello', 'hey', 'hiya', 'howzit', 'greetings'],
        reply:
            "Hello! Welcome to Wajelwa. I can help with shipping, returns, sizing, payment, orders, and product questions. What would you like to know?",
        followUps: ['Shipping info', 'Return policy', 'Sizing guide']
    },
    {
        id: 'shipping',
        patterns: ['shipping', 'delivery', 'deliver', 'courier', 'postnet', 'pudo', 'dispatch'],
        reply:
            "We offer free shipping on orders over R500. Standard delivery takes 3–5 business days anywhere in South Africa. Orders under R500 have a flat R50 fee. You'll receive a tracking number by email once your order ships.",
        followUps: ['Track my order', 'Return policy']
    },
    {
        id: 'returns',
        patterns: ['return', 'refund', 'exchange', 'send back', 'money back'],
        reply:
            "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached. Once we receive the item, refunds are processed within 5–7 business days. To start a return, email hello@wajelwa.co.za.",
        followUps: ['Shipping info', 'Contact support']
    },
    {
        id: 'tracking',
        patterns: ['track', 'tracking', 'order status', 'where is my order', 'my order', 'shipped'],
        reply:
            "You can track your order by clicking 'Orders' in the navigation bar after logging in. Each order shows a visual timeline from Placed → Processing → Shipped → Delivered. If nothing changes within 48 hours after an update, contact support.",
        followUps: ['Contact support']
    },
    {
        id: 'sizing',
        patterns: ['size', 'sizing', 'fit', 'small', 'medium', 'large', 'xl', 'xxl', 'runs big', 'runs small'],
        reply:
            "Our t-shirts and hoodies follow standard South African sizing from XS to 3XL. For a relaxed fit, order your usual size. For a fitted look, size down. Full measurements are on each product page.",
        followUps: ['Product info', 'Shipping info']
    },
    {
        id: 'payment',
        patterns: ['payment', 'pay', 'card', 'eft', 'paypal', 'stripe', 'checkout', 'secure'],
        reply:
            "We accept all major credit and debit cards via Stripe. Payments are processed securely and we never store card details on our servers. If a payment fails, try a different card or contact your bank.",
        followUps: ['Shipping info', 'Contact support']
    },
    {
        id: 'products',
        patterns: ['product', 'shirt', 'tshirt', 't-shirt', 'tee', 'hoodie', 'design', 'print', 'collection', 'drop'],
        reply:
            "We specialise in designer printed t-shirts and hoodies. Every piece is premium quality with unique prints you won't find elsewhere. Browse the full collection under 'Shop' in the navigation bar.",
        followUps: ['Sizing guide', 'Shipping info']
    },
    {
        id: 'contact',
        patterns: ['contact', 'support', 'help', 'human', 'agent', 'email', 'whatsapp', 'phone'],
        reply:
            "You can reach us at hello@wajelwa.co.za or via WhatsApp on +27 71 000 0000. We reply within 24 hours on business days. For order-specific issues, log in and check your Orders page first — it usually has the answer.",
        followUps: ['Track my order', 'Return policy']
    },
    {
        id: 'pricing',
        patterns: ['price', 'cost', 'how much', 'expensive', 'cheap', 'afford'],
        reply:
            "T-shirts start at R199 and hoodies from R499. Prices are shown on every product page. Join our newsletter at the bottom of the homepage for early access to sales.",
        followUps: ['Product info', 'Shipping info']
    },
    {
        id: 'discounts',
        patterns: ['discount', 'promo', 'voucher', 'coupon', 'sale', 'special', 'deal'],
        reply:
            "Sign up for the newsletter on the homepage for exclusive offers. We also announce sales on Instagram @wajelwa and Facebook.",
        followUps: ['Product info']
    },
    {
        id: 'cart',
        patterns: ['cart', 'basket', 'add to cart', 'checkout'],
        reply:
            "To add an item: open a product, choose your colour and size, then click 'Add to Cart'. You can review everything under the Cart icon. You'll need to be logged in to check out.",
        followUps: ['Payment info', 'Shipping info']
    },
    {
        id: 'account',
        patterns: ['account', 'register', 'sign up', 'login', 'password', 'forgot', 'sign in'],
        reply:
            "Creating an account is free — click 'Register' in the top right. If you forget your password, use 'Forgot Password' on the login page and we'll email you a reset link.",
        followUps: ['Payment info']
    },
    {
        id: 'wishlist',
        patterns: ['wishlist', 'favourite', 'favorite', 'save for later', 'heart'],
        reply:
            "Tap the heart icon on any product to save it to your wishlist. You can open your wishlist any time from the heart in the navigation bar.",
        followUps: ['Product info']
    },
    {
        id: 'brand',
        patterns: ['wajelwa', 'who are you', 'about you', 'the brand', 'your story', 'company'],
        reply:
            "Wajelwa is a South African designer clothing brand focused on prints that stand out. We started on WhatsApp and Facebook and now run our own online store. Read the full story under 'About Us'.",
        followUps: ['Product info', 'Contact support']
    },
    {
        id: 'thanks',
        patterns: ['thanks', 'thank you', 'thx', 'cheers', 'appreciate'],
        reply: "You're welcome! Anything else I can help with?",
        followUps: []
    },
    {
        id: 'bye',
        patterns: ['bye', 'goodbye', 'see you', 'later', 'cheers'],
        reply: "Thanks for stopping by Wajelwa. Come back any time!",
        followUps: []
    }
];

const FALLBACK =
    "I'm not sure I understand that one. I can help with shipping, returns, order tracking, sizing, payment, products, and contact details. Try asking something like 'how long is delivery?' or 'what's your return policy?'";

const GREETING_WORDS = ['hi', 'hello', 'hey', 'hiya', 'howzit'];

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function tokenize(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s'-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

function scoreEntry(tokens, entry) {
    let score = 0;
    for (const keyword of entry.patterns) {
        const keywordLower = keyword.toLowerCase();
        const keywordParts = keywordLower.split(/\s+/);

        // multi-word pattern: match as a phrase
        if (keywordParts.length > 1) {
            const phrase = keywordParts.join(' ');
            const joined = tokens.join(' ');
            if (joined.includes(phrase)) score += 5;
            continue;
        }

        // single-word pattern: fuzzy match against each token
        for (const token of tokens) {
            if (wordMatches(token, keywordLower)) {
                score += keywordLower.length >= 6 ? 3 : 2;
                break;
            }
        }
    }
    return score;
}

function bestMatch(message) {
    const tokens = tokenize(message);
    if (tokens.length === 0) return null;

    // Pure greeting
    if (tokens.length <= 3 && tokens.some(t => GREETING_WORDS.includes(t))) {
        return KNOWLEDGE.find(e => e.id === 'greeting');
    }

    let best = null;
    let bestScore = 0;

    for (const entry of KNOWLEDGE) {
        const score = scoreEntry(tokens, entry);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }

    return bestScore > 0 ? best : null;
}

function composeReply(message, history) {
    const entry = bestMatch(message);

    if (!entry) {
        return {
            reply: FALLBACK,
            followUps: ['Shipping info', 'Return policy', 'Track my order']
        };
    }

    return {
        reply: entry.reply,
        followUps: entry.followUps
    };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body || {};

        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ message: 'Message is required.' });
        }

        if (message.length > 1000) {
            return res.status(400).json({ message: 'Message is too long.' });
        }

        const result = composeReply(message);

        return res.json(result);

    } catch (error) {
        console.error('Chatbot error:', error);
        return res.status(500).json({ message: 'Chatbot is temporarily unavailable.' });
    }
};

module.exports = { sendMessage };