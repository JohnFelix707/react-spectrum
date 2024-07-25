
import fs from 'node:fs';

try {
  let content = fs.readFileSync('./package.json', 'utf8');
  let pkg = JSON.parse(content);
  pkg.resolutions['react'] = '^16.8.0';
  pkg.resolutions['react-dom'] = '^16.8.0';
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
} catch (e) {
  console.error('Error:', e);
}
