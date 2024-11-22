import { Router } from "express";
import {
createNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/notesController";
// import {
//   validateIdParam,
//   validateNoteBody,
//   validateNoteTitle,
// } from "../lib/validator-functions";

const routes = Router();

routes.get("/get-note/:id",  getNote);
routes.get("/get-all-notes", getAllNotes);
// notesRouter.post("/add-note", validateNoteBody(), validateNoteTitle(), createNote);
routes.post("/add-note",  createNote);
routes.put("/update-note/:id",  updateNote);
routes.delete("/delete-note/:id",  deleteNote);


// routes.get("/get-note/:id", validateIdParam(), getNote);
// routes.get("/get-all-notes", getAllNotes);
// // notesRouter.post("/add-note", validateNoteBody(), validateNoteTitle(), createNote);
// routes.post("/add-note",  createNote);
// routes.put(
//       "/update-note/:id",
//   validateIdParam(),
//   validateNoteBody(),
//   validateNoteTitle(),
//   updateNote
// );
// routes.delete("/delete-note/:id", validateIdParam(), deleteNote);

export default routes;