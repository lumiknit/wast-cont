import { Component } from "solid-js";

const Header: Component = () => {
  return (
    <header>
      <h1> WAST REPL </h1>
      This page is to test multiple WebAssembly Text (WAST) files in the
      browser. You can write your WAST code in the editor and see the output
      below. Also, in your code, you can import anythings exported from the
      previous code. Useful references:
      <ul>
        <li>
          WASM2 Reference:
          <a href="https://webassembly.github.io/spec/core/">wasm.github</a>
        </li>
      </ul>
      <br />
      Note that for each code, `_start` function will be called automatically.
    </header>
  );
};

export default Header;
