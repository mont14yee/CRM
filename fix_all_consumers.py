import os, glob, re

for file in glob.glob('src/screens/*.tsx'):
    with open(file, 'r') as f:
        content = f.read()

    # Find <ConfirmDialog tags and replace onClose with onCancel inside them
    # Because <ConfirmDialog could be multi-line, we can just replace 'onClose=' with 'onCancel=' 
    # if it's near ConfirmDialog, or just do a generic replace but be careful.
    # To be safe, we can use a regex that matches <ConfirmDialog ... /> and replaces onClose
    def repl(m):
        return m.group(0).replace('onClose=', 'onCancel=')
    
    content = re.sub(r'<ConfirmDialog[^>]+>', repl, content)

    with open(file, 'w') as f:
        f.write(content)

