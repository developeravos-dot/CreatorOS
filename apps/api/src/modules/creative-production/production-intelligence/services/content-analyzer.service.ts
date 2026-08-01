import { Injectable } from "@nestjs/common";
import { AnalyzeContentDto } from "../dto/analyze-content.dto";

export interface ContentAnalysisResult {

    category: string;

    genre: string;

    tone: string;

    educational: boolean;

    language: string;
}

@Injectable()
export class ContentAnalyzerService {

    analyze(dto: AnalyzeContentDto): ContentAnalysisResult {

        const text =
            `${dto.title} ${dto.description}`.toLowerCase();

        let category = "General";
        let genre = "Educational";

        if (
            text.includes("طفل") ||
            text.includes("أطفال") ||
            text.includes("children") ||
            text.includes("kids")
        ) {
            category = "Children";
            genre = "Kids";
        } else if (
            text.includes("تاريخ") ||
            text.includes("history")
        ) {
            category = "History";
            genre = "Documentary";
        } else if (
            text.includes("تقنية") ||
            text.includes("تكنولوجيا") ||
            text.includes("technology")
        ) {
            category = "Technology";
            genre = "Educational";
        } else if (
            text.includes("قصة") ||
            text.includes("story")
        ) {
            category = "Stories";
            genre = "Narrative";
        }

        return {

            category,

            genre,

            tone: category === "Children"
                ? "Friendly"
                : "Professional",

            educational: true,

            language: dto.language ?? "Arabic"
        };
    }
}
