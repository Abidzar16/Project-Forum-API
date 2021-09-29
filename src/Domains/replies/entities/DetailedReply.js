class DetailedReply {
  constructor(payload) {
    this._verifyPayload(payload);
    
    const { id, content, owner, date, is_deleted  } = payload;
 
    this.id = id;
    this.content = this._checkDeletedComment({content, is_deleted});;
    this.owner = owner;
    this.date = date;
    this.is_deleted = is_deleted;
  }
 
  _verifyPayload({ id, content, owner, date, is_deleted }) {
    if (!id || !content || !owner || !date || is_deleted == undefined) {
      throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
 
    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof date !== 'object' || typeof is_deleted !== 'boolean') {
      throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _checkDeletedComment({ content, is_deleted }) {
    if (is_deleted) {
      return "**komentar telah dihapus**"
    }
    return content
  }
}
 
module.exports = DetailedReply;