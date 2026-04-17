import fs from 'fs';

function fixAsync(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Regex to match "const xyz = (...) => {"
  // We'll replace it with "const xyz = async (...) => {" if not already async
  code = code.replace(/(const|let)\s+(\w+)\s*=\s*\((.*?)\)\s*=>\s*\{/g, (match, p1, p2, p3, offset, string) => {
    // Check if the body of this specific function has await confirmDialog.
    // This is a naive way: check if the text following this match up to the next "const " or "function " has it.
    // A better way: just make EVERYTHING that contains await confirmDialog in its vicinity async.
    return match;
  });

  // Alternative naive string replaces:
  code = code.replace(/const handleDelete = \(/g, 'const handleDelete = async (');
  code = code.replace(/const applySettings = \(/g, 'const applySettings = async (');
  code = code.replace(/const handleSendAction = \(/g, 'const handleSendAction = async (');
  code = code.replace(/const removerParticipante = \(/g, 'const removerParticipante = async (');
  code = code.replace(/const eliminarVideo = \(/g, 'const eliminarVideo = async (');
  code = code.replace(/const eliminarGaleria = \(/g, 'const eliminarGaleria = async (');
  code = code.replace(/const handleSendTemporal = \(/g, 'const handleSendTemporal = async (');
  code = code.replace(/const eliminarNoticia = \(/g, 'const eliminarNoticia = async (');

  // Let's do a more robust approach just searching for standard patterns:
  let lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('await confirmDialog')) {
      // Look upwards for the closest function declaration
      for (let j = i; j >= 0; j--) {
        if (lines[j].includes('=> {') && !lines[j].includes('async')) {
           lines[j] = lines[j].replace(/(\w+)\s*=\s*\(/, '$1 = async (');
           break;
        }
        if (lines[j].includes('function ') && !lines[j].includes('async')) {
           lines[j] = lines[j].replace('function ', 'async function ');
           break;
        }
      }
    }
  }

  code = lines.join('\n');
  fs.writeFileSync(filePath, code);
}

const files = [
  'src/pages/AdminPage.jsx',
  'src/pages/DashboardPage.jsx',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    fixAsync(f);
    console.log(f + ' fixed');
  }
});
