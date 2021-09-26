class GetUsernameUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { id } = useCasePayload
    return this._userRepository.getUsernameById(id);
  }

  _validatePayload(payload) {
    const { id } = payload;
    if (!id) {
      throw new Error('GET_USERNAME_USE_CASE.NOT_CONTAIN_USER_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('GET_USERNAME_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetUsernameUseCase;