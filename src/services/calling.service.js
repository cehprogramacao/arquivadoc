import customAxios from './middleware';

class Calling {

  createCalling(calling, accessToken) {
    return customAxios.post('/calling', calling, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getAllCallings(accessToken) {
    return customAxios.get('/calling', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  getAllCallingsInTrash(accessToken) {
    return customAxios.get('/calling/trash', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  restoreCallingFromTrash(number, accessToken) {
    return customAxios.post(`/calling/restore/${number}`,{}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getCallingByEntity(entity, accessToken) {
    return customAxios.get(`/calling/entity/${entity}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getCallingByNumber(number, accessToken) {
    return customAxios.get(`/calling/${number}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  updateCallingByNumber(number, calling, accessToken) {
    return customAxios.put(`/calling/${number}`, calling, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  deleteCallingByNumber(number, accessToken) {
    return customAxios.delete(`/calling/${number}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  createCallingType(type, accessToken) {
    return customAxios.post('/calling/type', type, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getAllCallingTypes(accessToken) {
    return customAxios.get('/calling/types/all', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  deleteCallingType(typeid, accessToken) {
    return customAxios.delete(`/calling/type/${typeid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  createCallingEntity(entity, accessToken) {
    return customAxios.post('/calling/entity', entity, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getAllCallingEntities(accessToken) {
    return customAxios.get('/calling/entitys/all', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  deleteCallingEntity(entityid, accessToken) {
    return customAxios.delete(`/calling/entity/${entityid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export default Calling;