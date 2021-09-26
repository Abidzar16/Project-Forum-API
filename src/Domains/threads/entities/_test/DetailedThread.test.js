const DetailedThread = require('../DetailedThread');
 
describe('a DetailedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };
 
    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 12345,
      body: 123,
      owner: true,
      date: new Date('xxx'),
    };
    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailedThread object correctly', () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "12345",
      body: 'body thread',
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
    };
    // Action
    const { id, title, body, date, owner } = new DetailedThread(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
  });
});