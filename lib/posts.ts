import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const guidesDirectory = path.join(process.cwd(), 'content/guides');
const seasonalDirectory = path.join(process.cwd(), 'content/seasonal');

export async function getGuideData(slug: string) {
    const fullPath = path.join(guidesDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...(matterResult.data as { title: string; date: string; excerpt: string }),
    };
}

export function getAllGuideSlugs() {
    if (!fs.existsSync(guidesDirectory)) return [];

    const fileNames = fs.readdirSync(guidesDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        };
    });
}
