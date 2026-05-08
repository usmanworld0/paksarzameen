const fs = require('fs');
let content = fs.readFileSync('src/components/header/Navbar.tsx', 'utf8');

// Replace the nav-links block
content = content.replace(/<div className="nav-links">[\s\S]*?<\/div>\s*<div className="nav-actions">/g, '<div className="nav-actions ml-auto">');

// Remove the Doctor Portal link
content = content.replace(/<Link href="\/healthcare\/doctor\/sign-in" className="nav-doctor-btn">\s*Doctor Portal\s*<\/Link>/g, '');

// Remove the Commonwealth Lab link
content = content.replace(/<Link\s*href="\/commonwealth-lab"\s*className="nav-commonwealth-btn"\s*>[\s\S]*?<\/Link>/g, '');

fs.writeFileSync('src/components/header/Navbar.tsx', content);
console.log("Navbar modified successfully.");
