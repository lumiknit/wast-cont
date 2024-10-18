/* @refresh reload */
import { render } from "solid-js/web";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.scss";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
