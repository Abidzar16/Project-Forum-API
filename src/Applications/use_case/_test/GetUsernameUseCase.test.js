const UserRepository = require('../../../Domains/users/UserRepository');
const GetUsernameUseCase = require('../GetUsernameUseCase');

describe('GetUsernameUseCase', () => {
  it('should throw error if use case payload not contain thread link', async () => {
    // Arrange
    const useCasePayload = {};

    const getCommentsUseCase = new GetUsernameUseCase({});

    // Action & Assert
    await expect(getCommentsUseCase.execute(useCasePayload))
    .rejects
    .toThrowError('GET_USERNAME_USE_CASE.NOT_CONTAIN_USER_ID');
  });

  it('should throw error if thread link not string', async () => {
    // Arrange
    const useCasePayload = {
      id: 123,
    };

    const getCommentsUseCase = new GetUsernameUseCase({});

    // Action & Assert
    await expect(getCommentsUseCase.execute(useCasePayload))
    .rejects
    .toThrowError('GET_USERNAME_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get username action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'user-123',
    };

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getUsernameUseCase = new GetUsernameUseCase({
      userRepository: mockUserRepository,
    });

    // Act
    await getUsernameUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getUsernameById)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
});
