require('core-js');

const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

const GetDetailedUseCase = require('../GetDetailedUseCase');

const DetailedThread = require('../../../Domains/threads/entities/DetailedThread');
const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');
const DetailedReply = require('../../../Domains/replies/entities/DetailedReply');

describe('GetDetailedUseCase', () => {
  it('should throw error if use case payload not contain thread link', async () => {
    // Arrange
    const useCasePayload = {};

    const getThreadUseCase = new GetDetailedUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_LINK');
  });

  it('should throw error if thread link not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
    };

    const getThreadUseCase = new GetDetailedUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange

    const useCasePayload = {
      thread: 'thread-123',
    };

    const expectedDetailedThread = new DetailedThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
    });

    const expectedDetailedComment = new DetailedComment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
      is_deleted: false,
    });

    const expectedDetailedReply = new DetailedReply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
      date: new Date('December 17, 1995 03:24:00'),
      is_deleted: false,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
      
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailedThread));

    mockCommentRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailedComment));
    
    mockReplyRepository.getReplyByComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailedReply));
    
    mockLikeRepository.getLikeByComment = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    console.error = jest.fn()

    const getDetailUseCase = new GetDetailedUseCase({
        userRepository: mockUserRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
    });

    // Act
    await getDetailUseCase.execute(useCasePayload);

    expect(mockUserRepository.getUsernameById).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentByThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockReplyRepository.getReplyByComment)
      .toHaveBeenCalledWith("comment-123");
    expect(mockLikeRepository.getLikeByComment)
      .toHaveBeenCalledWith("comment-123");
  });
});
