// TODO: send offer to phoenix channel
// TODO: decide the format of the room-id

import { Socket } from "phoenix";

export async function getLocalOffer() {
  const peer = new RTCPeerConnection();

  const dataChannel = peer.createDataChannel("data");
  dataChannel.onmessage = (e) => {
    console.log("message");
    console.log(e);
  };
  dataChannel.onerror = (e) => {
    console.log("error");
    console.log(e);
  };

  return await peer.createOffer();
}
