class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, comment, thread } = payload;
 
    this.content = content;
    this.owner = owner;
    this.comment = comment;
    this.thread = thread;
  }

  _verifyPayload({ content, owner, comment, thread }) {
    if (!content || !content || !comment || !thread) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof comment !== 'string' || typeof thread !== 'string') {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
 
module.exports = CreateReply;