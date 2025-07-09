#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';

// Version and description
program
  .version('1.0.8')
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

// Helper function to check if there are uncommitted changes
function hasUncommittedChanges() {
  try {
    const result = execSync('git status --porcelain', { encoding: 'utf8' });
    return result.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// Helper function to get smart commit message based on changes
function getSmartCommitMessage() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const lines = status.split('\n').filter(line => line.trim());

    if (lines.length === 0) return 'No changes';

    const added = lines.filter(line => line.startsWith('A ') || line.startsWith('?? ')).length;
    const modified = lines.filter(line => line.startsWith('M ') || line.startsWith(' M')).length;
    const deleted = lines.filter(line => line.startsWith('D ') || line.startsWith(' D')).length;

    let message = 'Auto: ';
    if (added > 0) message += `${added} added`;
    if (modified > 0) message += `${added > 0 ? ', ' : ''}${modified} modified`;
    if (deleted > 0) message += `${(added > 0 || modified > 0) ? ', ' : ''}${deleted} deleted`;

    return message + ` - ${new Date().toISOString().split('T')[0]}`;
  } catch (error) {
    return `Quick update - ${new Date().toISOString().split('T')[0]}`;
  }
}

// INIT command
program
  .command('init')
  .description('Initialize a new git repository')
  .action(() => {
    try {
      if (isGitRepository()) {
        console.log(chalk.yellow('⚠️  Already a git repository'));
        return;
      }

      execSync('git init', { stdio: 'inherit' });
      console.log(chalk.green('✓ Initialized empty git repository'));

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

// START command - Begin daily work
program
  .command('start')
  .description('Start your daily work (pull latest + status)')
  .action(() => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      console.log(chalk.blue('🌅 Starting your work day...'));

      // Pull latest changes if remote exists
      if (hasRemoteOrigin()) {
        try {
          const branch = getCurrentBranch();
          execSync(`git pull origin ${branch}`, { stdio: 'pipe' });
          console.log(chalk.green('✓ Pulled latest changes'));
        } catch (error) {
          console.log(chalk.yellow('⚠️  Could not pull latest changes'));
        }
      }

      // Show current status
      const branch = getCurrentBranch();
      console.log(chalk.yellow(`🌿 Current branch: ${branch}`));

      if (hasUncommittedChanges()) {
        console.log(chalk.cyan('📝 You have uncommitted changes:'));
        execSync('git status --short', { stdio: 'inherit' });
      } else {
        console.log(chalk.green('✓ Working directory is clean'));
      }

      console.log(chalk.blue('🚀 Ready to work! Use "gittu auto" for smart commits'));

    } catch (error) {
      console.log(chalk.red('✗ Error starting work'));
      console.log(chalk.red(error.message));
    }
  });

// UPDATE command - Smart pull and sync
program
  .command('update')
  .description('Update from remote (pull + auto-merge)')
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

      console.log(chalk.blue('🔄 Updating from remote...'));

      // Save current work if there are changes
      if (hasUncommittedChanges()) {
        console.log(chalk.yellow('💾 Saving current work first...'));
        execSync('git add .', { stdio: 'pipe' });
        execSync(`git commit -m "WIP: Auto-save before update"`, { stdio: 'pipe' });
        console.log(chalk.green('✓ Saved current work'));
      }

      // Pull latest changes
      const branch = getCurrentBranch();
      try {
        execSync(`git pull origin ${branch}`, { stdio: 'pipe' });
        console.log(chalk.green('✓ Updated from remote'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Pull completed with conflicts'));
        console.log(chalk.blue('💡 Please resolve conflicts manually'));
      }

      // Show final status
      if (hasUncommittedChanges()) {
        console.log(chalk.cyan('📝 Current status:'));
        execSync('git status --short', { stdio: 'inherit' });
      } else {
        console.log(chalk.green('✓ Everything is up to date'));
      }

    } catch (error) {
      console.log(chalk.red('✗ Error updating'));
      console.log(chalk.red(error.message));
    }
  });

// AUTO command - Smart commit with auto-generated message
program
  .command('auto')
  .description('Smart add + commit with auto-generated message')
  .action(() => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      if (!hasUncommittedChanges()) {
        console.log(chalk.green('✓ No changes to commit'));
        return;
      }

      console.log(chalk.blue('🤖 Auto-committing changes...'));

      // Generate smart commit message
      const smartMessage = getSmartCommitMessage();

      // Add all files
      execSync('git add .', { stdio: 'pipe' });
      console.log(chalk.green('✓ Added all files'));

      // Commit with smart message
      execSync(`git commit -m "${smartMessage}"`, { stdio: 'pipe' });
      console.log(chalk.green(`✓ Committed: ${smartMessage}`));

      console.log(chalk.blue('✅ Auto-commit completed! Use "gittu push" to upload'));

    } catch (error) {
      console.log(chalk.red('✗ Error in auto-commit'));
      console.log(chalk.red(error.message));
    }
  });

