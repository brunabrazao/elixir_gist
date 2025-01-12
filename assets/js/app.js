// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"
import hljs from "highlight.js";

const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");

function updateLineNumbers(value, elementId="#line-numbers") {
  const lineNumberText = document.querySelector(elementId)

  if (!lineNumberText) return;

  const lines = value.split("\n");

  const numbers = lines.map((_, index) => index + 1).join("\n") + "\n"

  lineNumberText.value = numbers
};

const Hooks = {};

Hooks.UpdateLineNumbers = {
  mounted() {
    const lineNumberText = document.querySelector("#line-numbers");

    this.el.addEventListener("input", () => {
      updateLineNumbers(this.el.value);
    });

    this.el.addEventListener("scroll", () => {
      lineNumberText.scrollTop = this.el.scrollTop;
    })

    this.el.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();

        const { selectionStart, selectionEnd } = this.el;

        this.el.value = this.el.value.substring(0, selectionStart) + " \t" + this.el.value.substring(selectionEnd);

        this.el.selectionStart = this.el.selectionEnd = selectionStart + 2;
      }
    });

    this.handleEvent("clear-textareas", () => {
      this.el.value = "";
      lineNumberText.value = "1\n";
    });

    updateLineNumbers(this.el.value);
  },
};

Hooks.Highlight = {
  mounted() {
      let name = this.el.getAttribute("data-name");
      let codeBlock = this.el.querySelector("pre code");
      if (name && codeBlock) {
          codeBlock.className = codeBlock.className.replace(/language-\S+/g, "");
          codeBlock.classList.add(`language-${this.getSyntaxType(name)}`);
          trimmed = this.trimCodeBlock(codeBlock)
          hljs.highlightElement(trimmed);
          updateLineNumbers(trimmed.textContent, "#syntax-numbers")
        }
  },

  getSyntaxType(name) {
      let extension = name.split(".").pop();
      switch (extension) {
          case "txt":
              return "text";
          case "json":
              return "json";
          case "html":
              return "html";
          case "heex":
              return "html";
          case "js":
              return "javascript";
          default:
              return "elixir";
      }
  },

  trimCodeBlock(codeBlock) {
    const lines = codeBlock.textContent.split("\n")
    if (lines.length > 2) {
        lines.shift();
        lines.pop();
    }
    codeBlock.textContent = lines.join("\n")
    return codeBlock
  }
};

Hooks.CurrentYear = {
  mounted() {
    this.el.textContent = new Date().getFullYear();
  }
};

Hooks.CopyToClipboard = {
  mounted() {
    this.el.addEventListener("click", e => {
      const textToCopy = this.el.getAttribute("data-clipboard-gist")

      if(textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.el.textContent = "Copied!"
          setTimeout(() => {
            // reset to the initial state where it renders the copy icon
            //         <img src="/images/copy.svg" alt="Copy Button" />
            this.el.innerHTML = `<img src="/images/copy.svg" alt="Copy Button" />`
          }, 1000)
        });
      }
    });
  }
};

Hooks.ToggleEdit = {
  mounted() {
    this.el.addEventListener("click", e => {
      let edit = document.getElementById("edit-section");
      let syntax = document.getElementById("syntax-section");

      if (edit && syntax) {
        edit.style.display = "block";
        syntax.style.display = "none";
      }
    })
  }
};

const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: Hooks
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", () => topbar.show(300));
window.addEventListener("phx:page-loading-stop", () => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;