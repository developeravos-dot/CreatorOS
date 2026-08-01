import { Injectable } from "@nestjs/common";

export interface PlatformAnalysisResult {

    name: string;

    duration: number;

    aspect: string;

    editing: string;
}

@Injectable()
export class PlatformIntelligenceService {

    analyze(platform: string): PlatformAnalysisResult {

        switch (platform.toLowerCase()) {

            case "tiktok":

                return {

                    name: "TikTok",

                    duration: 60,

                    aspect: "9:16",

                    editing: "Fast"
                };

            case "youtube shorts":

            case "shorts":

                return {

                    name: "YouTube Shorts",

                    duration: 60,

                    aspect: "9:16",

                    editing: "Fast"
                };

            case "instagram reels":

            case "reels":

                return {

                    name: "Instagram Reels",

                    duration: 90,

                    aspect: "9:16",

                    editing: "Fast"
                };

            default:

                return {

                    name: "YouTube",

                    duration: 480,

                    aspect: "16:9",

                    editing: "Cinematic"
                };
        }
    }
}
