import { createContext } from 'react';

const Context = createContext({
    clickNumber: Number,
    handleShowLightBox: () =>{}
});

export default Context;