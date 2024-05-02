import customAxios from "./middleware";

class NoteService {
    createNotes(data, accessToken) {
        return customAxios.post('/note', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    getAllNotes(accessToken) {
        return customAxios.get('/note', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getNotesInTrash(accessToken) {
        return customAxios.get('/note/trash', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    restoreNotesFromTrash(ordernum, accessToken) {
        return customAxios.post(`/note/restore/${ordernum}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    getNoteByPresenter(presenterId, accessToken) {
        return customAxios.get(`/note/presenter/${presenterId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getNoteByNumber(number, accessToken) {
        return customAxios.get(`/note/${number}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    updateNoteByNumber(number, data, accessToken) {
        return customAxios.put(`/note/${number}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteNoteByNumber(number, accessToken) {
        return customAxios.delete(`/note/${number}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createNoteType(data, accessToken) {
        return customAxios.post('/note/type', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllNoteTypes(accessToken) {
        return customAxios.get('/note/type/all', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteNoteType(typeId, accessToken) {
        return customAxios.delete(`/note/type/${typeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createNoteGroup(data, accessToken) {
        return customAxios.post('/note/group', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllNoteGroups(accessToken) {
        return customAxios.get('/note/group/all', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteNoteGroup(groupId, accessToken) {
        return customAxios.delete(`/note/group/${groupId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createNoteTag(data, accessToken) {
        return customAxios.post('/note/tag', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllNoteTags(accessToken) {
        return customAxios.get('/note/tag/all', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteNoteTag(tagId, accessToken) {
        return customAxios.delete(`/note/tag/${tagId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
}

export default NoteService;
