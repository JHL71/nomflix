import { atom, selector } from "recoil";


const state = atom({
  key: "key",
  default: []
})

const stateSelector = selector({
  key: "selectorKey",
  get: ({get}) => {
    return ;
  },
  set: ({set}, value) => {
    return ;
  }
})