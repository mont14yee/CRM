import re
with open("src/types.ts", "r") as f:
    content = f.read()

# Add ClientStatus
content = content.replace("export type Tone =", "export type ClientStatus = 'lead' | 'active' | 'past';\nexport type Tone =")

# Replace Client
client_new = """export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  tags: string[];
  notes?: string;
  avatarSeed: string;
  createdAt: string;
}"""
content = re.sub(r'export interface Client \{[^\}]+\}', client_new, content)

# MessageChannel & MessageItem
msg_new = """export type MessageChannel = 'note' | 'call' | 'email' | 'meeting' | 'sms';

export interface MessageItem {
  id: string;
  clientId: string;
  channel: MessageChannel;
  body: string;
  createdAt: string;
  pinned?: boolean;
}"""
content = re.sub(r'export interface ClientMessage \{[^\}]+\}', msg_new, content)

# UserProfile
profile_new = """export interface UserProfile {
  name: string;
  email: string;
  businessName?: string;
  avatarSeed: string;
}"""
content = content + "\n" + profile_new + "\n"

# Rename 'messages' to 'clients' in TabState
content = content.replace("'messages'", "'clients'")

with open("src/types.ts", "w") as f:
    f.write(content)
