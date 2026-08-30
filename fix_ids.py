import os, glob

context_files = glob.glob('src/context/*.tsx')

for file in context_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace the import
    content = content.replace("import { generateId } from '../utils';", "import { generateId } from '../utils/id';")
    
    with open(file, 'w') as f:
        f.write(content)
