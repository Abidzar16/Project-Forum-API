/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({ userRepository, threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread } = useCasePayload

    await this._threadRepository.verifyAvailableThread(thread);
    var detailedThread = await this._threadRepository.getThread(thread);

    detailedThread['username'] = await this._userRepository.getUsernameById(detailedThread['owner']);
    detailedThread['comments'] = await this._fetchComments(thread);

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

  async _fetchReplies(commentId) {
    const rawReplies = [await this._replyRepository.getReplyByComment(commentId)];
    const completeReplies = Promise.all(rawReplies.flat().map(async (reply) => {
      reply['username'] = await this._userRepository.getUsernameById(reply['owner']);
      delete reply['owner'];
      delete reply['is_deleted'];

      return reply;
    }));
    return completeReplies;
  }

  async _fetchComments(threadId) {
    var rawComments = [await this._commentRepository.getCommentByThread(threadId)];
    const completeComment = Promise.all(rawComments.flat().map(async (comment) => {
      comment['username'] = await this._userRepository.getUsernameById(comment['owner']);
      
      const count = await this._likeRepository.getLikeByComment(comment['id']);
      comment['likeCount'] = parseInt(count, 10);
      
      comment['replies'] = await this._fetchReplies(comment['id']);

      delete comment['owner'];
      delete comment['is_deleted'];

      return comment;
    }));
    return completeComment;
  }
}

module.exports = GetThreadUseCase;