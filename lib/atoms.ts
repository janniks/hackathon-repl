import { atom } from "jotai";
import * as monaco_editor from "monaco-editor";

export const editorAtom =
  atom<monaco_editor.editor.IStandaloneCodeEditor | null>(null);

export const playerAtom = atom<any | null>(null);
