/**
Module for the WebASsembly Text format code-mirror6 auto-complete options
*/

const join = (fst: string[], snd: string[]) => {
  const res = [];
  for (const f of fst) {
    for (const s of snd) {
      res.push(f + "." + s);
    }
  }
  return res;
};

const intTypes = ["i32", "i64"];
const floatTypes = ["f32", "f64"];
const numTypes = [...intTypes, ...floatTypes];
const vecTypes = ["v128"];
const refTypes = ["funcref", "externref"];
const heapTypes = ["func", "extern"];
const funcTypes = ["param", "result"];
const globalTypes = ["mut", "mutable", "const", "var"];
const otherKeywords = ["module", "import", "export", "type"];

const types = [...numTypes, ...vecTypes, ...refTypes];

const keywords = [
  ...refTypes,
  ...heapTypes,
  ...funcTypes,
  ...globalTypes,
  ...otherKeywords,
];

const numConsts = ["inf", "nan"];

const recordKinds = [
  "types",
  "funcs",
  "tables",
  "mems",
  "globals",
  "elem",
  "data",
  "locals",
  "labels",
  "typedefs",
];

const ctrlInstrs = [
  "block",
  "loop",
  "if",
  "else",
  "end",

  "nop",
  "unreachable",
  "br",
  "br_if",
  "br_table",
  "return",
  "call",
  "call_indirect",
];

const refInstrs = join(["ref"], ["null", "is_null", "func"]);

const paramInstrs = ["drop", "select"];

const varInstrs = [
  "local.get",
  "local.set",
  "local.tee",
  "global.get",
  "global.set",
];

const tableInstrs = join(
  ["table"],
  ["get", "set", "size", "grow", "fill", "copy", "init"],
);

const elemInstrs = join(["elem"], ["drop"]);

const memInstrs = (() => {
  const nums = join(numTypes, ["load", "store"]);
  const ints = join(intTypes, [
    "load8_s",
    "load8_u",
    "load16_s",
    "load16_u",
    "store8",
    "store16",
  ]);
  const i64s = join(intTypes, ["load32_s", "load32_u", "store32"]);
  const ms = join(["memory"], ["size", "grow", "fill", "copy", "init"]);
  const ds = join(["data"], ["drop"]);
  return [...nums, ...ints, ...i64s, ...ms, ...ds];
})();

const numericInstrs = (() => {
  const consts = join(numTypes, ["const"]);
  const commons = join(numTypes, ["add", "sub", "mul", "eq", "ne"]);
  const ints = join(intTypes, [
    "clz",
    "ctz",
    "popcnt",
    "div_s",
    "div_u",
    "rem_s",
    "rem_u",
    "and",
    "or",
    "xor",
    "shl",
    "shr_s",
    "shr_u",
    "rotl",
    "rotr",
    "eqz",
    "lt_s",
    "lt_u",
    "gt_s",
    "gt_u",
    "le_s",
    "le_u",
    "ge_s",
    "ge_u",
    "trunc_f32_s",
    "trunc_f32_u",
    "trunc_f64_s",
    "trunc_f64_u",
    "trunc_sat_f32_s",
    "trunc_sat_f32_u",
    "trunc_sat_f64_s",
    "trunc_sat_f64_u",
    "extend8_s",
    "extend16_s",
  ]);

  const floats = join(floatTypes, [
    "abs",
    "neg",
    "ceil",
    "floor",
    "trunc",
    "nearest",
    "sqrt",
    "div",
    "min",
    "max",
    "copysign",
    "lt",
    "gt",
    "le",
    "ge",
    "convert_i32_s",
    "convert_i32_u",
    "convert_i64_s",
    "convert_i64_u",
  ]);

  const i32s = join(["i32"], ["wrap_i64", "reinterpret_f32"]);
  const i64s = join(
    ["i64"],
    ["extend_i32_s", "extend_i32_u", "reinterpret_f64", "extend32_s"],
  );
  const f32s = join(["f32"], ["demote_f64", "reinterpret_i32"]);
  const f64s = join(["f64"], ["promote_f32", "reinterpret_i64"]);

  return [
    ...consts,
    ...commons,
    ...ints,
    ...floats,
    ...i32s,
    ...i64s,
    ...f32s,
    ...f64s,
  ];
})();

const instrs = [
  ctrlInstrs,
  refInstrs,
  paramInstrs,
  varInstrs,
  tableInstrs,
  elemInstrs,
  memInstrs,
  numericInstrs,
].flat();

export const wastOptions = (() => {
  return [
    types.map((label) => ({ label, type: "type" })),
    keywords.map((label) => ({ label, type: "keyword" })),
    instrs.map((label) => ({ label, type: "function" })),
  ].flat();
})();
