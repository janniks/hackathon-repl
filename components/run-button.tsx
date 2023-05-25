import * as monaco_editor from "monaco-editor";
import Button from "./button";
import { useAtom } from "jotai";
import { editorAtom } from "../lib/atoms";
import { useHasMounted } from "../lib/hooks";
import { use, useCallback, useEffect } from "react";

const RunButton = () => {
  const [editor, setEditor] = useAtom(editorAtom);

  const runCode = useCallback(() => {
    if (!editor) return;

    const code = editor.getValue();
    const script = document.createElement("script");

    const consoleCode = `
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        const oldConsole = console;
        const parent = document.getElementById("console-container");
        document.getElementById("editor-container").appendChild(parent);
        parent.innerHTML = "";
        console = {
            log: (...args) => {
                parent.innerHTML += args.map((arg) => {
                    let value;
                    if (arg instanceof Error) {
                        value = escapeHtml(
                            JSON.stringify(
                            { ...arg, message: arg.message, stack: arg.stack },
                            null,
                            2
                            )
                        );
                    } else if (typeof arg === "object") {
                        try {
                            value = escapeHtml(
                                JSON.stringify(
                                    arg,
                                    (key, value) => {
                                        return typeof value === 'bigint'
                                                    ? value.toString()
                                                    : value;
                                    },
                                2)
                            );
                        } catch {
                            value = escapeHtml(arg);
                        }
                    } else if (typeof arg === "string") {
                        value = escapeHtml(arg)
                    } else {
                        value = escapeHtml("" + arg);
                    }
                    const currentDate = new Date();
                    const hours = ('0' + currentDate.getHours()).slice(-2);
                    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
                    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
                    const milliseconds = ('0' + currentDate.getMilliseconds()).slice(-2);
                    const formattedTime = hours + ':' + minutes + ':' + seconds + "." + milliseconds;
                    const timeTag = "<span style='color: rgb(151 149 149)'>" + formattedTime + "\t" + "</span>";
                    return "<pre style='white-space:pre-wrap'>" + timeTag + value + "</pre>";
                }).join(" ");
            },
            error: (...args) => {
                parent.innerHTML += args.map((arg) => {
                    let value;
                    if (arg instanceof Error) {
                        value = escapeHtml(
                            JSON.stringify(
                            { ...arg, message: arg.message, stack: arg.stack },
                            null,
                            2
                            )
                        );
                    } else if (typeof arg === "object") {
                        try {
                            value = escapeHtml(
                                JSON.stringify(
                                    arg,
                                    (key, value) => {
                                        return typeof value === 'bigint'
                                                    ? value.toString()
                                                    : value;
                                    },
                                2)
                            );
                        } catch {
                            value = escapeHtml(arg);
                        }
                    } else if (typeof arg === "string") {
                        value = escapeHtml(arg)
                    } else {
                        value = escapeHtml("" + arg);
                    }
                    const currentDate = new Date();
                    const hours = ('0' + currentDate.getHours()).slice(-2);
                    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
                    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
                    const milliseconds = ('0' + currentDate.getMilliseconds()).slice(-2);
                    const formattedTime = hours + ':' + minutes + ':' + seconds + "." + milliseconds;
                    const timeTag = "<span style='color: rgb(151 149 149)'>" + formattedTime + "\t" + "</span>";
                    return "<pre style='white-space:pre-wrap; color: red'>" + timeTag + value + "</pre>";
                }).join(" ");
            }
        };
        ${code}
        console = oldConsole;
    `;
    script.innerHTML = consoleCode;
    script.setAttribute("type", "module");

    document.head.appendChild(script);
  }, [editor]);

  useEffect(() => {
    // hot key for inside the editor
    editor?.addAction({
      id: "runit",
      label: "Run it!",
      keybindings: [
        monaco_editor.KeyMod.CtrlCmd | monaco_editor.KeyCode.Enter,
        monaco_editor.KeyMod.WinCtrl | monaco_editor.KeyCode.Enter,
      ],
      contextMenuGroupId: "2_execution",
      run: runCode,
    });
  }, [editor, runCode]);

  // hot key for outside the editor
  //   useHotkeys(["ctrl+enter", "meta+enter"], runCode, []);

  return <Button text={"Run"} onClick={runCode} />;
};
export default RunButton;
