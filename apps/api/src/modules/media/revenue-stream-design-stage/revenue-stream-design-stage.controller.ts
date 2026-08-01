import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMediaBusinessPortfolioInput, MediaBusinessPortfolio, MediaBusinessStage } from '../media-business-revenue-core/media-business-revenue-engine.base';
import { RevenueStreamDesignStageService } from './revenue-stream-design-stage.service';

@Controller('media/business-revenue/revenue-stream-design')
export class RevenueStreamDesignStageController {
  constructor(private readonly service: RevenueStreamDesignStageService) {}

  @Get('dashboard') getDashboard() { return this.service.getDashboard(); }
  @Get('blueprint') getBlueprint() { return this.service.getBlueprint(); }
  @Get('portfolios') listPortfolios() { return this.service.listPortfolios(); }
  @Post('portfolios') createPortfolio(@Body() input: CreateMediaBusinessPortfolioInput) { return this.service.createPortfolio(input); }
  @Get('portfolios/:id') getPortfolio(@Param('id') id: string) { return this.service.getPortfolio(id); }
  @Patch('portfolios/:id') updatePortfolio(@Param('id') id: string, @Body() input: Partial<MediaBusinessPortfolio>) { return this.service.updatePortfolio(id, input); }
  @Delete('portfolios/:id') removePortfolio(@Param('id') id: string) { return this.service.removePortfolio(id); }
  @Post('portfolios/:id/human-approve-autonomy') approveAutonomy(@Param('id') id: string, @Body('approvedBy') approvedBy: string) { return this.service.approveAutonomousExecution(id, approvedBy); }
  @Post('portfolios/:id/start') startLifecycle(@Param('id') id: string) { return this.service.startLifecycle(id); }
  @Post('portfolios/:id/execute-stage') executeStage(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.executeManagedStage(id, input as never); }
  @Post('portfolios/:id/complete-stage') completeStage(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.completeManagedStage(id, input); }
  @Post('portfolios/:id/stages/:stage/human-review') humanReview(@Param('id') id: string, @Param('stage') stage: MediaBusinessStage) { return this.service.submitStageForHumanReview(id, stage); }
  @Post('portfolios/:id/stages/:stage/human-approve') approveStage(@Param('id') id: string, @Param('stage') stage: MediaBusinessStage, @Body('approvedBy') approvedBy: string) { return this.service.approveStage(id, stage, approvedBy); }
  @Post('portfolios/:id/revenue-streams') addRevenueStream(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addRevenueStream(id, input as never); }
  @Post('portfolios/:id/offers') addOffer(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addOffer(id, input as never); }
  @Post('portfolios/:id/sponsorship-deals') addSponsorshipDeal(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addSponsorshipDeal(id, input as never); }
  @Post('portfolios/:id/investments') addInvestment(@Param('id') id: string, @Body() input: Record<string, unknown>) { return this.service.addInvestment(id, input as never); }
  @Post('portfolios/:id/profit-allocation') allocateProfit(@Param('id') id: string, @Body('reinvestmentPercentage') reinvestmentPercentage: number, @Body('reservePercentage') reservePercentage: number) { return this.service.allocateProfit(id, reinvestmentPercentage, reservePercentage); }
  @Get('portfolios/:id/financial-report') financialReport(@Param('id') id: string) { return this.service.generateFinancialReport(id); }
  @Get('portfolios/:id/growth-plan') growthPlan(@Param('id') id: string) { return this.service.generateGrowthPlan(id); }
}
