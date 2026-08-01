import { AudienceProfile } from "./audience-profile.entity";
import { ProductionProfile } from "./production-profile.entity";

export class ProductionPlan {

    contentType!: string;

    category!: string;

    genre!: string;

    audience!: AudienceProfile;

    production!: ProductionProfile;

    duration!: number;

    recommendedModels!: string[];
}
