/* eslint-disable no-param-reassign */
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailedUseCase = require('../../../../Applications/use_case/GetDetailedUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;
    var payload = request.payload;
    
    payload['owner'] = id;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const payload = { 'thread': threadId };
    
    const getDetailedUseCase = this._container.getInstance(GetDetailedUseCase.name);
    const detailedThread = await getDetailedUseCase.execute(payload);
    
    const response = h.response({
      status: 'success',
      data: {
        thread: detailedThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
