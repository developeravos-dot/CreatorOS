import { Injectable } from '@nestjs/common';
import { MediaAsset, PortfolioDashboard } from './media-enterprise-expansion.types';

@Injectable()
export class PortfolioGovernanceEngineService {
  dashboard(assets: MediaAsset[]): PortfolioDashboard {
    const byStage = assets.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.stage] = (acc[asset.stage] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalAssets: assets.length,
      byStage,
      totalForecastRevenue: assets.reduce(
        (sum, asset) => sum + asset.revenue.forecast,
        0,
      ),
      totalRealizedRevenue: assets.reduce(
        (sum, asset) => sum + asset.revenue.realized,
        0,
      ),
      licensingReady: assets.filter(
        (asset) => asset.licensing.readiness >= 0.7,
      ).length,
      globallyLocalized: assets.filter(
        (asset) =>
          asset.localization.languages.length >= 2 &&
          asset.localization.markets.length >= 2,
      ).length,
      humanApproved: assets.filter(
        (asset) => asset.governance.humanApproved,
      ).length,
      priorityAssets: assets
        .map((asset) => ({
          id: asset.id,
          title: asset.input.title,
          score: Number(
            (
              (asset.input.strategicScore ?? 0.7) * 0.35 +
              (asset.input.revenuePotential ?? 0.65) * 0.35 +
              (asset.input.scalability ?? 0.65) * 0.3
            ).toFixed(3),
          ),
          stage: asset.stage,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20),
    };
  }
}