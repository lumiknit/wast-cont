import { Component, Getter, onMount, onCleanup, createEffect } from "solid-js";

import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { wast } from "@codemirror/lang-wast";

import { wastOptions } from "./wast-cm6-options";

type Props = {
  initDocument?: string;
  resetSignal?: Getter<any>;
  onChange?: (doc: string) => void;
};

const defaultCode = `
(module
  (export "_start" (func $start))
  (func $start
  )
)`.trim();
const defaultCursorSnippet = "  (func $start";
const defaultCursorPos =
  defaultCode.indexOf(defaultCursorSnippet) + defaultCursorSnippet.length;

const WASTEditor: Component<Props> = (props) => {
  let wrapRef: HTMLDivElement;

  let state: EditorState | undefined;
  let view: EditorView | undefined;

  let updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      props.onChange && props.onChange(update.state.doc.toString());
    }
  });

  const setupCompletion = (ctx: CompletionContext) => {
    let word = ctx.matchBefore(/\w+$/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    return {
      from: word.from,
      options: wastOptions,
    };
  };

  const reset = () => {
    if (!view) return;
    console.log("reset");
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: defaultCode,
      },
    });
    view.dispatch({
      selection: {
        anchor: defaultCode.indexOf("\n") + 1,
        head: defaultCode.indexOf("\n") + 1,
      },
    });
  };

  createEffect(() => {
    props.resetSignal?.();
    reset();
  });

  onMount(() => {
    let tabSize = new Compartment();
    let viewTheme = EditorView.theme({
      "&": { maxHeight: "60svh" },
      ".cm-gutter,.cm-content": { minHeight: "5rem" },
      ".cm-scroller": { overflow: "auto" },
    });
    state = EditorState.create({
      doc: props.initDocument || "",
      extensions: [
        basicSetup,
        wast(),
        tabSize.of(EditorState.tabSize.of(2)),
        updateListener,
        viewTheme,
        autocompletion({
          override: [setupCompletion],
        }),
      ],
    });
    view = new EditorView({
      state: state,
      parent: wrapRef,
    });

    reset();
  });

  onCleanup(() => {});
  return <div class="ed-wast" ref={wrapRef!}></div>;
};

export default WASTEditor;
