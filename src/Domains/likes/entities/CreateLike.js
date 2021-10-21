class CreateLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { thread, comment, user } = payload;
 
    this.comment = comment;
    this.thread = thread;
    this.user = user;
  }

  _verifyPayload({ thread, comment, user }) {
    if (!thread || !comment || !user) {
      throw new Error('CREATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof user !== 'string' || typeof comment !== 'string' || typeof thread !== 'string') {
      throw new Error('CREATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
 
module.exports = CreateLike;