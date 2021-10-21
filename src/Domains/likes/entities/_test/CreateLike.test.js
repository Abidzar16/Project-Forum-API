const CreateLike = require('../CreateLike');
 
describe('a CreateLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      thread: "thread-12345",
    };
 
    // Action and Assert
    expect(() => new CreateLike(payload)).toThrowError('CREATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      user: 12345,
      comment: 12345,
      thread: 12345,
    };
    // Action and Assert
    expect(() => new CreateLike(payload)).toThrowError('CREATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateLike object correctly', () => {
    // Arrange
    const payload = {
      user: "12345",
      comment: "12345",
      thread: "12345",
    };
    // Action
    const { user, comment, thread } = new CreateLike(payload);
    // Assert
    expect(comment).toEqual(payload.comment);
    expect(user).toEqual(payload.user);
    expect(thread).toEqual(payload.thread);
  });
});