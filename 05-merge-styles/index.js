const { rm, readdir, readFile, appendFile } = require('fs/promises');
const path = require('path');

(async function() {
  const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

  try {
    await rm(pathBundle, { recursive: true, force: true });

    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    const filtredFiles = files.filter(file => !file.isDirectory() && path.extname(file.name) === '.css');

    filtredFiles.forEach(async filtredFile => {
      const content = await readFile(path.join(__dirname, 'styles', filtredFile.name), 'utf-8');

      await appendFile(pathBundle, content);
    });
  } catch (error) {
    console.log(error.message);
  }
})();