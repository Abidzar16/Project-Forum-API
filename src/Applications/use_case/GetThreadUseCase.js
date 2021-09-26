class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread } = useCasePayload
    await this._threadRepository.verifyAvailableThread(thread);
    return this._threadRepository.getThread(thread);
  }

  _validatePayload(payload) {
    const { thread } = payload;
    if (!thread) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_LINK');
    }

    if (typeof thread !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;