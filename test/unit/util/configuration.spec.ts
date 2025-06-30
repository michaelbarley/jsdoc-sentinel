import * as vscode from "vscode";
import { config } from "../../../src/util/configuration";

describe("Extension Configuration", () => {
  beforeAll(() => {
    (vscode.workspace.getConfiguration as any) = jest.fn().mockReturnValue({
      get: (key: string, def: boolean) => (key === "enableAI" ? true : def),
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("reads enableAI from configuration", () => {
    expect(config.enableAI).toBe(true);
  });
});
