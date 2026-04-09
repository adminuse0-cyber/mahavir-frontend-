const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../assets/images');
const destDir = path.join(__dirname, '../public/images/products');
const jsonDest = path.join(__dirname, '../src/data');

// Create directories if they don't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
if (!fs.existsSync(jsonDest)) {
  fs.mkdirSync(jsonDest, { recursive: true });
}

function syncProducts() {
  const productMap = {};

  const categories = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const category of categories) {
    const catSrcPath = path.join(srcDir, category);
    const catDestPath = path.join(destDir, category);
    
    if (!fs.existsSync(catDestPath)) {
      fs.mkdirSync(catDestPath, { recursive: true });
    }

    const subcategoryFiles = fs.readdirSync(catSrcPath).filter(file => {
      return file.match(/\.(jpg|jpeg|png)$/i);
    });

    const subCategories = [];

    for (const file of subcategoryFiles) {
      const srcFile = path.join(catSrcPath, file);
      const destFile = path.join(catDestPath, file);

      // Copy file
      fs.copyFileSync(srcFile, destFile);

      // Keep original file for the UI map
      subCategories.push({
        name: path.parse(file).name,
        file: file
      });
    }

    if (subCategories.length > 0) {
      productMap[category] = subCategories;
    }
  }

  // Write mapping to JSON
  fs.writeFileSync(
    path.join(jsonDest, 'productMap.json'), 
    JSON.stringify(productMap, null, 2)
  );

  console.log('Successfully synced product images and generated productMap.json!');
}

syncProducts();
