import { log } from "../../../src/util/Logger";

describe("Logger", () => {
  let debugSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.JSDOC_SENTINEL_LOG;
  });

  it("logs debug when level=debug", () => {
    process.env.JSDOC_SENTINEL_LOG = "debug";
    log.debug("d");
    expect(debugSpy).toHaveBeenCalledWith("[JSDS] ", "d");
  });

  it("suppresses debug when level higher than debug", () => {
    process.env.JSDOC_SENTINEL_LOG = "info";
    log.debug("d");
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it("always logs info at info level", () => {
    process.env.JSDOC_SENTINEL_LOG = "info";
    log.info("i");
    expect(infoSpy).toHaveBeenCalledWith("[JSDS] ", "i");
  });

  it("always logs warn/error regardless of level", () => {
    process.env.JSDOC_SENTINEL_LOG = "silent";
    log.warn("w");
    log.error("e");
    expect(warnSpy).toHaveBeenCalledWith("[JSDS] ", "w");
    expect(errorSpy).toHaveBeenCalledWith("[JSDS] ", "e");
  });
  it("suppresses all output when level=silent", () => {
    process.env.JSDOC_SENTINEL_LOG = "silent";
    log.debug("should vanish");
    expect(debugSpy).not.toHaveBeenCalled();
  });
  it("suppresses info when level=error", () => {
    process.env.JSDOC_SENTINEL_LOG = "error";
    log.info("no-show");
    expect(infoSpy).not.toHaveBeenCalled();
  });
  it("suppresses debug when level=error", () => {
    process.env.JSDOC_SENTINEL_LOG = "error";
    log.debug("invisible");
    expect(debugSpy).not.toHaveBeenCalled();
  });
  it("defaults to info when the env var is not set", () => {
    log.info("default-info");
    expect(infoSpy).toHaveBeenCalledWith("[JSDS] ", "default-info");
  });
});
