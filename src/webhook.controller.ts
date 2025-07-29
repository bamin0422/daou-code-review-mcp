import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('bitbucket')
  @HttpCode(200)
  async handleBitbucketWebhook(
    @Headers('x-event-key') eventKey: string,
    @Body() payload: any,
  ) {
    if (eventKey === 'pullrequest:created') {
      await this.reviewService.createReviewForPR(payload);
    }
    return { status: 'received' };
  }
}
