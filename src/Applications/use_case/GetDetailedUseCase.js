class GetThreadUseCase {
  constructor({ userRepository, threadRepository, commentRepository, replyRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread } = useCasePayload

    await this._threadRepository.verifyAvailableThread(thread);
    var detailedThread = await this._threadRepository.getThread(thread);

    detailedThread['username'] = await this._userRepository.getUsernameById(detailedThread['owner']);

    var rawComments = [await this._commentRepository.getCommentByThread(thread)];

    const completeComment = await Promise.all(rawComments.flat().map(async (comment) => {
      comment['username'] = await this._userRepository.getUsernameById(comment['owner']);
      delete comment['owner'];
      delete comment['is_deleted'];

      var rawReplies = [];
      rawReplies = [await this._replyRepository.getReplyByComment(comment['id'])];
      
      const completeReply = await Promise.all(rawReplies.flat().map(async (reply) => {
        
        reply['username'] = await this._userRepository.getUsernameById(reply['owner']);
        delete reply['owner'];
        delete reply['is_deleted'];

        return reply;
      }));

      comment['replies'] = completeReply
      return comment;
    }));
    
    detailedThread['comments'] = completeComment
    return detailedThread;
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