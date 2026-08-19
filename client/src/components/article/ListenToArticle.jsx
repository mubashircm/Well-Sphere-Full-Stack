import { useEffect, useState } from "react";
import Button from "../ui/Button.jsx";

function ListenToArticle({ text }) {
  const [state, setState] = useState("idle");
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function play() {
    if (!supported) return;
    if (state === "paused") { window.speechSynthesis.resume(); setState("playing"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    window.speechSynthesis.speak(utterance);
    setState("playing");
  }

  function pause() { window.speechSynthesis.pause(); setState("paused"); }

  if (!supported) return null;
  return <section className="listen-control" aria-label="Listen to article"><strong>Listen to article</strong><div>{state === "playing" ? <Button variant="secondary" type="button" onClick={pause}>Pause</Button> : <Button variant="secondary" type="button" onClick={play}>{state === "paused" ? "Resume" : "Play"}</Button>}</div></section>;
}

export default ListenToArticle;
