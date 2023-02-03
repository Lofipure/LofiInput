import { createContext } from 'react';

interface ILofiInputContext {
  onChange?: () => void;
}

const LofiInputContext = createContext<ILofiInputContext>({});

export default LofiInputContext;
