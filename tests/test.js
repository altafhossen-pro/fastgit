const { execSync } = require('child_process');

console.log('🧪 Testing FastGit CLI...');

try {
    // Test help command
    console.log('\n📋 Testing help command...');
    execSync('node bin/fastgit.js help', { stdio: 'inherit' });
    console.log('✓ Help command works');

    console.log('\n🎉 Basic tests passed!');
} catch (error) {
    console.log('✗ Tests failed:', error.message);
}