import os
import zipfile
from datetime import datetime

root_dir = r'c:\Users\Joseph Joestar\Desktop\alpha'
dist_dir = os.path.join(root_dir, 'dist')

timestamp = datetime.now().strftime('%Y%m%d_%H%M')
zip_filename = os.path.join(root_dir, f'austral_produccion_PERFECTO_{timestamp}.zip')

# Directorios/archivos adicionales de root que deben ir al zip
extra_items = ['api', 'uploads', '.env', '.htaccess']

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # 1. Agregar el CONTENIDO de dist/ a la raíz del zip
    if os.path.exists(dist_dir):
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # relpath desde dist_dir hace que vayan a la raíz del zip
                arcname = os.path.relpath(file_path, start=dist_dir)
                zipf.write(file_path, arcname)
    
    # 2. Agregar los elementos extra de la raíz de alpha
    for item in extra_items:
        item_path = os.path.join(root_dir, item)
        if os.path.exists(item_path):
            if os.path.isdir(item_path):
                for root_sub, dirs_sub, files_sub in os.walk(item_path):
                    for file in files_sub:
                        file_path = os.path.join(root_sub, file)
                        # relpath desde root_dir para que mantengan su estructura (ej: api/db.php)
                        arcname = os.path.relpath(file_path, start=root_dir)
                        zipf.write(file_path, arcname)
            else:
                zipf.write(item_path, item)

print(f'ZIP creado exitosamente en: {zip_filename}')
