import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Message {
  'content' : string,
  'role' : string,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'clearConversation' : ActorMethod<[], undefined>,
  'getConversationHistory' : ActorMethod<[], Array<Message>>,
  'sendMessage' : ActorMethod<[string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
