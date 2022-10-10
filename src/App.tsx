import { useState, useEffect } from "react";

const App: React.FC = () => {
  const [script, setScript] = useState("return 1 + 1");
  const [result, setResult] = useState("");

  const exec = () => {
    const iframe = document.getElementById("iframe")! as HTMLIFrameElement;
    setTimeout(() => {
      const iframeWindow = iframe.contentWindow;
      iframeWindow?.postMessage({ script }, "*");
    }, 500);
  };

  useEffect(() => {
    const msgReceive = (e: MessageEvent) => {
      if ("from" in e.data && e.data.from === "iframe" && "result" in e.data) {
        console.log(e.data.result);
        setResult(e.data.result);
      }
    };
    window.addEventListener("message", msgReceive);

    return () => window.removeEventListener("message", msgReceive);
  }, []);

  return (
    <div>
      <textarea
        value={script}
        onChange={(e) => {
          setScript(e.target.value);
        }}
      />
      <button onClick={() => exec()}>exec</button>
      <div>{result}</div>
      <iframe
        id="iframe"
        hidden
        sandbox="allow-scripts"
        srcDoc={`
          <script>
            window.addEventListener("message", (e) => {
              const f = new Function(e.data.script);
              window.parent.postMessage({ result: f(), from: "iframe" }, "${window.location.origin}")
            });
          </script>
      `}
      />
    </div>
  );
};

export default App;
