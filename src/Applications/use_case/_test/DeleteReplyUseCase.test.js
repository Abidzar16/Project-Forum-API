const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain thread and/or comment', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload doesn\'t contain valid data type', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
      comment: 123,
      reply: 123,
      owner: 123,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: "thread-123",
      comment: "comment-123",
      reply: "reply-123",
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.checkCommentThreadRelation = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReplyOwnership)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.reply);
    expect(mockCommentRepository.checkCommentThreadRelation)
      .toHaveBeenCalledWith(useCasePayload.thread, useCasePayload.comment);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload.reply);
  });
});
