import fs from 'fs';

function globalReplace(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes('NotificationContext.jsx')) {
    code = code.replace(
      /import \{.+?\} from 'react'/,
      match => match + "\nimport { toast, confirmDialog } from '../contexts/NotificationContext.jsx'"
    );
  }

  // Find all functions that need to be async
  code = code.replace(/const (\w+) = \((.*?)\) => {([\s\S]*?window\.confirm[\s\S]*?)}/g, (match, funcName, args, body) => {
    if (match.includes('async')) return match; 
    return `const ${funcName} = async (${args}) => {${body}}`;
  });

  // Specifically fix functions that are declared like "function handleX() {}"
  code = code.replace(/function (\w+)\((.*?)\) {([\s\S]*?window\.confirm[\s\S]*?)}/g, (match, funcName, args, body) => {
    if (match.includes('async')) return match; 
    return `async function ${funcName}(${args}) {${body}}`;
  });

  code = code.replace(/window\.confirm\((.*?)\)/g, 'await confirmDialog($1)');

  code = code.replace(/alert\(([\s\S]*?)\)/g, (match, p1) => {
    const text = p1.toLowerCase();
    if (text.includes('error') || text.includes('❌') || text.includes('no se pudo')) {
      return `toast.error(${p1})`;
    } else if (text.includes('éxito') || text.includes('correctamente') || text.includes('✅') || text.includes('actualizado')) {
      return `toast.success(${p1})`;
    } else {
      return `toast.info(${p1})`;
    }
  });

  fs.writeFileSync(filePath, code);
  console.log(filePath + ' updated successfully.');
}

const files = [
  'src/pages/AdminPage.jsx',
  'src/pages/DashboardPage.jsx',
  'src/pages/ContactoPage.jsx',
  'src/pages/GaleriaPage.jsx',
  'src/pages/HomePage.jsx',
  'src/pages/PerfilPublicoPage.jsx',
  'src/pages/PortafolioPage.jsx',
  'src/components/CreatePostModal.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    globalReplace(f);
  }
});
