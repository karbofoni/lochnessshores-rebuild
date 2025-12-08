import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';
import fs from 'fs';
import path from 'path';

// Load FAQ data
function getFAQs() {
    const faqPath = path.join(process.cwd(), 'data', 'faq.json');
    return JSON.parse(fs.readFileSync(faqPath, 'utf8'));
}

// Response schema
const faqSearchSchema: JSONSchemaResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'faq_search_response',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                answer: {
                    type: 'string',
                    description: 'Direct answer to the question (2-4 sentences)',
                },
                relevant_faq_slugs: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Slugs of relevant FAQ items',
                },
                suggested_pages: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['campsite', 'trail', 'guide', 'faq'] },
                            path: { type: 'string' },
                            label: { type: 'string' },
                        },
                        required: ['type', 'path', 'label'],
                        additionalProperties: false,
                    },
                    description: 'Links to relevant pages on the site',
                },
            },
            required: ['answer', 'relevant_faq_slugs', 'suggested_pages'],
            additionalProperties: false,
        },
    },
};

interface FAQSearchResponse {
    answer: string;
    relevant_faq_slugs: string[];
    suggested_pages: {
        type: 'campsite' | 'trail' | 'guide' | 'faq';
        path: string;
        label: string;
    }[];
}

export async function POST(request: Request) {
    try {
        const { question } = await request.json();

        if (!question || typeof question !== 'string') {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        const faqs = getFAQs();

        // Format FAQs for AI
        const faqData = faqs.map((f: { slug: string; question: string; short_answer: string; extended_content: string }) =>
            `SLUG: ${f.slug}\nQ: ${f.question}\nA: ${f.short_answer}\nDetails: ${f.extended_content}`
        ).join('\n\n---\n\n');

        const systemPrompt = `You are a helpful assistant for lochnessshores.com, a camping and hiking guide for Loch Ness, Scotland.

Answer questions about camping around Loch Ness using the FAQ content below and your general knowledge of Scottish Highland camping.

Available FAQs (use exact slugs when referencing):
${faqData}

Available page types to link (use these paths):
- Campsites: /campsites/[slug] or /campsites (list)
- Trails: /trails/[slug] or /trails (list)
- FAQ: /faq#[slug]
- Guides: /guides (if relevant)

Rules:
1. Answer directly and helpfully in 2-4 sentences
2. Reference relevant FAQ slugs if they apply
3. Suggest 1-3 relevant pages to explore
4. Be friendly and practical
5. If you don't know something specific, say so and suggest contacting the site`;

        const result = await chatCompletionWithSchema<FAQSearchResponse>({
            systemPrompt,
            userMessage: question,
            schema: faqSearchSchema,
        });

        // Enrich FAQ slugs with full objects
        const relevantFaqs = result.relevant_faq_slugs
            .map(slug => faqs.find((f: { slug: string }) => f.slug === slug))
            .filter(Boolean);

        return NextResponse.json({
            answer: result.answer,
            faqs: relevantFaqs,
            suggested_pages: result.suggested_pages,
        });
    } catch (error) {
        console.error('FAQ search error:', error);
        return NextResponse.json(
            { error: 'Failed to process question' },
            { status: 500 }
        );
    }
}
