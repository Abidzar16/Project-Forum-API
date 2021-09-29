class DeleteReplyUseCase {
  constructor({
    commentRepository, replyRepository
  }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread, comment, reply, owner } = useCasePayload;
    
    await this._commentRepository.checkCommentThreadRelation(thread, comment);
    await this._replyRepository.verifyReplyOwnership(owner, reply);
    await this._replyRepository.deleteReply(reply);
  }

  _validatePayload(payload) {
    const { thread, comment, reply, owner } = payload;
    if (!thread || !comment || !reply || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof reply !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
