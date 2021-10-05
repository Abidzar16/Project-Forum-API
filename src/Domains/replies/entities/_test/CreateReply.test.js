const CreateReply = require('../CreateReply');
 
describe('a CreateReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };
 
    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 12345,
      owner: 12345,
      comment: 12345,
      thread: 12345,
    };
    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateReply object correctly', () => {
    // Arrange
    const payload = {
      content: "12345",
      owner: "12345",
      comment: "12345",
      thread: "12345",
    };
    // Action
    const { content, comment, owner, thread } = new CreateReply(payload);
    // Assert
    expect(content).toEqual(payload.content);
    expect(comment).toEqual(payload.comment);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
