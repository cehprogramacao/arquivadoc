import ServiceBase from "./service.base";

class NoteService extends ServiceBase {
  constructor() {
    super("user");
  }

  createNotes(data) {
    return this.post("/note", data);
  }

  getAllNotes() {
    return this.get("/note");
  }

  getNotesInTrash() {
    return this.get("/note/trash/note");
  }

  getNoteByPresenter(presenterId) {
    return this.get(`/note/presenter/${presenterId}`);
  }

  getNoteByNumber(number) {
    return this.get(`/note/${number}`);
  }

  updateNoteByNumber(number, data) {
    return this.put(`/note/${number}`, data);
  }

  deleteNoteByNumber(number) {
    return this.delete(`/note/${number}`);
  }

  createNoteType(data) {
    return this.post("/note/type", data);
  }

  getAllNoteTypes() {
    return this.get("/note/type/all");
  }

  deleteNoteType(typeId) {
    return this.delete(`/note/type/${typeId}`);
  }

  createNoteGroup(data) {
    return this.post("/note/group", data);
  }

  getAllNoteGroups() {
    return this.get("/note/group/all");
  }

  deleteNoteGroup(groupId) {
    return this.delete(`/note/group/${groupId}`);
  }

  createNoteTag(data) {
    return this.post("/note/tag", data);
  }

  getAllNoteTags() {
    return this.get("/note/tag/all");
  }

  deleteNoteTag(tagId) {
    return this.delete(`/note/tag/${tagId}`);
  }
}

export default NoteService;
