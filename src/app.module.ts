import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookController } from './webhook.controller';
import { ReviewService } from './review.service';
import { BitbucketModule } from './bitbucket/bitbucket.module';

@Module({
  imports: [BitbucketModule],
  controllers: [AppController, WebhookController],
  providers: [AppService, ReviewService],
})
export class AppModule {}
