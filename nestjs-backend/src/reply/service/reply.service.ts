import { Injectable, Logger } from '@nestjs/common';
import { ReplyRepository } from '../repository/reply.repository';
import { CreateReplyDto } from '../dto/request/create-reply.dto';
import { UpdateReplydto } from '../dto/request/update-reply.dto';
import { RemoveReplyDto } from '../dto/request/remove-reply.dto';
import { ReplyEntity } from '../entities/reply.entity';
import { ReplyServiceLog } from '../log/reply.service.log';

@Injectable()
export class ReplyService {
  private readonly logger = new Logger(ReplyService.name);

  constructor(private replyRepository: ReplyRepository) {}

  async createReply(createReplyDto: CreateReplyDto) {
    const { writerId: writer_id, postId: post_id, content } = createReplyDto;
    const reply = ReplyEntity.create(writer_id, post_id, content);
    await this.replyRepository.save(reply);
    this.logger.log(ReplyServiceLog.CREATE_REPLY_SUCCESS + writer_id);
  }

  async updateReply(updateReplyDto: UpdateReplydto, id: bigint) {
    const { content, writerId: writer_id } = updateReplyDto;
    await this.replyRepository.updateReplyByIdAndWriterId(
      content,
      id,
      writer_id,
    );
    this.logger.log(ReplyServiceLog.UPDATE_REPLY_SUCCESS + id);
  }

  async removeReply(removeReplyDto: RemoveReplyDto, id: bigint) {
    const { writerId: writer_id } = removeReplyDto;
    await this.replyRepository.deleteOneByIdAndWriterId(id, writer_id);
    this.logger.log(ReplyServiceLog.REMOVE_REPLY_SUCCESS + id);
  }

  async getOneById(id: bigint) {
    return await this.replyRepository.findOneById(id);
  }

  async getReplyPageByPostId(post_id: bigint, lastId: bigint) {
    return await this.replyRepository.findReplyPageByPostId(post_id, lastId);
  }
}
