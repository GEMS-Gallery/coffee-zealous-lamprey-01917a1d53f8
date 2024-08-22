import Func "mo:base/Func";
import Int "mo:base/Int";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

actor {
  // Define Message type
  type Message = {
    role: Text;
    content: Text;
    timestamp: Int;
  };

  // Stable variable to store conversation history
  stable var conversationHistory: [Message] = [];

  // Function to send a message and get AI response
  public func sendMessage(message: Text): async Text {
    let userMessage: Message = {
      role = "user";
      content = message;
      timestamp = Time.now();
    };

    // Add user message to history
    conversationHistory := Array.append(conversationHistory, [userMessage]);

    // Generate AI response (placeholder)
    let aiResponse = "This is a placeholder AI response. The actual AI integration is not implemented in this example.";

    let aiMessage: Message = {
      role = "ai";
      content = aiResponse;
      timestamp = Time.now();
    };

    // Add AI message to history
    conversationHistory := Array.append(conversationHistory, [aiMessage]);

    return aiResponse;
  };

  // Function to get conversation history
  public query func getConversationHistory(): async [Message] {
    return conversationHistory;
  };

  // Function to clear conversation history
  public func clearConversation(): async () {
    conversationHistory := [];
  };
}