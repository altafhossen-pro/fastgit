# gittu 🚀

**Make git operations faster and easier with simplified commands**

A powerful CLI tool that streamlines your git workflow by combining multiple git operations into single, intuitive commands. Perfect for developers who want to speed up their daily git tasks.

## ✨ Features

- **🚀 Quick Operations**: Add, commit, and push in one command
- **🎯 Smart Defaults**: Auto-generated commit messages with timestamps
- **📁 Auto .gitignore**: Comprehensive .gitignore file generation
- **🔧 Easy Setup**: Initialize repositories with remote origin in seconds
- **💡 Helpful Messages**: Clear feedback and suggestions for next steps
- **🌿 Branch Aware**: Automatically detects and works with current branch
- **🛡️ Safe Operations**: Checks for repository status before executing commands

## 🛠️ Installation

### Global Installation (Recommended)
```bash
npm install -g gittu
```

### Local Installation
```bash
npm install gittu
```

## 🚀 Quick Start

```bash
# Initialize a new project
gittu init

# Add remote origin
gittu origin add https://github.com/username/repo.git

# Quick commit and push
gittu quick "Initial commit"
```

## 📚 Commands

### Setup Commands
| Command | Description |
|---------|-------------|
| `gittu init` | Initialize git repository with comprehensive .gitignore |
| `gittu origin add <url>` | Add or update remote origin URL |

### Basic Git Operations
| Command | Description |
|---------|-------------|
| `gittu add [files...]` | Add files to staging area (defaults to all files) |
| `gittu commit "<message>"` | Commit changes with message |
| `gittu push` | Push changes to remote repository |
| `gittu status` | Show detailed repository status |

### Power Commands
| Command | Description |
|---------|-------------|
| `gittu save [message]` | Add + commit (no push) in one command |
| `gittu quick [message]` | Add + commit + push in one command |
| `gittu help` | Show detailed help and examples |

## 💡 Usage Examples

### Project Setup
```bash
# Start a new project
mkdir my-project && cd my-project
gittu init
gittu origin add https://github.com/username/my-project.git
```

### Daily Workflow
```bash
# Quick commit with auto-generated message
gittu quick

# Quick commit with custom message
gittu quick "feat: add user authentication"

# Standard git workflow
gittu add src/
gittu commit "refactor: improve code structure"
gittu push
```

### Common Scenarios
```bash
# Check what's changed
gittu status

# Add specific files
gittu add package.json README.md

# Commit with conventional commit format
gittu commit "fix: resolve login validation issue"

# Push after making commits
gittu push
```

## 🎯 Auto-generated .gitignore

When you run `gittu init`, it automatically creates a comprehensive .gitignore file that includes:

- **Node.js**: node_modules, npm logs, package-lock.json
- **Build outputs**: dist, build directories
- **IDE files**: .vscode, .idea, *.swp
- **OS files**: .DS_Store, Thumbs.db
- **Environment**: .env files
- **Logs**: *.log files
- **Temporary files**: tmp, temp directories
- **Database files**: *.db, *.sqlite
- **Archives**: *.zip, *.tar.gz

## 🔧 Advanced Usage

### Auto-generated Commit Messages
When using `gittu quick` without a message, it automatically generates timestamps:
```bash
gittu quick
# Creates commit: "Quick update - 2025-07-06"
```

### Branch Management
gittu automatically detects your current branch and:
- Sets upstream on first push
- Handles branch-specific operations
- Shows current branch in status

### Error Handling
- Validates git repository existence
- Checks for remote origin configuration
- Provides helpful suggestions for common issues

## 📋 Requirements

- **Node.js**: Version 14 or higher
- **Git**: Must be installed and accessible via command line
- **npm**: For package installation

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/username/gittu.git
cd gittu

# Install dependencies
npm install

# Test locally
node bin/gittu.js help

# Make it executable globally (for development)
npm link
```

### Project Structure
```
gittu/
├── bin/
│   └── gittu.js          # Main CLI script
├── package.json          # Package configuration
├── README.md            # Documentation
└── .gitignore           # Git ignore rules
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`gittu quick "feat: add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

### v1.0.0
- Initial release with core git operations
- Auto .gitignore generation
- Quick commit and push functionality
- Comprehensive error handling

## 🐛 Troubleshooting

### Common Issues

**"Not a git repository"**
```bash
# Solution: Initialize git first
gittu init
```

**"No remote origin configured"**
```bash
# Solution: Add remote origin
gittu origin add https://github.com/username/repo.git
```

**"Could not push to remote"**
- Verify repository exists on remote
- Check your push permissions
- Ensure you're authenticated with git

### Getting Help
```bash
# Show detailed help
gittu help

# Check repository status
gittu status
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 Why gittu?

- **Save Time**: Reduce 3-4 git commands to just one
- **Reduce Errors**: Automated workflows prevent common mistakes
- **Better DX**: Focus on coding, not git command memorization
- **Consistent**: Same commands work across all projects
- **Beginner Friendly**: Simple commands with helpful feedback

## 💖 Support

If you find gittu helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 📝 Contributing to documentation
- 🔄 Sharing with other developers

---

**Made with ❤️ for developers who want to git things done faster!**