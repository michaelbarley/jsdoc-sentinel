<p align="center">
  <img src="https://github.com/user-attachments/assets/9e4ed4d2-b88d-4093-a4f8-a1032496a219"/>
</p>

# JSDoc Sentinel

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code--Marketplace-Install-blue.png)](#)
[![Version](https://img.shields.io/badge/version-1.0.1-brightgreen.png)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.png)](#)

> **Real‑time guardrails for your TypeScript & JavaScript docs**

**JSDoc Sentinel** instantly flags outdated or inconsistent JSDoc comments whenever you save—no quick fixes, just clear, actionable warnings so your documentation never falls behind your code.

---

## 🎬 Live Preview
![Screen Recording 2025-06-30 at 12 52 20](https://github.com/user-attachments/assets/2b5d885c-eae9-4677-87b9-7e60dbf36acb)


## 🚩 Why You’ll Love It

* ⚠️ **Spot Drift Instantly**: Yellow squiggles under mismatched `@param`, `@returns`, or `@throws` tags show exactly where your docs and code disagree.
* 🔎 **Comprehensive Audits**: Run **JSDoc Sentinel: Audit Workspace** to generate a Problems list of every doc drift in your project.
* 🔌 **Zero Friction**: No configuration, no performance overhead—install and go.
* 🔧 **Built to Last**: SOLID/KISS core (1,000 LOC), 100% Jest coverage, modular design for easy extension.

---

## 🚀 Key Benefits

* **Catch Bugs Sooner**: Outdated docs lead to wrong assumptions—Sentinel flags divergences before they cause headaches.
* **Confident Refactoring**: Large-scale changes? Audit your public API docs to ensure nothing slips through.
* **Faster Reviews**: Reviewers can trust comments instead of digging through implementation.
* **Save Mental Bandwidth**: Automate the grunt work and focus on what matters—your code.

---

## 🛠️ Installation

**From the Marketplace**

1. Open **Extensions** (`⇧⌘X` / `Ctrl+Shift+X`).
2. Search **JSDoc Sentinel**.
3. Click **Install** and reload.

**From VSIX**

```bash
git clone https://github.com/michaelbarley/jsdoc-sentinel.git
cd jsdoc-sentinel
npm ci && npm run build
vsce package
```

1. In VS Code, run **Extensions: Install from VSIX…** and select the `.vsix`.

---

## 🎯 Usage

1. **Edit & Save** a `.ts`, `.tsx`, `.js`, or `.jsx` file—watch Sentinel underline any doc drift.
2. **Audit Entire Workspace**:

   * Press `⇧⌘P` / `Ctrl+Shift+P` → **JSDoc Sentinel: Audit Workspace**.
   * Open the **Problems** panel to review all mismatches.

Hover over each squiggle for precise messages like:

* `@param 'foo' missing`
* `@returns is obsolete`
* `@throws 'Error' missing`

---

## 🧩 Configuration

✨ **No settings required**—defaults work out of the box.

---

## 🧑‍💻 Development

```bash
git clone https://github.com/michaelbarley/jsdoc-sentinel.git
cd jsdoc-sentinel
npm ci
npm run watch
```

* Press **F5** to launch an Extension Development Host.

---

## ✅ Testing & CI

* **Lint**: `npm run lint`
* **Test & Coverage**: `npm run test:coverage`
* **CI**: GitHub Actions enforces linting, tests, and coverage metrics on every push.

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

Released under the [MIT License](LICENSE).

<sub>**JSDoc Sentinel** — keeping your comments honest, one warning at a time.</sub>
