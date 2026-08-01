import { Injectable } from "@nestjs/common";

export interface AudienceAnalysisResult {

    age: string;

    attention: string;

    platform: string;
}

@Injectable()
export class AudienceAnalyzerService {

    analyze(category: string): AudienceAnalysisResult {

        switch (category) {

            case "Children":

                return {

                    age: "6-12",

                    attention: "Medium",

                    platform: "YouTube Kids"
                };

            case "Technology":

                return {

                    age: "18-45",

                    attention: "High",

                    platform: "YouTube"
                };

            case "Stories":

                return {

                    age: "13-45",

                    attention: "High",

                    platform: "YouTube"
                };

            default:

                return {

                    age: "16-60",

                    attention: "Medium",

                    platform: "YouTube"
                };
        }
    }
}
