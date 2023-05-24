
import * as monaco_editor from "monaco-editor";
import Button from "./button";

const RunButton = ({ editor }: { editor: monaco_editor.editor.IStandaloneCodeEditor}) => {

  async function runCode() {
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
        console = {
            log: (...args) => {
                const parent = document.createElement("div");
                parent.innerHTML = args.map((arg) => {
                if (arg instanceof Error) {
                    return (
                    "<pre style='white-space:pre-wrap'>" +
                    escapeHtml(
                        JSON.stringify(
                        { ...arg, message: arg.message, stack: arg.stack },
                        null,
                        2
                        )
                    ) +
                    "</pre>"
                    );
                } else if (typeof arg === "object") {
                    try {
                    return (
                        "<pre style='white-space:pre-wrap'>" +
                        escapeHtml(
                        JSON.stringify(
                            arg,
                            (key, value) => {
                                return typeof value === 'bigint'
                                            ? value.toString()
                                            : value;
                            },
                        2)
                        ) +
                        "</pre>"
                    );
                    } catch {
                    return escapeHtml(arg);
                    }
                } else if (typeof arg === "string") {
                    return (
                    "<pre style='white-space:pre-wrap'>" +
                    escapeHtml(arg) +
                    "</pre>"
                    );
                } else {
                    return arg;//escapeHtml("" + arg);
                }
                }).join(" ");
                document
                .getElementById("editor-container")
                .appendChild(parent);
            }
        };
        ${code}
    `;
    script.innerHTML = consoleCode;
    script.setAttribute("type", "module");

    document.head.appendChild(script);
  }
    return <Button
        text={"Run"}
        onclick={runCode}
    ></Button>
}
export default RunButton;