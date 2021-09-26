const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetCommentUseCase = require('../GetCommentUseCase');

describe('GetCommentUseCase', () => {
  it('should throw error if use case payload not contain thread link', async () => {
    // Arrange
    const useCasePayload = {};

    const getCommentsUseCase = new GetCommentUseCase({});

    // Action & Assert
    await expect(getCommentsUseCase.execute(useCasePayload))
    .rejects
    .toThrowError('GET_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_LINK');
  });

  it('should throw error if thread link not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
    };

    const getCommentsUseCase = new GetCommentUseCase({});

    // Action & Assert
    await expect(getCommentsUseCase.execute(useCasePayload))
    .rejects
    .toThrowError('GET_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get comments action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    /** creating dependency of use case */
    const mockCommentsRepository = new CommentRepository();
    const mockThreadsRepository = new ThreadRepository();
    
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getCommentsUseCase = new GetCommentUseCase({
      commentRepository: mockCommentsRepository,
      threadRepository: mockThreadsRepository,
    });

    // Act
    await getCommentsUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadsRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentsRepository.getCommentByThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });
});
