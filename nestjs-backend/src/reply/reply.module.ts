import { Module } from '@nestjs/common';
import { ReplyService } from './service/reply.service';
import { ReplyController } from './controller/reply.controller';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}
