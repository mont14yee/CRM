import re
import glob

for filename in glob.glob('src/context/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()

    # Fix ClientsContext
    if "initialClients: Client[] =" in content:
        content = re.sub(r'const initialClients: Client\[\] = \[.*?\];', 'const initialClients: Client[] = [];', content, flags=re.DOTALL)
    
    # Fix ProjectsContext
    if "'conneq-projects', [" in content:
        content = re.sub(r"useLocalStorage<ProjectItem\[\]>\('conneq-projects', \[.*?\]\);", "useLocalStorage<ProjectItem[]>('conneq-projects', []);", content, flags=re.DOTALL)
        
    with open(filename, 'w') as f:
        f.write(content)
