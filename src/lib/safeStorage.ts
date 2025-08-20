export type SafeStorage = { getItem:(k:string)=>string|null; setItem:(k:string,v:string)=>void; removeItem:(k:string)=>void; clear:()=>void }
const memory = new Map<string,string>();
const memoryStore: SafeStorage = {
  getItem:(k)=> memory.has(k)? memory.get(k)! : null,
  setItem:(k,v)=> { memory.set(k,v); },
  removeItem:(k)=> { memory.delete(k); },
  clear:()=> { memory.clear(); }
};
export const safeStorage: SafeStorage = (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
  ? {
      getItem:(k)=> window.localStorage.getItem(k),
      setItem:(k,v)=> window.localStorage.setItem(k,v),
      removeItem:(k)=> window.localStorage.removeItem(k),
      clear:()=> window.localStorage.clear()
    }
  : memoryStore;