export const idlFactory = ({ IDL }) => {
  const Message = IDL.Record({
    'content' : IDL.Text,
    'role' : IDL.Text,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'clearConversation' : IDL.Func([], [], []),
    'getConversationHistory' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'sendMessage' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
