import { Module } from '@nestjs/common';
import { BitbucketController } from './bitbucket.controller';
import { BitbucketService } from './bitbucket.service';

@Module({
  controllers: [BitbucketController],
  providers: [BitbucketService],
})
export class BitbucketModule {}
