import { Module } from '@nestjs/common';
import { ReplyRepository } from './repository/reply.repository';
import { ReplyService } from './service/reply.service';
import { ReplyController } from './controller/reply.controller';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, ReplyRepository],
  exports: [ReplyService],
})
export class ReplyModule {}
