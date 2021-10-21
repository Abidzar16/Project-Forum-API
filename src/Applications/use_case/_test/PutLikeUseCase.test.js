const CreateLike = require('../../../Domains/likes/entities/CreateLike');

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

const PutLikeUseCase = require('../PutLikeUseCase');

describe('PutLikeUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the put like action correctly if user first time like a comment', async () => {
    // Arrange
    const useCasePayload = {
      comment: 'comment-123',
      thread: 'thread-123',
      user: 'user-123',
    };
    
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.checkCommentThreadRelation = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeExist = jest.fn(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const putLikeUseCase = new PutLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await putLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkCommentThreadRelation).toBeCalledWith(useCasePayload.thread, useCasePayload.comment);
    expect(mockLikeRepository.isLikeExist).toBeCalledWith(useCasePayload.comment, useCasePayload.user);
    expect(mockLikeRepository.addLike).toBeCalledWith(new CreateLike(useCasePayload));
  });

  it('should orchestrating the put like action correctly if user want to remove their like on the comment', async () => {
    // Arrange
    const useCasePayload = {
      comment: 'comment-123',
      thread: 'thread-123',
      user: 'user-123',
    };
    
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.checkCommentThreadRelation = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeExist = jest.fn(() => Promise.resolve("like-123"));
    mockLikeRepository.changeLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const putLikeUseCase = new PutLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await putLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkCommentThreadRelation).toBeCalledWith(useCasePayload.thread, useCasePayload.comment);
    expect(mockLikeRepository.isLikeExist).toBeCalledWith(useCasePayload.comment, useCasePayload.user);
    expect(mockLikeRepository.changeLike).toBeCalledWith("like-123");
  });

  it('should orchestrating the put like action correctly if user want to restore their like on the comment', async () => {
    // Arrange
    const useCasePayload = {
      comment: 'comment-123',
      thread: 'thread-123',
      user: 'user-123',
    };
    
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.checkCommentThreadRelation = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeExist = jest.fn(() => Promise.resolve("like-123"));
    mockLikeRepository.changeLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const putLikeUseCase = new PutLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await putLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkCommentThreadRelation).toBeCalledWith(useCasePayload.thread, useCasePayload.comment);
    expect(mockLikeRepository.isLikeExist).toBeCalledWith(useCasePayload.comment, useCasePayload.user);
    expect(mockLikeRepository.changeLike).toBeCalledWith("like-123");
  });
});
