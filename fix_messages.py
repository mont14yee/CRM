import re

with open('src/context/MessagesContext.tsx', 'r') as f:
    messages = f.read()

# Add messagesForClient type
messages = messages.replace(
    "lastMessageForClient: (clientId: string) => MessageItem | undefined;",
    "messagesForClient: (clientId: string) => MessageItem[];\n  lastMessageForClient: (clientId: string) => MessageItem | undefined;"
)

# Add messagesForClient function
messages = messages.replace(
    "const lastMessageForClient = (clientId: string) => {",
    """const messagesForClient = (clientId: string) => {
    return messages.filter((m) => m.clientId === clientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const lastMessageForClient = (clientId: string) => {"""
)

# Add messagesForClient to provider value
messages = messages.replace(
    "value={{ messages, addMessage, deleteMessage, lastMessageForClient }}",
    "value={{ messages, addMessage, deleteMessage, messagesForClient, lastMessageForClient }}"
)

with open('src/context/MessagesContext.tsx', 'w') as f:
    f.write(messages)
