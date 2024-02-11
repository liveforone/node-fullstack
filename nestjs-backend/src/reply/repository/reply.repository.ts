import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReplyEntity } from '../entities/reply.entity';
import { PrismaCommonErrCode } from 'src/exceptionHandle/exceptionMessage/global.exception.message';
import { $Enums, Reply } from '@prisma/client';
import { ReplyException } from 'src/exceptionHandle/customException/reply.exception';
import { ReplyExcMsg } from 'src/exceptionHandle/exceptionMessage/reply.exception.message';
import { validateFoundData } from 'src/common/validate.found-data';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { ReplyPage } from '../dto/response/reply-page.dto';
import { ReplyOptimizedPageDto } from '../dto/response/reply-optimized-page.dto';
import { ReplyRepoConstant } from './constant/reply.repository.constant';

@Injectable()
export class ReplyRepository {
  constructor(private prisma: PrismaService) {}

  async save(reply: ReplyEntity) {
    //유니크 제약 조건 사항 없음
    await this.prisma.reply.create({ data: reply });
  }

  async updateReplyByIdAndWriterId(
    content: string,
    id: bigint,
    writer_id: string,
  ) {
    await this.prisma.reply
      .update({
        data: { content: content, reply_state: $Enums.ReplyState.EDITED },
        where: { id: id, writer_id: writer_id },
      })
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }
        throw new ReplyException(message, status);
      });
  }

  async deleteOneByIdAndWriterId(id: bigint, writer_id: string) {
    await this.prisma.reply
      .delete({
        where: { id: id, writer_id: writer_id },
      })
      .catch((err) => {
        let message: string;
        let status: HttpStatus;

        if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
          message = ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST;
          status = HttpStatus.BAD_REQUEST;
        } else {
          message = err.message;
          status = HttpStatus.BAD_REQUEST;
        }
        throw new ReplyException(message, status);
      });
  }

  async findOneById(id: bigint): Promise<Reply> {
    const reply = await this.prisma.reply.findUnique({
      where: { id: id },
    });
    validateFoundData(reply);
    return reply;
  }

  //post_id로 조회
  async findReplyPageByPostId(
    post_id: bigint,
    lastId: bigint,
  ): Promise<ReplyOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const replies: ReplyPage[] = await this.prisma.reply.findMany({
      where: {
        AND: [{ post_id: post_id }, lastIdCondition],
      },
      orderBy: { id: 'desc' },
      take: ReplyRepoConstant.PAGE_SIZE,
    });
    return {
      replyPages: replies,
      metadata: { lastId: findLastIdOrDefault(replies) },
    };
  }
}
