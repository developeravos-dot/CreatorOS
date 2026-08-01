import { ProductionStrategyDto } from "./production-strategy.dto";

export class ProductionPlanDto {

    category!: string;

    genre!: string;

    audience!: string;

    language!: string;

    platform!: string;

    duration!: number;

    strategy!: ProductionStrategyDto;
}
