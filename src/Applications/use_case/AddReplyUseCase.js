const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const createReply = new CreateReply(useCasePayload);
    const {thread, comment} = createReply;
    await this._threadRepository.verifyAvailableThread(thread);
    await this._commentRepository.checkCommentThreadRelation(thread, comment);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;