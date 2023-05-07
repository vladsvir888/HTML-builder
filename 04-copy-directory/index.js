const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const path = require('path');

const pathFiles = path.join(__dirname, 'files');
const pathCopyFiles = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await rm(pathCopyFiles, { recursive: true, force: true });

    await mkdir(pathCopyFiles, { recursive: true });

    const files = await readdir(pathFiles);

    files.forEach(file => {
      copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    });
  } catch (error) {
    console.log(error.message);
  }
}

copyDir();