# FastGit CLI Tool

🚀 Make git operations faster and easier with simplified commands.

## Installation

```bash
npm install -g fastgit
```

## Usage

### Basic Commands
```bash
fastgit add .              # Add all files
fastgit commit "message"   # Commit with message  
fastgit push               # Push to remote
fastgit status             # Show status
```

### Quick Commands
```bash
fastgit quick "message"    # Add + commit + push in one command
```

### Examples
```bash
fastgit quick "fix: login bug"
fastgit commit "feat: add new feature"
fastgit add src/
```

## Development

```bash
# Clone and install
git clone your-repo
cd fastgit
npm install

# Test locally
node bin/fastgit.js help
```

## License
MIT