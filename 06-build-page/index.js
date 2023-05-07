const { readdir, readFile, writeFile, mkdir, appendFile, rm, copyFile } = require('fs/promises');
const path = require('path');

async function replaceTemplate() {
  try {
    const files = await readdir(path.join(__dirname, 'components'));

    let content = await readFile(path.join(__dirname, 'template.html'), 'utf-8');

    const contentFiles = await Promise.all(
      files.map(async file => ({
        name: file,
        content: await readFile(path.join(__dirname, 'components', file), 'utf-8')
      }))
    );

    contentFiles.forEach(contentFile => {
      if (path.extname(contentFile.name) === '.html') {
        content = content.replace(`{{${contentFile.name.split('.')[0]}}}`, contentFile.content);
      } else {
        content = content.replace(`{{${contentFile.name.split('.')[0]}}}`, '');
      }
    });

    await writeFile(path.join(__dirname, 'project-dist', 'index.html'), content, 'utf-8');
  } catch (error) {
    console.log(error.message);
  }
}

async function mergeStyles(pathBundleCss) {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    const filtredFiles = files.filter(file => !file.isDirectory() && path.extname(file.name) === '.css');

    filtredFiles.forEach(async filtredFile => {
      const content = await readFile(path.join(__dirname, 'styles', filtredFile.name), 'utf-8');

      await appendFile(pathBundleCss, content);
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function copyAssets(pathSrcFile, pathDistFile) {
  try {
    const files = await readdir(pathSrcFile, { withFileTypes: true });

    files.forEach(async file => {
      if (file.isDirectory()) {
        await mkdir(path.join(__dirname, 'project-dist', 'assets', file.name));
  
        await copyAssets(path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist', 'assets', file.name));
      } else {
        await copyFile(path.join(pathSrcFile, file.name), path.join(pathDistFile, file.name));
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

(async function() {
  const pathDist = path.join(__dirname, 'project-dist');
  const pathBundleCSS = path.join(__dirname, 'project-dist', 'style.css');
  const pathSrcAssets = path.join(__dirname, 'assets');
  const pathDistAssets = path.join(__dirname, 'project-dist', 'assets');

  await rm(pathDist, { recursive: true, force: true });
  await mkdir(pathDist, { recursive: true });
  await mkdir(pathDistAssets, { recursive: true });

  replaceTemplate();
  mergeStyles(pathBundleCSS);
  copyAssets(pathSrcAssets);
})();