// DEPLOY command - Smart sync with remote
program
  .command('deploy')
  .description('Deploy changes (commit + push to remote)')
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

      console.log(chalk.blue('🚀 Deploying changes...'));

      // Save current work if there are changes
      if (hasUncommittedChanges()) {
        const smartMessage = getSmartCommitMessage();
        execSync('git add .', { stdio: 'pipe' });
        execSync(`git commit -m "${smartMessage}"`, { stdio: 'pipe' });
        console.log(chalk.green(`✓ Committed: ${smartMessage}`));
      }

      // Pull latest changes
      const branch = getCurrentBranch();
      try {
        execSync(`git pull origin ${branch}`, { stdio: 'pipe' });
        console.log(chalk.green('✓ Pulled latest changes'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Pull completed with conflicts'));
      }

      // Push changes
      try {
        execSync(`git push origin ${branch}`, { stdio: 'pipe' });
        console.log(chalk.green(`✓ Pushed to origin/${branch}`));
      } catch (error) {
        try {
          execSync(`git push --set-upstream origin ${branch}`, { stdio: 'pipe' });
          console.log(chalk.green(`✓ Pushed to origin/${branch} (set upstream)`));
        } catch (upstreamError) {
          console.log(chalk.yellow('⚠️  Could not push to remote'));
        }
      }

      console.log(chalk.blue('🚀 Deploy completed!'));

    } catch (error) {
      console.log(chalk.red('✗ Error during deploy'));
      console.log(chalk.red(error.message));
    }
  });

// UNDO command - Undo last commit
program
  .command('undo')
  .description('Undo the last commit (keeps changes)')
  .action(() => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      console.log(chalk.blue('↩️  Undoing last commit...'));

      // Reset to previous commit but keep changes
      execSync('git reset --soft HEAD~1', { stdio: 'pipe' });
      console.log(chalk.green('✓ Last commit undone (changes preserved)'));

      // Show current status
      if (hasUncommittedChanges()) {
        console.log(chalk.cyan('📝 Current status:'));
        execSync('git status --short', { stdio: 'inherit' });
      }

    } catch (error) {
      console.log(chalk.red('✗ Error undoing commit'));
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

      try {
        execSync(`git push origin ${branch}`, { stdio: 'pipe' });
        console.log(chalk.green(`✓ Pushed to origin/${branch}`));
      } catch (error) {
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

      const branch = getCurrentBranch();
      console.log(chalk.yellow(`\n🌿 Current branch: ${branch}`));

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

      const commitMessage = message || getSmartCommitMessage();

      execSync('git add .', { stdio: 'pipe' });
      console.log(chalk.green('✓ Added all files'));

      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      console.log(chalk.green(`✓ Committed: ${commitMessage}`));

      if (hasRemoteOrigin()) {
        const branch = getCurrentBranch();

        try {
          execSync(`git push origin ${branch}`, { stdio: 'pipe' });
          console.log(chalk.green(`✓ Pushed to origin/${branch}`));
        } catch (error) {
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

// SAVE command - add + commit only (no push)
program
  .command('save [message]')
  .description('Stage and commit changes without pushing')
  .action((message) => {
    try {
      if (!isGitRepository()) {
        console.log(chalk.red('✗ Not a git repository'));
        console.log(chalk.yellow('💡 Run "gittu init" to initialize a git repository'));
        return;
      }

      console.log(chalk.blue('💾 Saving changes (add + commit)...'));

      const commitMessage = message || getSmartCommitMessage();

      execSync('git add .', { stdio: 'pipe' });
      console.log(chalk.green('✓ Added all files'));

      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      console.log(chalk.green(`✓ Committed: ${commitMessage}`));

      console.log(chalk.blue('✅ Save operation completed (no push)'));
    } catch (error) {
      console.log(chalk.red('✗ Error in save operation'));
      console.log(chalk.red(error.message));
    }
  });

// Help command
program
  .command('help')
  .description('Show help and examples')
  .action(() => {
    console.log(chalk.blue('\n🚀 gittu - Quick Git Operations\n'));
    console.log(chalk.yellow('Daily Workflow:'));
    console.log('  gittu start                   # Start your work (pull + status)');
    console.log('  gittu auto                    # Smart commit with auto message');
    console.log('  gittu deploy                  # Deploy changes (commit + push)');
    console.log('  gittu quick [message]         # Add + commit + push');
    console.log('\n' + chalk.yellow('Setup Commands:'));
    console.log('  gittu init                    # Initialize git repository');
    console.log('  gittu origin add <url>        # Add remote origin URL');
    console.log('\n' + chalk.yellow('Work Commands:'));
    console.log('  gittu save [message]          # Add + commit (no push)');
    console.log('  gittu push                    # Push to remote');
    console.log('  gittu update                  # Pull latest changes');
    console.log('  gittu undo                    # Undo last commit');
    console.log('  gittu status                  # Show status');
    console.log('\n' + chalk.yellow('Smart Examples:'));
    console.log('  gittu start                   # Begin your work day');
    console.log('  gittu auto                    # "Auto: 3 modified, 1 added - 2024-01-15"');
    console.log('  gittu deploy                  # Deploy your changes');
    console.log('\n' + chalk.gray('💡 Tip: Use "gittu auto" for smart auto-generated commit messages'));
    console.log(chalk.gray('💡 Use "gittu start" at the beginning of your work day'));
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.help();
}