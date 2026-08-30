import re

# DASHBOARD
with open('src/screens/Dashboard.tsx', 'r') as f:
    dashboard = f.read()

dashboard = dashboard.replace('const { name, avatarUrl } = useProfile();', 'const { profile } = useProfile();\n  const { name, avatarSeed } = profile;')
dashboard = dashboard.replace('src={avatarUrl}', 'src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`}')

with open('src/screens/Dashboard.tsx', 'w') as f:
    f.write(dashboard)

# SETTINGS
with open('src/screens/Settings.tsx', 'r') as f:
    settings = f.read()

settings = settings.replace(
    'const { name, email, businessName, avatarUrl, updateProfile } = useProfile();',
    'const { profile, updateProfile } = useProfile();\n  const { name, email, businessName, avatarSeed } = profile;'
)
settings = settings.replace('src={avatarUrl}', 'src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`}')
settings = settings.replace('avatarUrl:', 'avatarSeed:')

with open('src/screens/Settings.tsx', 'w') as f:
    f.write(settings)
