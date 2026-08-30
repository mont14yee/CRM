import re

with open('src/context/ClientsContext.tsx', 'r') as f:
    clients = f.read()

seed = """const initialClients: Client[] = [
  {
    id: generateId(),
    name: 'Acme Corp',
    company: 'Acme Corporation',
    email: 'contact@acme.example.com',
    phone: '555-0198',
    status: 'active',
    tags: ['enterprise', 'software'],
    notes: 'Key account for Q3.',
    avatarSeed: 'acmecorp',
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Jane Doe',
    company: 'Startup Inc',
    email: 'jane@startup.example.com',
    phone: '555-0200',
    status: 'lead',
    tags: ['saas', 'startup'],
    notes: 'Interested in premium tier.',
    avatarSeed: 'janedoe',
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'John Smith',
    company: 'Smith & Co',
    email: 'john@smith.example.com',
    phone: '555-0300',
    status: 'past',
    tags: ['retail'],
    notes: 'Project completed in Jan.',
    avatarSeed: 'johnsmith',
    createdAt: new Date().toISOString()
  }
];

export function ClientsProvider"""

clients = clients.replace('export function ClientsProvider', seed)

clients = clients.replace(
    "const [clients, setClients] = useLocalStorage<Client[]>('conneq-clients', []);",
    "const [clients, setClients] = useLocalStorage<Client[]>('conneq-clients', initialClients);"
)

with open('src/context/ClientsContext.tsx', 'w') as f:
    f.write(clients)
