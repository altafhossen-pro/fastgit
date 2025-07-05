# gittu CLI Tool

🚀 Make git operations faster and easier with simplified commands.

## Installation

```bash
npm install -g gittu
```

## Usage

### Basic Commands
```bash
gittu add .              # Add all files
gittu commit "message"   # Commit with message  
gittu push               # Push to remote
gittu status             # Show status
```

### Quick Commands
```bash
gittu quick "message"    # Add + commit + push in one command
```

### Examples
```bash
gittu quick "fix: login bug"
gittu commit "feat: add new feature"
gittu add src/
```

## Development

```bash
# Clone and install
git clone your-repo
cd gittu
npm install

# Test locally
node bin/gittu.js help
```

## License
MIT