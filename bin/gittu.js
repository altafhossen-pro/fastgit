#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';

// Version and description
program
  .version('1.0.4')
  .description('gittu - Make git operations faster and easier');

// Helper function to check if git repo exists
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if remote origin exists
function hasRemoteOrigin() {
  try {
    execSync('git remote get-url origin', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get current branch
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'main';
  }
}

// INIT command
program
  .command('init')
  .description('Initialize a new git repository')
  .action(() => {
    try {
      // Check if already a git repository
      if (isGitRepository()) {
        console.log(chalk.yellow('⚠️  Already a git repository'));
        return;
      }

      execSync('git init', { stdio: 'inherit' });
      console.log(chalk.green('✓ Initialized empty git repository'));

      // Create .gitignore if doesn't exist
      if (!fs.existsSync('.gitignore')) {
        const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Build directories
build/
dist/

# Temporary files
tmp/
temp/

# Database files
*.db
*.sqlite
*.sqlite3

# Backup files
*.backup
*.bak
*.tmp

# Archive files
*.zip
*.tar
*.tar.gz
*.rar

# Config files (uncomment if needed)
# config.json
# settings.json
`;

        fs.writeFileSync('.gitignore', gitignoreContent);
        console.log(chalk.green('✓ Created comprehensive .gitignore file'));
      } else {
        console.log(chalk.blue('ℹ️  .gitignore file already exists'));
      }

      console.log(chalk.blue('🎉 Git repository ready! Now you can use:'));
      console.log(chalk.yellow('  gittu origin add <url>'));
      console.log(chalk.yellow('  gittu quick "initial commit"'));

    } catch (error) {
      console.log(chalk.red('✗ Error initializing repository'));
      console.log(chalk.red(error.message));
    }
  });

// ADD command
program
  .command('add [files...]')
  .description('Add files to staging area')
  .action((files) => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      const target = files && files.length > 0 ? files.join(' ') : '.';
      execSync(`git add ${target}`, { stdio: 'inherit' });
      console.log(chalk.green(`✓ Added ${target} to staging area`));
    } catch (error) {
      console.log(chalk.red('✗ Error adding files'));
      console.log(chalk.red(error.message));
    }
  });

// COMMIT command
program
  .command('commit <message>')
  .description('Commit changes with message')
  .action((message) => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      console.log(chalk.green(`✓ Committed: ${message}`));
    } catch (error) {
      console.log(chalk.red('✗ Error committing changes'));
      console.log(chalk.red(error.message));
    }
  });

// ORIGIN command - set origin
program
  .command('origin')
  .description('Manage remote origin')
  .argument('<action>', 'Action to perform (add)')
  .argument('<url>', 'Repository URL')
  .action((action, url) => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      if (action === 'add') {
        if (hasRemoteOrigin()) {
          console.log(chalk.yellow('⚠️  Remote origin already exists'));
          console.log(chalk.blue('Updating remote origin...'));
          execSync(`git remote set-url origin ${url}`, { stdio: 'inherit' });
          console.log(chalk.green('✓ Updated remote origin URL'));
        } else {
          execSync(`git remote add origin ${url}`, { stdio: 'inherit' });
          console.log(chalk.green('✓ Added remote origin'));
        }
      } else {
        console.log(chalk.red('✗ Invalid action. Use: gittu origin add <url>'));
      }
    } catch (error) {
      console.log(chalk.red('✗ Error setting remote origin'));
      console.log(chalk.red(error.message));
    }
  });

// PUSH command
program
  .command('push')
  .description('Push changes to remote repository')
  .action(() => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      if (!hasRemoteOrigin()) {
        console.log(chalk.red('✗ No remote origin configured'));
        console.log(chalk.yellow('💡 Run "gittu origin add <url>" to add remote origin'));
        return;
      }

      const branch = getCurrentBranch();
      
      // Try to push, if fails try with upstream
      try {
        execSync(`git push origin ${branch}`, { stdio: 'pipe' });
        console.log(chalk.green(`✓ Pushed to origin/${branch}`));
      } catch (error) {
        // If push fails, try with upstream flag
        try {
          execSync(`git push --set-upstream origin ${branch}`, { stdio: 'pipe' });
          console.log(chalk.green(`✓ Pushed to origin/${branch} (set upstream)`));
        } catch (upstreamError) {
          console.log(chalk.red('✗ Error pushing to remote'));
          console.log(chalk.red(upstreamError.message));
        }
      }
    } catch (error) {
      console.log(chalk.red('✗ Error pushing changes'));
      console.log(chalk.red(error.message));
    }
  });

// STATUS command
program
  .command('status')
  .description('Show git status')
  .action(() => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      console.log(chalk.blue('📊 Repository Status:'));
      execSync('git status --short', { stdio: 'inherit' });

      // Show current branch
      const branch = getCurrentBranch();
      console.log(chalk.yellow(`\n🌿 Current branch: ${branch}`));

      // Show remote origin if exists
      if (hasRemoteOrigin()) {
        try {
          const origin = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
          console.log(chalk.cyan(`🌐 Remote origin: ${origin}`));
        } catch (error) {
          // Ignore error
        }
      } else {
        console.log(chalk.gray('🌐 No remote origin configured'));
      }
    } catch (error) {
      console.log(chalk.red('✗ Error showing status'));
      console.log(chalk.red(error.message));
    }
  });

// QUICK command - add + commit + push
program
  .command('quick [message]')
  .description('Add, commit and push in one command')
  .action((message) => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      console.log(chalk.blue('🚀 Quick git operation starting...'));

      // Set default message if not provided
      const commitMessage = message || `Quick update - ${new Date().toISOString().split('T')[0]}`;

      // Add all files
      execSync('git add .', { stdio: 'pipe' });
      console.log(chalk.green('✓ Added all files'));

      // Commit with message
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      console.log(chalk.green(`✓ Committed: ${commitMessage}`));

      // Push to current branch (handle both first time and regular push)
      if (hasRemoteOrigin()) {
        const branch = getCurrentBranch();
        
        try {
          execSync(`git push origin ${branch}`, { stdio: 'pipe' });
          console.log(chalk.green(`✓ Pushed to origin/${branch}`));
        } catch (error) {
          // If push fails, try with upstream flag (for first time push)
          try {
            execSync(`git push --set-upstream origin ${branch}`, { stdio: 'pipe' });
            console.log(chalk.green(`✓ Pushed to origin/${branch} (set upstream)`));
          } catch (upstreamError) {
            console.log(chalk.yellow('⚠️  Could not push to remote'));
            console.log(chalk.yellow('💡 Make sure your remote repository exists and you have push access'));
          }
        }
      } else {
        console.log(chalk.yellow('⚠️  No remote origin configured, skipping push'));
        console.log(chalk.yellow('💡 Run "gittu origin add <url>" to add remote origin'));
      }

      console.log(chalk.blue('🎉 Quick operation completed!'));
    } catch (error) {
      console.log(chalk.red('✗ Error in quick operation'));
      console.log(chalk.red(error.message));
    }
  });

// Help command
program
  .command('help')
  .description('Show help and examples')
  .action(() => {
    console.log(chalk.blue('\n🚀 gittu - Quick Git Operations\n'));
    console.log(chalk.yellow('Setup Commands:'));
    console.log('  gittu init                    # Initialize git repository');
    console.log('  gittu origin add <url>        # Add remote origin URL');
    console.log('\n' + chalk.yellow('Basic Commands:'));
    console.log('  gittu add .                   # Add all files');
    console.log('  gittu add file1 file2         # Add specific files');
    console.log('  gittu commit "message"        # Commit with message');
    console.log('  gittu push                    # Push to remote');
    console.log('  gittu status                  # Show status');
    console.log('\n' + chalk.yellow('Quick Commands:'));
    console.log('  gittu quick                   # Add + commit + push (auto message)');
    console.log('  gittu quick "message"         # Add + commit + push (custom message)');
    console.log('\n' + chalk.yellow('Examples:'));
    console.log('  gittu init');
    console.log('  gittu origin add "https://github.com/username/repo.git"');
    console.log('  gittu quick                   # Uses auto-generated message');
    console.log('  gittu quick "fix: login bug"');
    console.log('  gittu commit "feat: add new feature"');
    console.log('  gittu add src/components/');
    console.log('  gittu status');
    console.log('\n' + chalk.gray('💡 Tip: Use "gittu quick" without message for auto-generated commit messages'));
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.help();
}