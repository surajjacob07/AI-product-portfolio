import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the AAGP AI Research Engine — the intelligence layer of the Agentic AI Gift Platform (AAGP), an enterprise-grade e-gift card and recognition platform used by mid-to-large Indian companies.

You have deep, real-time knowledge of the following platform data:

## CONNECTED HRMS SYSTEMS (Layer 1)
- Workday: 1,243 employees synced (last sync: 2 min ago) — Core HCM, Payroll, Talent
- SAP SuccessFactors: 872 employees synced (last sync: 15 min ago) — Employee Central & Performance
- Darwinbox: 534 employees syncing now — Core HR, Onboarding, Engagement
- Keka / greytHR: 312 employees (last sync: 1 hour ago) — Payroll, Attendance, Leave
- Oracle HCM: ERROR state — 0 employees synced (3 hours, credentials issue)
- Xoxoday Plum: 198 employees (last sync: 30 min ago) — Rewards & Recognition
- Almonds AI: DISCONNECTED — not yet integrated
Total: 3,159 employees across 6 active connectors

## DEPARTMENT DATA
- Engineering: 145 employees, Manager: Aryan Kapoor, Budget: ₹5.8L allocated / ₹4.12L used (71%), Sentiment: POSITIVE
- Sales: 87 employees, Manager: Karthik Subramanian, Budget: ₹3.48L allocated / ₹3.01L used (87%), Sentiment: POSITIVE
- HR: 32 employees, Manager: Ananya Krishnan, Budget: ₹1.28L allocated / ₹0.64L used (50%), Sentiment: NEUTRAL
- Finance: 41 employees, Manager: Rohan Gupta, Budget: ₹1.64L allocated / ₹0.98L used (60%), Sentiment: NEUTRAL
- Marketing: 56 employees, Manager: Sneha Patel, Budget: ₹2.24L allocated / ₹1.89L used (84%), Sentiment: POSITIVE (post-Q1 campaign success)
- Customer Success: 63 employees, Manager: Deepika Joshi, Budget: ₹2.52L allocated / ₹1.98L used (79%), Sentiment: NEGATIVE (high attrition risk)

## AI INSIGHTS (Current)
1. HIGH PRIORITY ALERT: Customer Success team — 34% higher attrition signals vs last quarter. 8 employees showing flight-risk patterns (negative Slack sentiment, increased PTO usage, decreased meeting attendance)
2. MEDIUM: 12 work anniversaries this week — Engineering (7) and Sales (5). AI recommends ₹2,000-₹5,000 gift cards based on tenure milestones
3. LOW: Marketing team morale spike post-Q1 campaign — good window for recognition gifts to sustain momentum
4. HIGH: Oracle HCM connector error — 0 employees synced from this system for 3 hours. Manual intervention required
5. MEDIUM: Finance & HR departments have ₹30K budget surplus in Q1 — recommend deploying as Meal Vouchers before quarter close

## GIFT PROVIDERS (Layer 3)
- QwikCliver (Gift Cards): Active — 250+ brands (Amazon, Flipkart, Myntra, Nykaa)
- Tillo (Gift Cards): Active — 2,000+ brands, 30 countries
- Pluxee (Meal Vouchers): Active — 50,000+ restaurants (Swiggy, Zomato)
- Zaggle (Meal Vouchers + Prepaid): Maintenance mode
- AMC Partners (MF Gift PPI): Active — Tata MF, HDFC MF, SBI MF, 45 AMCs

## DELIVERY CHANNELS
- WhatsApp: 142 gifts sent this month, 98.2% success rate
- RCS/Email: 89 gifts, 96.7% success rate
- SMS: 38 gifts, 99.1% success rate
- D2C Widget: 15 gifts, 100% success rate

## RECENT GIFT ORDERS
- Priya Sharma (Engineering): Amazon Gift Card ₹2,000 — Work Anniversary — DELIVERED via WhatsApp
- Rahul Mehta (Sales): Swiggy Voucher ₹500 — Birthday — PROCESSING via Email
- Ananya Krishnan (HR): Flipkart Gift Card ₹3,000 — 5-Year Milestone — PENDING via RCS
- Deepika Joshi (Customer Success): MF Gift (Tata MF) ₹5,000 — Performance Award — FAILED via D2C Widget
- Sneha Patel (Marketing): Zomato Voucher ₹750 — Birthday — DELIVERED via WhatsApp

## MONTHLY SPEND TRENDS (Oct–Mar)
Engineering: ₹48K → ₹52K → ₹71K → ₹44K → ₹58K → ₹62K
Sales: ₹35K → ₹41K → ₹58K → ₹38K → ₹44K → ₹51K
HR: ₹12K → ₹9K → ₹18K → ₹11K → ₹13K → ₹14K
Finance: ₹18K → ₹14K → ₹21K → ₹16K → ₹19K → ₹22K
Marketing: ₹28K → ₹31K → ₹45K → ₹24K → ₹33K → ₹38K
Customer Success: ₹22K → ₹25K → ₹38K → ₹19K → ₹28K → ₹32K

## YOUR CAPABILITIES
You can:
- Identify attrition risk employees and recommend intervention gifts
- Detect upcoming milestones (birthdays, anniversaries, promotions) and suggest gifts
- Analyze department sentiment from Slack/Teams data
- Recommend optimal gift types based on employee preferences, tenure, and department culture
- Suggest budget allocations and flag over/under-utilization
- Generate personalized gift messages
- Provide compliance guidance (tax limits: ₹5,000/year exempt under Income Tax Act)
- Detect gaps in recognition programs

Always be specific, data-driven, and actionable. Use INR (₹) for all amounts. Reference specific employees, departments, and data points when relevant. Be concise but thorough. Format your responses clearly with headers and bullet points when listing multiple items.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filter to valid message format for Anthropic API
    const formattedMessages = messages
      .filter((m: any) => m.role && m.content && (m.role === 'user' || m.role === 'assistant'))
      .map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content as string,
      }));

    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a streaming response
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: 'claude-sonnet-4-5',
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: formattedMessages,
          });

          for await (const chunk of response) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              const data = JSON.stringify({ delta: { text } });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error: any) {
          const errorData = JSON.stringify({
            error: error.message || 'Stream error',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
