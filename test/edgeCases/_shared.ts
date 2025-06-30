import fs from "fs";
import path from "path";
import { JSDocAnalyzer } from "../../src/analyzer/JSDocAnalyzer";
import { CompositeParser } from "../../src/parser/CompositeParser";
import { JsDocExtractor } from "../../src/comment/JsDocExtractor";

export const analyzer = new JSDocAnalyzer(
  new CompositeParser(),
  new JsDocExtractor()
);

export function load(lang: "js" | "ts", file: string): string {
  return fs.readFileSync(
    path.join(__dirname, `../fixtures/${lang}/${file}.${lang}`),
    "utf8"
  );
}

