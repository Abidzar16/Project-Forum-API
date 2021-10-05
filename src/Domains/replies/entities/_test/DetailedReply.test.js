const DetailedReply = require('../DetailedReply');
 
describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };
 
    // Action and Assert
    expect(() => new DetailedReply(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: '12345',
      owner: true,
      date: new Date('xxx'),
      is_deleted: 0,
    };
    // Action and Assert
    expect(() => new DetailedReply(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedComment object correctly when is_deleted = false', () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "12345",
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
      is_deleted: false,
    };
    // Action
    const { id, content, owner, date, is_deleted } = new DetailedReply(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
    expect(is_deleted).toEqual(payload.is_deleted);
  });

  it('should create CreatedComment object correctly when is_deleted = true', () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "12345",
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
      is_deleted: true,
    };
    // Action
    const { id, content, owner, date, is_deleted } = new DetailedReply(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual("**balasan telah dihapus**");
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
    expect(is_deleted).toEqual(payload.is_deleted);
  });
});