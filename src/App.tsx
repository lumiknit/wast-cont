import { createSignal, For, onMount, Show } from "solid-js";
import toast, { Toaster } from "solid-toast";

import Header from "./Header";
import WASTEditor from "./WASTEditor";
import wabt from "wabt";

type HistoryEntry = {
  wast: string;
  wasm: any;
  inst: WebASsembly.WebAssemblyInstantiatedSource;
};

const App = () => {
  const [codeReset, setCodeReset] = createSignal(undefined, { equals: false });
  const [code, setCode] = createSignal("");

  const [modIdx, setModIdx] = createSignal(0);
  const [error, setError] = createSignal<string | undefined>();
  const [returns, setReturns] = createSignal<any[]>([]);

  const [history, setHistory] = createSignal<HistoryEntry[]>([]);

  const resetAllStates = () => {
    setError();
  };

  // Main runner
  const bgRun = async () => {
    resetAllStates();

    const modName = `mod${modIdx()}`;
    setModIdx((x) => x + 1);

    const wast = code();
    console.log("Original wast", wast);

    try {
      // Parse the wast to wasm
      const wabtInstance = await wabt();
      const wasm = wabtInstance.parseWat(modName, wast);
      const { buffer } = wasm.toBinary({});
      console.log(wasm.toText({}));

      // Gather exports from histroy
      const exports = {};
      const hs = history();
      for (let i = hs.length - 1; i >= 0; i--) {
        const inst = hs[i].inst;
        const exp = inst.instance.exports;
        Object.entries(exp).forEach(([name, value]) => {
          exports[name] = value;
        });
      }

      // Compile
      const inst = await WebAssembly.instantiate(buffer, exports);

      // Run _start function
      console.log(inst.instance.exports);
      const result = inst.instance.exports._start();
      console.log("Result", result);
      setReturns(result);

      const historyEntry = {
        wast: wasm.toText({}),
        wasm: buffer,
        inst,
      };
      setHistory((h) => [historyEntry, ...h]);

      setCodeReset();
    } catch (e) {
      console.error(e);
      setError(e.message);
      throw e;
    }
  };

  const handleRun = () => {
    toast.promise(bgRun(), {
      loading: "Running...",
      success: "Done!",
      error: "Error!",
    });
  };

  return (
    <>
      <Toaster />
      <div class="container">
        <Header />

        <h2> Code </h2>
        <WASTEditor
          initDocument=""
          resetSignal={codeReset}
          onChange={(value) => {
            setCode(value);
          }}
        />

        <button class="mt-2 w-100 btn btn-primary" onClick={handleRun}>
          Run
        </button>

        <Show when={error()}>
          <div class="alert alert-danger" role="alert">
            <pre>{error()}</pre>
          </div>
        </Show>

        <Show when={returns()}>
          <div class="alert alert-info" role="alert">
            <pre>{returns()}</pre>
          </div>
        </Show>

        <h1> History </h1>

        <For each={history()}>
          {(entry) => (
            <div class="card m-2 p-2">
              WASM Size: {entry.wasm.length}
              <pre>{entry.wast}</pre>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
