const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
      thread: 'thread-123',
      owner: 'user-123',
      comment: 'comment-123',
    };
    const expectedCreatedReply = new CreatedReply({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedReply));
    mockCommentRepository.checkCommentThreadRelation = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedReply));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const createdReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new CreateReply(useCasePayload));
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkCommentThreadRelation).toBeCalledWith(useCasePayload.thread, useCasePayload.comment);
  });
});
