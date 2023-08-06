import {createContext} from 'react';
import {io, Socket} from 'socket.io-client';
import {NEXT_PUBLIC_NEST_API_URL} from "@/blockchain/ergo/constants";

export const socket = (isMainnet: boolean) => io(NEXT_PUBLIC_NEST_API_URL(isMainnet));
export const WebsocketContext = createContext<(isMainnet: boolean) => Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;