import { create } from "zustand"
export type Msg = { id: string; role: "user" | "assistant"; content: string }
type State = {
  messages: Msg[]; sending: boolean;
  add: (m: Msg) => void; reset: () => void; setSending: (v: boolean) => void;
}
export const useChat = create<State>((set) => ({
  messages: [],
  sending: false,
  add: (m) => set((s) => ({ messages: [...s.messages, m] })),
  reset: () => set({ messages: [], sending: false }),
  setSending: (v) => set({ sending: v }),
}))
