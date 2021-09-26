class GetCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(thread);
    return this._commentRepository.getCommentByThread(thread);
  }

  _validatePayload(payload) {
    const { thread } = payload;
    if (!thread) {
      throw new Error('GET_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_LINK');
    }

    if (typeof thread !== 'string') {
      throw new Error('GET_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentUseCase;