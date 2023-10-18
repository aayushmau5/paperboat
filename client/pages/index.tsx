import { log } from "console";
import { Inconsolata } from "next/font/google";
import { useEffect } from "react";

const inconsolata = Inconsolata({ subsets: ["latin"] });

function handleDataChannel(dc: RTCDataChannel) {
  dc.onmessage = (e) => {
    log("message");
    log(e);
  };
  dc.onclose = (e) => {
    log("data channel closed");
    log(e);
  };
  dc.onerror = (e) => {
    log("error on data channel");
    log(e);
  };
}

export default function Home() {
  useEffect(() => {
    const iceConfig: RTCConfiguration = {
      iceServers: [{ urls: "" }],
    };
    const peer = new RTCPeerConnection(iceConfig);
    const dc = peer.createDataChannel("data-channel");
    handleDataChannel(dc);
    peer.onicecandidate = (e) => {
      log("ice candidate found");
      // TODO: generate an offer and send it to other peer
    };
    const offer = peer.createOffer();
    const answer = peer.createAnswer();
  }, []);

  return (
    <main
      className={`text-lg flex min-h-screen flex-col items-center justify-between p-24 ${inconsolata.className}`}
    >
      Setting up webrtc connection
    </main>
  );
}
