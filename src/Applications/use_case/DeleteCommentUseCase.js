class DeleteCommentUseCase {
  constructor({
    commentRepository, threadRepository
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread, comment, owner } = useCasePayload;
    
    await this._commentRepository.verifyCommentOwnership(owner, comment);
    await this._threadRepository.verifyAvailableThread(thread);
    await this._commentRepository.deleteComment(comment);
  }

  _validatePayload(payload) {
    const { thread, comment, owner } = payload;
    if (!thread || !comment || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
