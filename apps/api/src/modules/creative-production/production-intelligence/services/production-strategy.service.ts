import { Injectable } from "@nestjs/common";

export interface ProductionStrategyResult {

    style: string;

    colors: string;

    voice: string;

    music: string;

    camera: string;
}

@Injectable()
export class ProductionStrategyService {

    build(category: string): ProductionStrategyResult {

        if (category === "Children") {

            return {

                style: "High Quality 3D Animation",

                colors: "Bright and carefully balanced",

                voice: "Friendly child-safe voices",

                music: "Fantasy and playful",

                camera: "Animated cinematic camera"
            };
        }

        if (category === "History") {

            return {

                style: "Historical Cinematic Reconstruction",

                colors: "Period-accurate cinematic palette",

                voice: "Documentary narration",

                music: "Historical orchestral",

                camera: "Documentary cinema"
            };
        }

        if (category === "Technology") {

            return {

                style: "Futuristic Cinematic",

                colors: "Modern technological palette",

                voice: "Clear professional narration",

                music: "Modern electronic documentary",

                camera: "Dynamic product cinema"
            };
        }

        return {

            style: "Cinematic",

            colors: "Natural",

            voice: "Professional",

            music: "Documentary",

            camera: "Cinema"
        };
    }
}
