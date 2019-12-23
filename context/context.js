import { createContext } from 'react';

const Context = createContext({
    doReset: () => { },
    toSymbol: ()=>{ },
    winner : Number,
});

export default Context;