class DetailedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    
    const { id, title, body, date, owner  } = payload;
 
    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    this.date = date;
  }
 
  _verifyPayload({
    id, title, body, date, owner
  }) {
    if (!id || !title || !body || !date || !owner) {
      throw new Error('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
 
    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'object' || typeof owner !== 'string') {
      throw new Error('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
 
module.exports = DetailedThread;