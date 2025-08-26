"use client"
import { useMemo, useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">Loading…</div>}>
      <NotesCheatSheet />
    </Suspense>
  )
}

function NotesCheatSheet() {
  const [query, setQuery] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const cat = searchParams.get('cat')
    setSelectedCategory(cat || null)
  }, [searchParams])
  
  // ---------- Cheat sheet data ----------
  const sections = [
    {
      title: 'Git Essentials',
      items: [
        { label: 'Initialize repo', code: 'git init', desc: 'Create a new local Git repository.' },
        { label: 'Clone', code: 'git clone <url>', desc: 'Clone a remote repository.' },
        { label: 'Status', code: 'git status', desc: 'Show changed files in your working directory.' },
        { label: 'Add changes', code: 'git add .', desc: 'Stage all changes.' },
        { label: 'Commit', code: "git commit -m 'feat: message'", desc: 'Commit staged changes with a message.' },
        { label: 'Set remote', code: 'git remote add origin <url>', desc: 'Link local repo to a remote.' },
        { label: 'Push', code: 'git push -u origin main', desc: 'Push commits to the main branch and set upstream.' },
        { label: 'New branch', code: 'git checkout -b feature/awesome', desc: 'Create and switch to a new branch.' },
        { label: 'Merge', code: 'git merge feature/awesome', desc: 'Merge a branch into the current branch.' },
        { label: 'Rebase (update branch)', code: 'git fetch origin && git rebase origin/main', desc: 'Replay your commits on top of latest main.' },
      ],
    },
    {
  title: 'NPM / Yarn',
  items: [
    { label: 'Init', code: 'npm init -y', desc: 'Create package.json quickly.' },
    { label: 'Install dep', code: 'npm i <pkg>', desc: 'Install a dependency.' },
    { label: 'Install dev dep', code: 'npm i -D <pkg>', desc: 'Install a dev dependency.' },
    { label: 'Remove dep', code: 'npm uninstall <pkg>', desc: 'Remove a dependency.' },
    { label: 'Run script', code: 'npm run <script>', desc: 'Execute a package.json script.' },
    { label: 'List installed', code: 'npm list --depth=0', desc: 'Show top-level installed packages.' },
    { label: 'Update all', code: 'npm outdated && npm update', desc: 'Check and update packages.' },
    { label: 'Global install', code: 'npm i -g <pkg>', desc: 'Install a package globally.' },
    { label: 'Yarn init', code: 'yarn init -y', desc: 'Initialize project with Yarn.' },
    { label: 'Yarn install', code: 'yarn add <pkg>', desc: 'Install a dependency with Yarn.' },
    { label: 'Yarn dev dep', code: 'yarn add -D <pkg>', desc: 'Install a dev dependency with Yarn.' },
    { label: 'Yarn remove', code: 'yarn remove <pkg>', desc: 'Remove a dependency with Yarn.' },
    { label: 'Yarn run', code: 'yarn <script>', desc: 'Run a package.json script (shorter than npm).' },
  ],
},
    {
  title: 'Next.js Data Fetching',
  items: [
    // --- Pages Router ---
    { 
      label: 'Static props', 
      code: 'export async function getStaticProps() {\n  return { props: { /* data */ } }\n}', 
      desc: 'Fetch data at build time (Pages Router).' 
    },
    { 
      label: 'Server-side props', 
      code: 'export async function getServerSideProps(ctx) {\n  return { props: { /* data */ } }\n}', 
      desc: 'Fetch data on every request (Pages Router).' 
    },
    { 
      label: 'Static paths', 
      code: 'export async function getStaticPaths() {\n  return { paths: [], fallback: false }\n}', 
      desc: 'Define dynamic static routes (Pages Router).' 
    },

    // --- App Router ---
    { 
      label: 'Async server component', 
      code: 'export default async function Page() {\n  const data = await getData()\n  return <pre>{JSON.stringify(data)}</pre>\n}', 
      desc: 'Fetch directly inside a server component (App Router).' 
    },
    { 
      label: 'Fetch with cache', 
      code: 'const data = await fetch("https://api.com/data", { cache: "force-cache" }).then(r => r.json())', 
      desc: 'Static fetch (default) — cached at build time.' 
    },
    { 
      label: 'Fetch no cache', 
      code: 'const data = await fetch("https://api.com/data", { cache: "no-store" }).then(r => r.json())', 
      desc: 'Always fetch fresh data (like getServerSideProps).' 
    },
    { 
      label: 'Revalidate', 
      code: 'const data = await fetch("https://api.com/data", { next: { revalidate: 60 } }).then(r => r.json())', 
      desc: 'ISR (Incremental Static Regeneration) with 60s revalidation.' 
    },
    { 
      label: 'Route handler', 
      code: 'export async function GET(req) {\n  return Response.json({ hello: "world" })\n}', 
      desc: 'API endpoint inside `app/api/route.js` (App Router).' 
    },
  ],
},
    {
  title: 'React Patterns',
  items: [
    // --- State & Effects ---
    { label: 'State update from prev', code: 'setCount(prev => prev + 1)', desc: 'Safe state update using previous value.' },
    { label: 'Effect with cleanup', code: 'useEffect(() => {\n  const id = setInterval(doWork, 1000)\n  return () => clearInterval(id)\n}, [])', desc: 'Cleanup side-effects to avoid leaks.' },
    { label: 'Lazy init state', code: 'const [value] = useState(() => computeExpensive())', desc: 'Initialize state only once using a function.' },

    // --- Memoization & Optimization ---
    { label: 'Memoize expensive calc', code: 'const value = useMemo(() => heavy(data), [data])', desc: 'Avoid recomputation on every render.' },
    { label: 'Memoize callback', code: 'const handler = useCallback(() => doSomething(id), [id])', desc: 'Keep stable function reference across renders.' },
    { label: 'React.memo', code: 'export default React.memo(MyComponent)', desc: 'Prevent re-render if props are unchanged.' },

    // --- Derived & Reducers ---
    { label: 'Derived state', code: 'const total = useMemo(() => items.reduce((a,b)=>a+b,0), [items])', desc: 'Compute values from state instead of storing redundantly.' },
    { label: 'Reducer', code: 'const [state, dispatch] = useReducer(reducer, init)', desc: 'State logic in a reducer function (alternative to useState).' },

    // --- Context & Composition ---
    { label: 'Context provider', code: 'const Ctx = createContext()\n<Ctx.Provider value={value}><App /></Ctx.Provider>', desc: 'Provide global state via Context.' },
    { label: 'useContext', code: 'const value = useContext(Ctx)', desc: 'Consume context values inside a component.' },
    { label: 'Compound components', code: '<Modal><Modal.Header/><Modal.Body/><Modal.Footer/></Modal>', desc: 'Composition pattern for reusable UI.' },

    // --- Conditional & Rendering ---
    { label: 'Conditional render', code: '{isLoggedIn ? <Dashboard /> : <Login />}', desc: 'Render different components based on condition.' },
    { label: 'Short-circuit render', code: '{items.length > 0 && <List items={items} />}', desc: 'Render only if condition is truthy.' },
    { label: 'Render list', code: '{todos.map(t => <Todo key={t.id} {...t} />)}', desc: 'Render collections with a key.' },

    // --- Custom Hooks ---
    { label: 'Custom hook', code: 'function useToggle(init=false){\n  const [on,setOn]=useState(init)\n  const toggle=()=>setOn(o=>!o)\n  return [on,toggle]\n}', desc: 'Encapsulate reusable logic into hooks.' },
    { label: 'Hook composition', code: 'function useUser(){\n  const {id}=useAuth()\n  return useQuery(["user",id],()=>fetchUser(id))\n}', desc: 'Combine hooks to build abstractions.' },

    // --- Advanced Patterns ---
    { label: 'Render props', code: '<DataProvider render={data => <Chart data={data}/>} />', desc: 'Pass a function as a child for flexible rendering.' },
    { label: 'Controlled component', code: '<input value={value} onChange={e=>setValue(e.target.value)} />', desc: 'Form element controlled by React state.' },
    { label: 'Uncontrolled component', code: 'const ref=useRef()\n<input ref={ref} defaultValue="hi" />', desc: 'Form element stores its own state, accessed via ref.' },
    { label: 'Forward ref', code: 'const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />)', desc: 'Forward refs to DOM elements in custom components.' },
    { label: 'Portals', code: 'createPortal(<Modal />, document.body)', desc: 'Render children into a different part of the DOM.' },
    { label: 'Error boundary', code: 'class ErrorBoundary extends React.Component {...}', desc: 'Catch errors in component tree (only class components).' },
    { label: 'Suspense', code: '<Suspense fallback={<Loading/>}><Profile/></Suspense>', desc: 'Show fallback while async components load.' },
    { label: 'Code splitting', code: 'const LazyComp = React.lazy(() => import("./Comp"))', desc: 'Lazy-load components for performance.' },
  ],
},
    {
  title: 'Bash / Shell',
  items: [
    // --- Navigation ---
    { label: 'Current dir', code: 'pwd', desc: 'Print working directory.' },
    { label: 'List files', code: 'ls -la', desc: 'Long list including hidden files.' },
    { label: 'Change dir', code: 'cd path/', desc: 'Move into a directory.' },
    { label: 'Back dir', code: 'cd -', desc: 'Go back to previous directory.' },
    { label: 'Home dir', code: 'cd ~', desc: 'Go to home directory.' },

    // --- Files & Directories ---
    { label: 'Make dir', code: 'mkdir newdir', desc: 'Create a directory.' },
    { label: 'Remove dir', code: 'rmdir emptydir', desc: 'Remove empty directory.' },
    { label: 'Remove recursively', code: 'rm -rf folder/', desc: 'Force delete directory recursively.' },
    { label: 'Copy file', code: 'cp file.txt backup.txt', desc: 'Copy a file.' },
    { label: 'Copy dir', code: 'cp -r src/ dest/', desc: 'Copy a directory recursively.' },
    { label: 'Move/Rename', code: 'mv old.txt new.txt', desc: 'Move or rename a file.' },
    { label: 'Touch', code: 'touch file.txt', desc: 'Create an empty file or update timestamp.' },

    // --- File Inspection ---
    { label: 'Show file', code: 'cat file.txt', desc: 'Print file contents.' },
    { label: 'Head', code: 'head -n 10 file.txt', desc: 'Show first 10 lines.' },
    { label: 'Tail', code: 'tail -n 10 file.txt', desc: 'Show last 10 lines.' },
    { label: 'Follow logs', code: 'tail -f app.log', desc: 'Stream log updates.' },
    { label: 'Less', code: 'less file.txt', desc: 'View file with paging.' },

    // --- Search & Find ---
    { label: 'Find by name', code: 'find . -name "*.js"', desc: 'Find files by pattern.' },
    { label: 'Search in files', code: 'grep -R "pattern" .', desc: 'Recursive text search in files.' },
    { label: 'Case-insensitive grep', code: 'grep -i "pattern" file.txt', desc: 'Search ignoring case.' },
    { label: 'Count matches', code: 'grep -c "pattern" file.txt', desc: 'Count occurrences.' },

    // --- Permissions ---
    { label: 'Change mode', code: 'chmod 755 script.sh', desc: 'Set file permissions.' },
    { label: 'Change owner', code: 'chown user:group file.txt', desc: 'Change file owner/group.' },
    { label: 'Executable', code: 'chmod +x script.sh', desc: 'Make script executable.' },

    // --- Compression & Archiving ---
    { label: 'Archive', code: 'tar -czf archive.tgz folder/', desc: 'Create compressed tar archive.' },
    { label: 'Extract tar', code: 'tar -xzf archive.tgz', desc: 'Extract tar archive.' },
    { label: 'Zip', code: 'zip archive.zip file1 file2', desc: 'Create zip archive.' },
    { label: 'Unzip', code: 'unzip archive.zip', desc: 'Extract zip archive.' },

    // --- Processes ---
    { label: 'List processes', code: 'ps aux', desc: 'Show all running processes.' },
    { label: 'Search process', code: 'ps aux | grep node', desc: 'Find process by name.' },
    { label: 'Kill by PID', code: 'kill -9 <pid>', desc: 'Force kill process by PID.' },
    { label: 'Background job', code: 'command &', desc: 'Run command in background.' },
    { label: 'Jobs', code: 'jobs', desc: 'List background jobs.' },
    { label: 'Foreground job', code: 'fg %1', desc: 'Bring job 1 to foreground.' },

    // --- Networking ---
    { label: 'Ping host', code: 'ping -c 4 google.com', desc: 'Ping host 4 times.' },
    { label: 'Curl GET', code: 'curl https://api.com', desc: 'Fetch API response.' },
    { label: 'Curl POST', code: 'curl -X POST -d "a=1&b=2" https://api.com', desc: 'Send POST request.' },
    { label: 'Download file', code: 'wget https://file.com/file.zip', desc: 'Download file from internet.' },
    { label: 'Check ports', code: 'netstat -tulnp', desc: 'List listening ports.' },

    // --- System ---
    { label: 'Disk usage', code: 'df -h', desc: 'Show mounted disks usage.' },
    { label: 'Dir size', code: 'du -sh folder/', desc: 'Check folder size.' },
    { label: 'Free memory', code: 'free -h', desc: 'Show memory usage.' },
    { label: 'Uptime', code: 'uptime', desc: 'Show system uptime.' },
    { label: 'Whoami', code: 'whoami', desc: 'Show current user.' },
    { label: 'Env vars', code: 'printenv', desc: 'List environment variables.' },

    // --- Scripting Basics ---
    { label: 'For loop', code: 'for f in *.txt; do echo $f; done', desc: 'Loop through files.' },
    { label: 'If condition', code: 'if [ -f file.txt ]; then echo exists; fi', desc: 'Check if file exists.' },
    { label: 'Variable', code: 'NAME="DevNotes"\necho $NAME', desc: 'Define and print a variable.' },
    { label: 'Read input', code: 'read -p "Name: " NAME', desc: 'Prompt user input into variable.' },
  ],
},
    {
  title: 'Docker',
  items: [
    // --- Images ---
    { label: 'Build', code: 'docker build -t myapp:latest .', desc: 'Build an image from Dockerfile.' },
    { label: 'List images', code: 'docker images', desc: 'Show all local images.' },
    { label: 'Remove image', code: 'docker rmi <image>', desc: 'Remove an image.' },
    { label: 'Pull image', code: 'docker pull node:18', desc: 'Download image from Docker Hub.' },

    // --- Containers ---
    { label: 'Run', code: 'docker run --rm -p 3000:3000 myapp:latest', desc: 'Run container mapping port 3000.' },
    { label: 'Run detached', code: 'docker run -d --name myapp myapp:latest', desc: 'Run container in background with name.' },
    { label: 'List containers', code: 'docker ps -a', desc: 'List running and stopped containers.' },
    { label: 'Stop container', code: 'docker stop <id>', desc: 'Stop a running container.' },
    { label: 'Remove container', code: 'docker rm <id>', desc: 'Remove a stopped container.' },
    { label: 'Logs', code: 'docker logs -f <id>', desc: 'Follow container logs.' },
    { label: 'Exec shell', code: 'docker exec -it <id> sh', desc: 'Open a shell inside container.' },

    // --- Volumes & Networks ---
    { label: 'List volumes', code: 'docker volume ls', desc: 'Show all volumes.' },
    { label: 'Remove volume', code: 'docker volume rm <name>', desc: 'Delete a volume.' },
    { label: 'List networks', code: 'docker network ls', desc: 'Show all networks.' },
    { label: 'Remove network', code: 'docker network rm <name>', desc: 'Delete a network.' },

    // --- Cleanup ---
    { label: 'Prune', code: 'docker system prune -af', desc: 'Remove all unused containers, networks, images, and cache.' },

    // --- Docker Compose ---
    { label: 'Up', code: 'docker-compose up -d', desc: 'Start services defined in docker-compose.yml.' },
    { label: 'Down', code: 'docker-compose down', desc: 'Stop and remove containers, networks, volumes.' },
    { label: 'Rebuild', code: 'docker-compose up -d --build', desc: 'Rebuild images and start fresh containers.' },
    { label: 'Logs', code: 'docker-compose logs -f', desc: 'Stream logs from all services.' },
  ],
},
    {
  title: 'MongoDB',
  items: [
    // --- Connection ---
    { label: 'Connect Atlas', code: 'mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority', desc: 'MongoDB Atlas connection string.' },
    { label: 'Connect local shell', code: 'mongosh "mongodb://localhost:27017"', desc: 'Connect to local MongoDB instance.' },
    { label: 'Show databases', code: 'show dbs', desc: 'List all databases.' },
    { label: 'Use database', code: 'use mydb', desc: 'Switch/create a database.' },
    { label: 'Show collections', code: 'show collections', desc: 'List collections in current DB.' },

    // --- CRUD ---
    { label: 'Insert one', code: 'db.users.insertOne({ name: "Alice", age: 25 })', desc: 'Insert a single document.' },
    { label: 'Insert many', code: 'db.users.insertMany([{ name: "Bob" }, { name: "Charlie" }])', desc: 'Insert multiple documents.' },
    { label: 'Find all', code: 'db.users.find()', desc: 'Query all documents.' },
    { label: 'Find with filter', code: 'db.users.find({ active: true })', desc: 'Query documents matching condition.' },
    { label: 'Find one', code: 'db.users.findOne({ email: "a@b.com" })', desc: 'Get a single document.' },
    { label: 'Update one', code: 'db.users.updateOne({ name: "Alice" }, { $set: { age: 30 } })', desc: 'Update first matching document.' },
    { label: 'Update many', code: 'db.users.updateMany({ active: false }, { $set: { active: true } })', desc: 'Update multiple documents.' },
    { label: 'Replace', code: 'db.users.replaceOne({ name: "Alice" }, { name: "Alice", age: 26 })', desc: 'Replace entire document.' },
    { label: 'Delete one', code: 'db.users.deleteOne({ name: "Alice" })', desc: 'Delete first matching document.' },
    { label: 'Delete many', code: 'db.users.deleteMany({ active: false })', desc: 'Delete multiple documents.' },

    // --- Query Operators ---
    { label: 'Comparison', code: 'db.users.find({ age: { $gt: 18 } })', desc: 'Find users older than 18.' },
    { label: 'Logical', code: 'db.users.find({ $or: [ { role: "admin" }, { role: "editor" } ] })', desc: 'Use OR conditions.' },
    { label: 'Array contains', code: 'db.posts.find({ tags: "js" })', desc: 'Match documents with a specific array value.' },
    { label: 'Array operator', code: 'db.posts.find({ tags: { $in: ["js","react"] } })', desc: 'Match if array contains any of given values.' },

    // --- Indexes ---
    { label: 'Create index', code: 'db.users.createIndex({ email: 1 })', desc: 'Index on email field (ascending).' },
    { label: 'Unique index', code: 'db.users.createIndex({ email: 1 }, { unique: true })', desc: 'Ensure unique values for email.' },
    { label: 'List indexes', code: 'db.users.getIndexes()', desc: 'Show all indexes on collection.' },
    { label: 'Drop index', code: 'db.users.dropIndex("email_1")', desc: 'Remove specific index.' },

    // --- Aggregation ---
    { label: 'Count docs', code: 'db.users.countDocuments({ active: true })', desc: 'Count matching documents.' },
    { label: 'Aggregation pipeline', code: 'db.orders.aggregate([\n  { $match: { status: "active" } },\n  { $group: { _id: "$customerId", total: { $sum: "$amount" } } }\n])', desc: 'Group and aggregate documents.' },
    { label: 'Sort & limit', code: 'db.users.find().sort({ age: -1 }).limit(5)', desc: 'Sort results and limit output.' },

    // --- Admin ---
    { label: 'Drop collection', code: 'db.users.drop()', desc: 'Delete entire collection.' },
    { label: 'Drop database', code: 'db.dropDatabase()', desc: 'Delete current database.' },
    { label: 'Stats', code: 'db.stats()', desc: 'Show database stats.' },
  ],
},
    {
  title: 'HTTP Status Codes',
  items: [
    // --- 2xx Success ---
    { label: '200 OK', code: '200', desc: 'Request succeeded.' },
    { label: '201 Created', code: '201', desc: 'Resource successfully created.' },
    { label: '202 Accepted', code: '202', desc: 'Request accepted for processing (async).' },
    { label: '204 No Content', code: '204', desc: 'Success with no response body.' },

    // --- 3xx Redirection ---
    { label: '301 Moved Permanently', code: '301', desc: 'Resource moved to a new permanent URI.' },
    { label: '302 Found', code: '302', desc: 'Temporary redirect.' },
    { label: '303 See Other', code: '303', desc: 'Redirect to another URI using GET.' },
    { label: '304 Not Modified', code: '304', desc: 'Resource not modified (cached response allowed).' },
    { label: '307 Temporary Redirect', code: '307', desc: 'Redirect, method preserved.' },
    { label: '308 Permanent Redirect', code: '308', desc: 'Permanent redirect, method preserved.' },

    // --- 4xx Client Errors ---
    { label: '400 Bad Request', code: '400', desc: 'Malformed syntax / invalid request.' },
    { label: '401 Unauthorized', code: '401', desc: 'Authentication required or failed.' },
    { label: '403 Forbidden', code: '403', desc: 'Server understood but refuses request.' },
    { label: '404 Not Found', code: '404', desc: 'Resource not found.' },
    { label: '405 Method Not Allowed', code: '405', desc: 'HTTP method not supported for resource.' },
    { label: '408 Request Timeout', code: '408', desc: 'Client did not send request in time.' },
    { label: '409 Conflict', code: '409', desc: 'Request conflicts with resource state.' },
    { label: '410 Gone', code: '410', desc: 'Resource permanently removed.' },
    { label: '418 I’m a Teapot', code: '418', desc: 'Easter egg from RFC 2324 (HTCPCP).' },
    { label: '429 Too Many Requests', code: '429', desc: 'Rate limit exceeded.' },

    // --- 5xx Server Errors ---
    { label: '500 Internal Server Error', code: '500', desc: 'Unexpected server error.' },
    { label: '501 Not Implemented', code: '501', desc: 'Server does not support request method.' },
    { label: '502 Bad Gateway', code: '502', desc: 'Invalid response from upstream server.' },
    { label: '503 Service Unavailable', code: '503', desc: 'Server temporarily overloaded or down.' },
    { label: '504 Gateway Timeout', code: '504', desc: 'Upstream server failed to respond in time.' },
    { label: '505 HTTP Version Not Supported', code: '505', desc: 'Server does not support request HTTP version.' },
  ],
},
    {
  title: 'Regex Quickies',
  items: [
    // --- Basics ---
    { label: 'Digits only', code: '^\\d+$', desc: 'Match one or more digits.' },
    { label: 'Letters only', code: '^[A-Za-z]+$', desc: 'Match only alphabets (no digits, no symbols).' },
    { label: 'Alphanumeric', code: '^[A-Za-z0-9]+$', desc: 'Match letters and numbers only.' },
    { label: 'Whitespace', code: '\\s+', desc: 'Match one or more whitespace characters.' },
    { label: 'Non-whitespace', code: '\\S+', desc: 'Match one or more non-space characters.' },
    { label: 'Any char (dot)', code: '.', desc: 'Match any single character (except newline).' },

    // --- Common Data ---
    { label: 'Email', code: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', desc: 'Basic email format.' },
    { label: 'Username', code: '^[a-zA-Z0-9._-]{3,16}$', desc: '3–16 chars, letters, numbers, underscore, dot, dash.' },
    { label: 'Password (strong)', code: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', desc: 'Min 8 chars, 1 upper, 1 lower, 1 number, 1 special.' },
    { label: 'Phone (US)', code: '^\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}$', desc: 'US phone number formats.' },
    { label: 'IPv4', code: '^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', desc: 'Match IPv4 address.' },
    { label: 'IPv6', code: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', desc: 'Match IPv6 address.' },
    { label: 'URL', code: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/\\=]*)', desc: 'HTTP/HTTPS URL.' },
    { label: 'Hex Color', code: '^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', desc: 'Hex color (#fff or #ffffff).' },

    // --- File & Text ---
    { label: 'File extension', code: '^.*\\.(jpg|png|gif|webp)$', desc: 'Match common image file extensions.' },
    { label: 'HTML Tag', code: '<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>', desc: 'Match a simple HTML tag.' },
    { label: 'No special chars', code: '^[A-Za-z0-9 ]*$', desc: 'Allow only letters, numbers, and spaces.' },

    // --- Advanced ---
    { label: 'Date (YYYY-MM-DD)', code: '^\\d{4}-\\d{2}-\\d{2}$', desc: 'Simple ISO date format.' },
    { label: 'Time (HH:MM 24h)', code: '^([01]\\d|2[0-3]):([0-5]\\d)$', desc: '24-hour time format.' },
    { label: 'Postal Code (US ZIP)', code: '^\\d{5}(-\\d{4})?$', desc: '5-digit or ZIP+4 format.' },
    { label: 'Credit Card', code: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$', desc: 'Visa, MasterCard, Amex, Discover.' },
    { label: 'UUID v4', code: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', desc: 'Match UUID version 4.' },
  ],
},
  
    {
  title: 'JavaScript',
  items: [
    // --- Variables & Types ---
    { label: 'Declare variables', code: 'const x = 1; let y = 2; var z = 3;', desc: 'Block scope (let, const) vs function scope (var).' },
    { label: 'Types', code: 'typeof 123 // "number"\ntypeof "hi" // "string"\ntypeof true // "boolean"\nArray.isArray([]) // true', desc: 'Check types.' },
    { label: 'Template strings', code: 'const name = `Hello ${user}!`', desc: 'String interpolation.' },

    // --- Functions ---
    { label: 'Arrow function', code: 'const add = (a, b) => a + b;', desc: 'Concise function syntax.' },
    { label: 'Default params', code: 'function greet(name = "Guest") { return "Hi " + name }', desc: 'Set default arguments.' },
    { label: 'Rest params', code: 'function sum(...nums) { return nums.reduce((a,b) => a+b) }', desc: 'Gather arguments into array.' },
    { label: 'Spread', code: 'const arr2 = [...arr1, 4, 5]', desc: 'Expand arrays/objects.' },

    // --- Objects ---
    { label: 'Object shorthand', code: 'const user = { name, age }', desc: 'Shorthand property names.' },
    { label: 'Destructuring', code: 'const { id, email } = user', desc: 'Extract object properties.' },
    { label: 'Optional chaining', code: 'user?.profile?.email ?? "N/A"', desc: 'Safe access with fallback.' },
    { label: 'Object methods', code: 'Object.keys(obj), Object.values(obj), Object.entries(obj)', desc: 'Work with object properties.' },

    // --- Arrays ---
    { label: 'Map', code: '[1,2,3].map(n => n * 2)', desc: 'Transform each element.' },
    { label: 'Filter', code: '[1,2,3].filter(n => n > 1)', desc: 'Filter elements.' },
    { label: 'Reduce', code: '[1,2,3].reduce((a,b) => a+b, 0)', desc: 'Accumulate values.' },
    { label: 'Find', code: '[1,2,3].find(n => n === 2)', desc: 'Find first match.' },
    { label: 'Some / Every', code: '[1,2,3].some(n => n>2), [1,2,3].every(n => n>0)', desc: 'Check conditions.' },
    { label: 'Includes', code: '[1,2,3].includes(2)', desc: 'Check membership.' },
    { label: 'Sort', code: '[3,1,2].sort((a,b)=>a-b)', desc: 'Sort array.' },
    { label: 'Spread & concat', code: '[...a, ...b]', desc: 'Merge arrays.' },

    // --- Strings ---
    { label: 'Template literals', code: '`Hello ${name}`', desc: 'Embed expressions in strings.' },
    { label: 'Trim', code: '"  hi ".trim()', desc: 'Remove whitespace.' },
    { label: 'Split', code: '"a,b,c".split(",")', desc: 'String to array.' },
    { label: 'Join', code: '["a","b"].join("-")', desc: 'Array to string.' },
    { label: 'Replace', code: '"hello".replace("h","H")', desc: 'Replace substring.' },
    { label: 'Match regex', code: '"abc123".match(/\\d+/)', desc: 'Extract regex matches.' },
    { label: 'Includes', code: '"hello".includes("he")', desc: 'Check substring.' },

    // --- Numbers & Math ---
    { label: 'Math', code: 'Math.max(1,5), Math.random(), Math.round(4.7)', desc: 'Math utilities.' },
    { label: 'Parse', code: 'parseInt("42"), parseFloat("3.14")', desc: 'Convert strings to numbers.' },
    { label: 'Number check', code: 'Number.isNaN(NaN), Number.isFinite(5)', desc: 'Check numeric validity.' },

    // --- Control Flow ---
    { label: 'If/Else', code: 'if (x>0) {...} else {...}', desc: 'Conditional branching.' },
    { label: 'Ternary', code: 'const msg = ok ? "yes" : "no"', desc: 'Inline condition.' },
    { label: 'Switch', code: 'switch(x) { case 1: ...; break; }', desc: 'Multi-case branch.' },

    // --- Loops ---
    { label: 'For', code: 'for(let i=0;i<5;i++){...}', desc: 'Classic loop.' },
    { label: 'For..of', code: 'for(const x of arr){...}', desc: 'Iterate over array.' },
    { label: 'For..in', code: 'for(const k in obj){...}', desc: 'Iterate object keys.' },
    { label: 'While', code: 'while(x<10){...}', desc: 'Loop while condition true.' },

    // --- Classes & OOP ---
    { label: 'Class', code: 'class User { constructor(name){ this.name=name } }', desc: 'Basic class.' },
    { label: 'Extends', code: 'class Admin extends User {}', desc: 'Inheritance.' },
    { label: 'Static', code: 'class X { static hi(){ return "hi" } }', desc: 'Static method.' },
    { label: 'Getter/Setter', code: 'get name(){...} set name(v){...}', desc: 'Property accessors.' },

    // --- Promises & Async ---
    { label: 'Promise', code: 'new Promise((res,rej)=>{res("ok")})', desc: 'Async computation.' },
    { label: 'Async/Await', code: 'const data = await fetch(url).then(r=>r.json())', desc: 'Simplify async code.' },
    { label: 'Promise.all', code: 'await Promise.all([p1,p2])', desc: 'Run promises in parallel.' },
    { label: 'Promise.race', code: 'await Promise.race([p1,p2])', desc: 'Resolve/reject with first.' },

    // --- JSON & Storage ---
    { label: 'JSON parse/stringify', code: 'JSON.parse(str), JSON.stringify(obj)', desc: 'Convert between JSON and objects.' },
    { label: 'LocalStorage', code: 'localStorage.setItem("k","v")', desc: 'Save to browser storage.' },
    { label: 'SessionStorage', code: 'sessionStorage.getItem("k")', desc: 'Temporary browser storage.' },

    // --- Date ---
    { label: 'Date now', code: 'Date.now()', desc: 'Milliseconds since epoch.' },
    { label: 'New Date', code: 'new Date("2025-01-01")', desc: 'Create Date object.' },
    { label: 'Date methods', code: 'd.getFullYear(), d.getMonth(), d.toISOString()', desc: 'Common date operations.' },

    // --- Modules ---
    { label: 'Import/Export', code: 'export default x; import x from "./x.js"', desc: 'Module system.' },
    { label: 'Named exports', code: 'export const a=1; import {a} from "./x.js"', desc: 'Export/import by name.' },

    // --- Error Handling ---
    { label: 'Try/Catch', code: 'try { risky() } catch(e) { console.error(e) }', desc: 'Handle errors.' },
    { label: 'Throw', code: 'throw new Error("Oops")', desc: 'Raise custom error.' },

    // --- DOM ---
    { label: 'Select element', code: 'document.querySelector("#id")', desc: 'Find element.' },
    { label: 'Event listener', code: 'el.addEventListener("click", fn)', desc: 'Attach handler.' },
    { label: 'Change content', code: 'el.textContent = "Hi"', desc: 'Modify DOM.' },
    { label: 'Create element', code: 'document.createElement("div")', desc: 'Build new node.' },

    // --- Utilities ---
    { label: 'SetTimeout', code: 'setTimeout(()=>console.log("Hi"),1000)', desc: 'Run once after delay.' },
    { label: 'SetInterval', code: 'setInterval(()=>console.log("tick"),1000)', desc: 'Repeat at interval.' },
    { label: 'Console log', code: 'console.log(), console.error(), console.table()', desc: 'Debugging utilities.' },
  ],
},
    {
  title: 'TypeScript',
  items: [
    // ==== Types & Interfaces ====
    { label: 'Type alias', code: 'type User = { id: number; name: string }', desc: 'Custom type.' },
    { label: 'Interface', code: 'interface Point { x: number; y: number }', desc: 'Shape for objects.' },
    { label: 'Extending interfaces', code: 'interface A { x: number }\ninterface B extends A { y: number }', desc: 'Interface inheritance.' },
    { label: 'Union', code: 'let id: string | number', desc: 'Variable with multiple types.' },
    { label: 'Intersection', code: 'type A = {x:number}; type B = {y:number}; type C = A & B;', desc: 'Combine types.' },
    { label: 'Literal types', code: 'let status: "success" | "error"', desc: 'Restrict to fixed values.' },
    { label: 'Tuple', code: 'let pair: [string, number] = ["age", 30]', desc: 'Fixed length array.' },
    { label: 'Readonly', code: 'type ReadonlyUser = Readonly<User>', desc: 'Make props immutable.' },

    // ==== Functions ====
    { label: 'Function type', code: 'type Fn = (a: number, b: number) => number', desc: 'Function signature.' },
    { label: 'Arrow func', code: 'const add = (a: number, b: number): number => a + b', desc: 'Arrow function with types.' },
    { label: 'Optional param', code: 'function log(msg?: string){ console.log(msg) }', desc: 'Optional arguments.' },
    { label: 'Default param', code: 'function greet(name = "Guest"){ return "Hi " + name }', desc: 'Default values.' },
    { label: 'Rest param', code: 'function sum(...nums: number[]){ return nums.reduce((a,b)=>a+b,0) }', desc: 'Variable args.' },
    { label: 'Overloads', code: 'function len(x: string): number;\nfunction len(x: any[]): number;\nfunction len(x: any) { return x.length }', desc: 'Multiple call signatures.' },

    // ==== Generics ====
    { label: 'Generic function', code: 'function wrap<T>(value: T): T { return value }', desc: 'Basic generic.' },
    { label: 'Generic constraint', code: 'function logLen<T extends { length: number }>(x: T){ console.log(x.length) }', desc: 'Restrict type param.' },
    { label: 'Generic interface', code: 'interface Box<T> { value: T }', desc: 'Generic type containers.' },
    { label: 'Generic class', code: 'class Store<T> { constructor(public item:T){} }', desc: 'Reusable classes.' },

    // ==== Classes ====
    { label: 'Class basic', code: 'class User { constructor(public id:number, public name:string){} }', desc: 'Shorthand for fields.' },
    { label: 'Inheritance', code: 'class Admin extends User { role="admin" }', desc: 'Subclass with extends.' },
    { label: 'Abstract', code: 'abstract class Shape { abstract area(): number }', desc: 'Base class with abstract methods.' },
    { label: 'Implements', code: 'class Dog implements Animal { bark(){ return "woof" } }', desc: 'Class enforces interface.' },
    { label: 'Readonly prop', code: 'class Config { readonly url="..." }', desc: 'Immutable property.' },
    { label: 'Private field', code: 'class Counter { #count=0; inc(){ this.#count++ } }', desc: 'True private field.' },

    // ==== Advanced Types ====
    { label: 'Type narrowing', code: 'if (typeof id === "string") { /* ... */ }', desc: 'Refine union.' },
    { label: 'Keyof', code: 'type Keys = keyof User', desc: 'Union of keys of a type.' },
    { label: 'Indexed access', code: 'type IdType = User["id"]', desc: 'Type of a property.' },
    { label: 'Mapped type', code: 'type PartialUser = { [K in keyof User]?: User[K] }', desc: 'Transform properties.' },
    { label: 'Conditional type', code: 'type IsString<T> = T extends string ? true : false', desc: 'Type logic.' },
    { label: 'Infer keyword', code: 'type Return<T> = T extends (...args:any)=>infer R ? R : never', desc: 'Extract return type.' },
    { label: 'Utility types', code: 'Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,T>', desc: 'Built-in helpers.' },

    // ==== Modules & Imports ====
    { label: 'Import/Export', code: 'export function foo(){}\nimport { foo } from "./lib"', desc: 'ES modules with TS.' },
    { label: 'Default export', code: 'export default class Service {}', desc: 'Single default export.' },

    // ==== Enums ====
    { label: 'Numeric enum', code: 'enum Direction { Up=1, Down, Left, Right }', desc: 'Auto-incremented numbers.' },
    { label: 'String enum', code: 'enum Role { Admin="admin", User="user" }', desc: 'Fixed string values.' },
    { label: 'Const enum', code: 'const enum Flag { Yes, No }', desc: 'Removed at compile time.' },

    // ==== Decorators (experimental) ====
    { label: 'Class decorator', code: 'function logClass(constructor: Function) { console.log(constructor.name) }', desc: 'Applied to class.' },
    { label: 'Property decorator', code: 'function readonly(target:any, key:string){ Object.defineProperty(target,key,{writable:false}) }', desc: 'Applied to fields.' },

    // ==== Misc / Helpers ====
    { label: 'Namespaces', code: 'namespace Utils { export function hi(){ return "hi" } }', desc: 'Legacy scoping (avoid in modern TS).' },
    { label: 'Type assertion', code: 'let el = document.getElementById("id") as HTMLDivElement', desc: 'Tell compiler specific type.' },
    { label: 'Non-null assertion', code: 'let len = value!.length', desc: 'Skip null/undefined check.' },
    { label: 'Unknown vs any', code: 'let x: unknown; if (typeof x==="string") x.toUpperCase()', desc: 'Safer than any.' },
    { label: 'Never type', code: 'function fail(msg:string): never { throw new Error(msg) }', desc: 'Functions that don’t return.' },
    { label: 'Void type', code: 'function log(msg:string): void { console.log(msg) }', desc: 'No return value.' }
  ]
},
    {
  title: 'Python',
  items: [
    // ==== Basics ====
    { label: 'Print', code: 'print("Hello, World!")', desc: 'Output text.' },
    { label: 'Comments', code: '# single line\n""" multi-line """', desc: 'Comment syntax.' },
    { label: 'Variables', code: 'x = 10\ny = "hi"', desc: 'Dynamic typing.' },
    { label: 'f-string', code: 'name = "Bob"\nprint(f"Hi {name}")', desc: 'String interpolation.' },
    { label: 'Type hints', code: 'def add(a: int, b: int) -> int:\n    return a+b', desc: 'Optional typing.' },

    // ==== Data Structures ====
    { label: 'List', code: 'nums = [1,2,3]', desc: 'Ordered collection.' },
    { label: 'Tuple', code: 'point = (10, 20)', desc: 'Immutable sequence.' },
    { label: 'Set', code: '{1,2,3}', desc: 'Unique unordered collection.' },
    { label: 'Dict', code: '{"a":1, "b":2}', desc: 'Key-value mapping.' },
    { label: 'List comp', code: '[x*2 for x in range(5)]', desc: 'Comprehension shorthand.' },
    { label: 'Dict comp', code: '{x:x**2 for x in range(5)}', desc: 'Dictionary comprehension.' },

    // ==== Functions ====
    { label: 'Function', code: 'def add(a,b): return a+b', desc: 'Define function.' },
    { label: 'Default param', code: 'def greet(name="Guest"): return f"Hi {name}"', desc: 'Function with defaults.' },
    { label: 'Args & kwargs', code: 'def fn(*args, **kwargs): pass', desc: 'Variable arguments.' },
    { label: 'Lambda', code: 'square = lambda x: x*x', desc: 'Anonymous function.' },
    { label: 'Decorator', code: 'def deco(fn):\n  def wrap(): print("hi"); fn()\n  return wrap', desc: 'Function wrapper.' },
    { label: 'Generator', code: 'def gen():\n  yield 1\n  yield 2', desc: 'Lazy sequence with yield.' },

    // ==== Control Flow ====
    { label: 'If/else', code: 'if x>0: print("pos")\nelse: print("neg")', desc: 'Conditional.' },
    { label: 'For loop', code: 'for i in range(5): print(i)', desc: 'Iteration.' },
    { label: 'While loop', code: 'while n>0: n-=1', desc: 'Loop until false.' },
    { label: 'Match', code: 'match status:\n case 200: print("ok")\n case _: print("err")', desc: 'Structural pattern matching (3.10+).' },

    // ==== Classes & OOP ====
    { label: 'Class', code: 'class User:\n def __init__(self,name): self.name=name', desc: 'Basic class.' },
    { label: 'Inheritance', code: 'class Admin(User): pass', desc: 'Subclassing.' },
    { label: 'Static method', code: 'class Math:\n @staticmethod\n def add(a,b): return a+b', desc: 'Method without self.' },
    { label: 'Class method', code: 'class C:\n @classmethod\n def make(cls): return cls()', desc: 'Bound to class not instance.' },
    { label: 'Property', code: 'class Person:\n @property\n def age(self): return 42', desc: 'Computed attribute.' },
    { label: 'Dataclass', code: 'from dataclasses import dataclass\n@dataclass\nclass Point: x:int; y:int', desc: 'Auto-generated init/eq/repr.' },

    // ==== Exceptions ====
    { label: 'Try/except', code: 'try: 1/0\nexcept ZeroDivisionError: print("err")', desc: 'Catch exception.' },
    { label: 'Raise', code: 'raise ValueError("bad")', desc: 'Throw exception.' },
    { label: 'Finally', code: 'try: f=open("x")\nfinally: f.close()', desc: 'Cleanup block.' },

    // ==== Modules & Env ====
    { label: 'Import', code: 'import math\nfrom os import path', desc: 'Import libraries.' },
    { label: 'Virtual env', code: 'python -m venv .venv && source .venv/bin/activate', desc: 'Isolated environment.' },
    { label: 'Pip install', code: 'pip install requests', desc: 'Install package.' },
    { label: 'Requirements', code: 'pip freeze > requirements.txt', desc: 'Save dependencies.' },

    // ==== File I/O ====
    { label: 'Read file', code: 'with open("file.txt") as f:\n data=f.read()', desc: 'Read safely.' },
    { label: 'Write file', code: 'with open("out.txt","w") as f:\n f.write("hello")', desc: 'Write to file.' },
    { label: 'CSV', code: 'import csv\nwith open("f.csv") as f:\n csv.reader(f)', desc: 'Read CSV.' },
    { label: 'JSON', code: 'import json\njson.loads(\'{"a":1}\')', desc: 'Work with JSON.' },

    // ==== Itertools & Builtins ====
    { label: 'Enumerate', code: 'for i,val in enumerate(["a","b"]): print(i,val)', desc: 'Index + value loop.' },
    { label: 'Zip', code: 'for a,b in zip([1,2],[3,4]): print(a,b)', desc: 'Combine iterables.' },
    { label: 'Map/filter', code: 'list(map(str,[1,2]))\nlist(filter(bool,[0,1,2]))', desc: 'Functional helpers.' },
    { label: 'Any/all', code: 'any([0,1])\nall([1,1])', desc: 'Boolean reductions.' },

    // ==== Async ====
    { label: 'Async func', code: 'async def main(): await asyncio.sleep(1)', desc: 'Define coroutine.' },
    { label: 'Run async', code: 'import asyncio\nasyncio.run(main())', desc: 'Run event loop.' },

    // ==== Typing & Advanced ====
    { label: 'Union types', code: 'from typing import Union\nx: Union[int,str] = 5', desc: 'Multiple types.' },
    { label: 'Optional', code: 'from typing import Optional\nx: Optional[int] = None', desc: 'May be None.' },
    { label: 'Generic', code: 'from typing import TypeVar, Generic\nT = TypeVar("T")\nclass Box(Generic[T]): ...', desc: 'Generic classes.' },
    { label: 'TypedDict', code: 'from typing import TypedDict\nclass User(TypedDict): id:int; name:str', desc: 'Typed dict shape.' },
    { label: 'Protocol', code: 'from typing import Protocol\nclass Speak(Protocol):\n def speak(self)->str: ...', desc: 'Duck typing contract.' }
  ]
},
    {
  title: 'Java',
  items: [
    // ==== Basics ====
    { label: 'Main class', code: 'public class Main {\n  public static void main(String[] args){\n    System.out.println("Hello");\n  }\n}', desc: 'Program entry point.' },
    { label: 'Variables', code: 'int x = 10;\nString name = "Alice";\nfinal double PI = 3.14;', desc: 'Primitive and reference types, constants.' },
    { label: 'If/else', code: 'if (x > 0) {\n  System.out.println("positive");\n} else {\n  System.out.println("negative");\n}', desc: 'Conditional branch.' },
    { label: 'For loop', code: 'for (int i=0;i<5;i++) {\n  System.out.println(i);\n}', desc: 'Traditional for loop.' },
    { label: 'Enhanced for', code: 'for (String s : list) {\n  System.out.println(s);\n}', desc: 'For-each loop.' },
    { label: 'Switch', code: 'switch (day) {\n  case "Mon" -> System.out.println("Start");\n  default -> System.out.println("Other");\n}', desc: 'Switch expression (Java 14+).' },

    // ==== OOP ====
    { label: 'Class', code: 'class Person {\n  String name;\n  Person(String n){ this.name=n; }\n}', desc: 'Basic class definition.' },
    { label: 'Inheritance', code: 'class Admin extends Person {\n  Admin(String n){ super(n); }\n}', desc: 'Subclass with super constructor.' },
    { label: 'Interface', code: 'interface Speakable { void speak(); }', desc: 'Interface type.' },
    { label: 'Implement', code: 'class Dog implements Speakable {\n  public void speak(){ System.out.println("Woof"); }\n}', desc: 'Class implements interface.' },
    { label: 'Abstract class', code: 'abstract class Shape {\n  abstract double area();\n}', desc: 'Base with abstract method.' },
    { label: 'Record', code: 'record User(int id, String name) {}', desc: 'Immutable data class (Java 16+).' },
    { label: 'Enum', code: 'enum Color { RED, GREEN, BLUE }', desc: 'Fixed set of constants.' },

    // ==== Collections ====
    { label: 'List', code: 'List<Integer> nums = new ArrayList<>();', desc: 'Generic list.' },
    { label: 'Set', code: 'Set<String> set = new HashSet<>();', desc: 'Unique collection.' },
    { label: 'Map', code: 'Map<String,Integer> map = new HashMap<>();', desc: 'Key-value pairs.' },
    { label: 'Iterate', code: 'for (Map.Entry<String,Integer> e: map.entrySet()) {\n  System.out.println(e.getKey());\n}', desc: 'Iterating map entries.' },

    // ==== Streams & Lambdas ====
    { label: 'Lambda', code: '(a, b) -> a + b', desc: 'Anonymous function.' },
    { label: 'Stream map', code: 'nums.stream().map(n -> n*2).toList();', desc: 'Transform elements.' },
    { label: 'Filter', code: 'nums.stream().filter(n -> n>0).toList();', desc: 'Keep matching items.' },
    { label: 'Reduce', code: 'int sum = nums.stream().reduce(0, Integer::sum);', desc: 'Aggregate values.' },
    { label: 'Optional', code: 'Optional<String> o = Optional.of("hi");\no.ifPresent(System.out::println);', desc: 'Nullable wrapper.' },

    // ==== Exceptions ====
    { label: 'Try/catch', code: 'try {\n  int x = 1/0;\n} catch (ArithmeticException e) {\n  e.printStackTrace();\n}', desc: 'Handle exception.' },
    { label: 'Finally', code: 'try (FileReader fr = new FileReader("f.txt")) {\n  // use\n} catch(IOException e) { }', desc: 'Try-with-resources for cleanup.' },
    { label: 'Throw', code: 'throw new IllegalArgumentException("bad arg");', desc: 'Raise exception.' },

    // ==== Generics ====
    { label: 'Generic class', code: 'class Box<T> {\n  T value;\n  Box(T v){ value=v; }\n}', desc: 'Class with type parameter.' },
    { label: 'Generic method', code: 'public static <T> void print(T val){ System.out.println(val); }', desc: 'Method with type param.' },
    { label: 'Wildcard', code: 'List<?> list = new ArrayList<String>();', desc: 'Unknown type parameter.' },

    // ==== Concurrency ====
    { label: 'Thread', code: 'new Thread(() -> System.out.println("run")).start();', desc: 'Start new thread.' },
    { label: 'Executor', code: 'ExecutorService ex = Executors.newFixedThreadPool(2);\nex.submit(() -> doWork());', desc: 'Thread pool.' },
    { label: 'Future', code: 'Future<Integer> f = ex.submit(() -> 42);\nint r = f.get();', desc: 'Async computation result.' },
    { label: 'Sync block', code: 'synchronized(this){ counter++; }', desc: 'Thread-safe block.' },

    // ==== Files & I/O ====
    { label: 'Read file', code: 'Files.readString(Path.of("file.txt"));', desc: 'Read file contents.' },
    { label: 'Write file', code: 'Files.writeString(Path.of("out.txt"), "hello");', desc: 'Write text to file.' },
    { label: 'Scanner', code: 'Scanner sc = new Scanner(System.in);\nString line = sc.nextLine();', desc: 'Read from input.' },

    // ==== Useful APIs ====
    { label: 'Math', code: 'Math.max(3,7); Math.random();', desc: 'Math utilities.' },
    { label: 'Date/Time', code: 'LocalDate.now();\nLocalDateTime.now();', desc: 'Modern date API (java.time).' },
    { label: 'Regex', code: 'Pattern p = Pattern.compile("[a-z]+");\nMatcher m = p.matcher("abc");', desc: 'Regex API.' },

    // ==== Modules & Build ====
    { label: 'Package', code: 'package com.example;', desc: 'Namespace declaration.' },
    { label: 'Import', code: 'import java.util.List;', desc: 'Bring class into scope.' },
    { label: 'Module', code: 'module myapp { requires java.sql; }', desc: 'Java module system (JPMS).' },
    { label: 'Maven dep', code: '<dependency>\n  <groupId>org.slf4j</groupId>\n  <artifactId>slf4j-api</artifactId>\n  <version>2.0.0</version>\n</dependency>', desc: 'Maven dependency snippet.' },
    { label: 'Gradle dep', code: 'implementation "org.slf4j:slf4j-api:2.0.0"', desc: 'Gradle dependency notation.' }
  ]
},
    {
  title: 'C#',
  items: [
    // ==== Basics ====
    { label: 'Main', code: 'Console.WriteLine("Hello");', desc: '.NET console output.' },
    { label: 'Variables', code: 'int x = 10;\nstring name = "Alice";\nvar pi = 3.14;', desc: 'Strongly typed with inference.' },
    { label: 'If/else', code: 'if (x > 0) {\n  Console.WriteLine("positive");\n} else {\n  Console.WriteLine("negative");\n}', desc: 'Conditional branching.' },
    { label: 'Switch expr', code: 'string msg = day switch {\n  "Mon" => "Start",\n  _ => "Other"\n};', desc: 'Switch expression (C# 8+).' },
    { label: 'Loop', code: 'for (int i = 0; i < 5; i++) {\n  Console.WriteLine(i);\n}', desc: 'For loop.' },
    { label: 'Foreach', code: 'foreach (var item in list) {\n  Console.WriteLine(item);\n}', desc: 'Iterate collection.' },

    // ==== OOP ====
    { label: 'Class', code: 'public class Person {\n  public string Name { get; set; }\n  public Person(string name) { Name = name; }\n}', desc: 'Class with property & constructor.' },
    { label: 'Inheritance', code: 'public class Admin : Person {\n  public Admin(string name) : base(name) {}\n}', desc: 'Class inheritance.' },
    { label: 'Interface', code: 'public interface ISpeakable { void Speak(); }', desc: 'Interface definition.' },
    { label: 'Implement', code: 'public class Dog : ISpeakable {\n  public void Speak() => Console.WriteLine("Woof");\n}', desc: 'Implements interface.' },
    { label: 'Abstract class', code: 'public abstract class Shape {\n  public abstract double Area();\n}', desc: 'Abstract base class.' },
    { label: 'Record', code: 'public record User(int Id, string Name);', desc: 'Immutable type with value equality (C# 9+).' },
    { label: 'Enum', code: 'public enum Color { Red, Green, Blue }', desc: 'Enum constants.' },

    // ==== Collections ====
    { label: 'List', code: 'var list = new List<int> { 1, 2, 3 };', desc: 'Generic list.' },
    { label: 'Dictionary', code: 'var map = new Dictionary<string,int> { ["a"] = 1, ["b"] = 2 };', desc: 'Key-value pairs.' },
    { label: 'HashSet', code: 'var set = new HashSet<string> { "a", "b" };', desc: 'Unique collection.' },
    { label: 'Queue/Stack', code: 'var q = new Queue<int>();\nq.Enqueue(1);\nvar s = new Stack<int>();\ns.Push(1);', desc: 'FIFO and LIFO collections.' },

    // ==== LINQ & Lambdas ====
    { label: 'Lambda', code: 'Func<int,int> square = x => x*x;', desc: 'Anonymous function.' },
    { label: 'Linq', code: 'var doubled = list.Select(n => n*2).ToList();', desc: 'Projection.' },
    { label: 'Where', code: 'var evens = list.Where(n => n%2==0);', desc: 'Filter elements.' },
    { label: 'Aggregate', code: 'int sum = list.Aggregate((a,b) => a+b);', desc: 'Reduce to single value.' },
    { label: 'FirstOrDefault', code: 'var first = list.FirstOrDefault();', desc: 'Safe retrieval.' },

    // ==== Async / Await ====
    { label: 'Async method', code: 'public async Task<string> GetData(){\n  await Task.Delay(1000);\n  return "done";\n}', desc: 'Async method returning Task.' },
    { label: 'Await call', code: 'string result = await GetData();', desc: 'Consume async method.' },
    { label: 'Parallel', code: 'await Task.WhenAll(Task1(), Task2());', desc: 'Run tasks concurrently.' },

    // ==== Exceptions ====
    { label: 'Try/catch', code: 'try {\n  int x = 1/0;\n} catch (DivideByZeroException e) {\n  Console.WriteLine(e.Message);\n}', desc: 'Exception handling.' },
    { label: 'Finally', code: 'try {\n  DoWork();\n} finally {\n  Cleanup();\n}', desc: 'Always executes cleanup.' },
    { label: 'Throw', code: 'throw new InvalidOperationException("bad state");', desc: 'Raise exception.' },

    // ==== Generics ====
    { label: 'Generic class', code: 'public class Box<T> { public T Value { get; } public Box(T v) { Value = v; } }', desc: 'Generic type.' },
    { label: 'Generic method', code: 'public T Echo<T>(T val) => val;', desc: 'Generic method definition.' },

    // ==== Files & I/O ====
    { label: 'Read file', code: 'var text = File.ReadAllText("file.txt");', desc: 'Read text file.' },
    { label: 'Write file', code: 'File.WriteAllText("out.txt", "hello");', desc: 'Write text file.' },
    { label: 'Stream', code: 'using var fs = new FileStream("f.txt", FileMode.Open);', desc: 'Open file stream with using.' },

    // ==== Useful APIs ====
    { label: 'DateTime', code: 'var now = DateTime.Now;', desc: 'Current date/time.' },
    { label: 'String interp', code: 'var msg = $"Hello {name}!";', desc: 'String interpolation.' },
    { label: 'Regex', code: 'var m = Regex.Match("abc123", @"\\d+");', desc: 'Regex in C#.' },
    { label: 'Null-coalescing', code: 'string val = input ?? "default";', desc: 'Fallback value if null.' },

    // ==== Advanced ====
    { label: 'Delegates', code: 'public delegate int Op(int x, int y);\nOp add = (a,b)=>a+b;', desc: 'Delegate as function type.' },
    { label: 'Events', code: 'public event EventHandler Click;\nClick?.Invoke(this, EventArgs.Empty);', desc: 'Event declaration & invocation.' },
    { label: 'Attributes', code: '[Obsolete("Use NewMethod instead")]', desc: 'Metadata attributes.' },
    { label: 'Dynamic', code: 'dynamic obj = 1;\nobj = "string";', desc: 'Bypasses compile-time checks.' },
    { label: 'Pattern matching', code: 'if (obj is string s) Console.WriteLine(s.Length);', desc: 'Type-safe casting with patterns.' }
  ]
},
    {
  title: 'Go',
  items: [
    // ==== Basics ====
    { label: 'Hello', code: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello")\n}', desc: 'Basic program.' },
    { label: 'Variables', code: 'var x int = 10\ny := 20', desc: 'Explicit and shorthand declarations.' },
    { label: 'Constants', code: 'const Pi = 3.14', desc: 'Immutable value.' },
    { label: 'If/else', code: 'if x > 0 {\n  fmt.Println("pos")\n} else {\n  fmt.Println("neg")\n}', desc: 'Conditional branch.' },
    { label: 'Switch', code: 'switch day {\ncase "Mon": fmt.Println("Start")\ndefault: fmt.Println("Other")\n}', desc: 'Switch statement.' },
    { label: 'For loop', code: 'for i := 0; i < 5; i++ {\n  fmt.Println(i)\n}', desc: 'Traditional for loop.' },
    { label: 'Range loop', code: 'for i, v := range nums {\n  fmt.Println(i, v)\n}', desc: 'Iterate slices, arrays, maps.' },

    // ==== Functions ====
    { label: 'Function', code: 'func add(a, b int) int {\n  return a + b\n}', desc: 'Define function with return.' },
    { label: 'Multiple return', code: 'func swap(a, b int) (int, int) {\n  return b, a\n}', desc: 'Return multiple values.' },
    { label: 'Variadic', code: 'func sum(nums ...int) int {\n  total := 0\n  for _, n := range nums { total += n }\n  return total\n}', desc: 'Function with variable args.' },

    // ==== Structs & OOP ====
    { label: 'Struct', code: 'type User struct {\n  ID int\n  Name string\n}', desc: 'Define struct.' },
    { label: 'Struct literal', code: 'u := User{ID:1, Name:"Bob"}', desc: 'Create instance.' },
    { label: 'Methods', code: 'func (u User) Greet() string {\n  return "Hi " + u.Name\n}', desc: 'Attach method to struct.' },
    { label: 'Pointer receiver', code: 'func (u *User) Rename(newName string) {\n  u.Name = newName\n}', desc: 'Modify struct via pointer.' },
    { label: 'Interfaces', code: 'type Speaker interface {\n  Speak() string\n}', desc: 'Interface definition.' },
    { label: 'Implement interface', code: 'func (u User) Speak() string {\n  return u.Name\n}', desc: 'Struct automatically implements interface.' },

    // ==== Concurrency ====
    { label: 'Goroutine', code: 'go func() { fmt.Println("concurrent") }()', desc: 'Lightweight thread.' },
    { label: 'Channel', code: 'c := make(chan int)\ngo func(){ c <- 1 }()\nval := <-c', desc: 'Send/receive with channels.' },
    { label: 'Buffered channel', code: 'ch := make(chan int, 2)\nch <- 1\nch <- 2', desc: 'Channel with capacity.' },
    { label: 'Select', code: 'select {\ncase v := <-ch1: fmt.Println(v)\ncase ch2 <- 1: fmt.Println("sent")\ndefault: fmt.Println("none")\n}', desc: 'Wait on multiple channels.' },

    // ==== Error handling ====
    { label: 'Error return', code: 'func divide(a,b int) (int,error) {\n  if b==0 { return 0, fmt.Errorf("div by zero") }\n  return a/b,nil\n}', desc: 'Return error as value.' },
    { label: 'Check error', code: 'res, err := divide(4,0)\nif err != nil {\n  fmt.Println(err)\n}', desc: 'Handle errors explicitly.' },
    { label: 'Panic/Recover', code: 'defer func() {\n  if r := recover(); r != nil { fmt.Println("Recovered", r) }\n}()\npanic("fail")', desc: 'Catch panics.' },

    // ==== Packages & Modules ====
    { label: 'Module init', code: 'go mod init example.com/app', desc: 'Initialize module.' },
    { label: 'Import', code: 'import (\n  "fmt"\n  "math"\n)', desc: 'Import packages.' },
    { label: 'External package', code: 'import "github.com/gorilla/mux"\n// go get github.com/gorilla/mux', desc: 'Third-party package.' },

    // ==== Standard library ====
    { label: 'String', code: 's := "hello"\nlen(s)\nstrings.ToUpper(s)', desc: 'String utilities.' },
    { label: 'Math', code: 'math.Max(3,5)\nmath.Sqrt(16)', desc: 'Math functions.' },
    { label: 'Time', code: 't := time.Now()\nt.Format("2006-01-02")', desc: 'Time handling.' },
    { label: 'OS', code: 'os.Mkdir("dir", 0755)\nos.ReadFile("file.txt")', desc: 'Filesystem operations.' },

    // ==== I/O ====
    { label: 'Read file', code: 'data, err := os.ReadFile("file.txt")', desc: 'Read file content.' },
    { label: 'Write file', code: 'err := os.WriteFile("out.txt", []byte("hi"), 0644)', desc: 'Write file content.' },
    { label: 'Scanner', code: 'scanner := bufio.NewScanner(os.Stdin)\nscanner.Scan()\nline := scanner.Text()', desc: 'Read input line by line.' },

    // ==== Useful idioms ====
    { label: 'Defer', code: 'defer fmt.Println("done")', desc: 'Execute at function exit.' },
    { label: 'Anonymous func', code: 'f := func(x int){ fmt.Println(x) }\nf(5)', desc: 'Inline function.' },
    { label: 'Constants iota', code: 'const (\n  A = iota\n  B\n  C\n)', desc: 'Auto incrementing constants.' }
  ]
},
    {
  title: 'Rust',
  items: [
    // ==== Basics ====
    { label: 'Hello', code: 'fn main() {\n    println!("Hello");\n}', desc: 'Basic program.' },
    { label: 'Variables', code: 'let x = 5;\nlet mut y = 10;\ny += 1;', desc: 'Immutable and mutable variables.' },
    { label: 'Constants', code: 'const PI: f64 = 3.1415;', desc: 'Compile-time constant.' },
    { label: 'If/else', code: 'if x > 0 {\n    println!("pos");\n} else {\n    println!("neg");\n}', desc: 'Conditional branch.' },
    { label: 'Loop', code: 'for i in 0..5 {\n    println!("{}", i);\n}', desc: 'Range-based for loop.' },
    { label: 'While loop', code: 'let mut n = 0;\nwhile n < 5 {\n    n += 1;\n}', desc: 'While loop.' },

    // ==== Data Types & Collections ====
    { label: 'Vec', code: 'let mut v = vec![1, 2, 3];\nv.push(4);', desc: 'Growable vector.' },
    { label: 'Array', code: 'let a = [1,2,3];', desc: 'Fixed-size array.' },
    { label: 'Tuple', code: 'let t = (1, "hello");', desc: 'Fixed-size heterogeneous collection.' },
    { label: 'HashMap', code: 'use std::collections::HashMap;\nlet mut map = HashMap::new();\nmap.insert("a", 1);', desc: 'Key-value collection.' },

    // ==== Functions ====
    { label: 'Function', code: 'fn add(a: i32, b: i32) -> i32 { a + b }', desc: 'Function with return type.' },
    { label: 'Multiple return', code: 'fn swap(a:i32,b:i32)->(i32,i32){(b,a)}', desc: 'Return tuple.' },
    { label: 'Closure', code: 'let square = |x:i32| x*x;\nlet y = square(5);', desc: 'Anonymous function.' },

    // ==== Ownership & Borrowing ====
    { label: 'Ownership', code: 'let s = String::from("hello");\nlet s2 = s; // s moved', desc: 'Move semantics.' },
    { label: 'Borrow', code: 'fn len(s: &String) -> usize { s.len() }\nlet l = len(&s);', desc: 'Pass by reference.' },
    { label: 'Mutable borrow', code: 'fn add_one(s: &mut i32) { *s += 1 }\nlet mut n=5;\nadd_one(&mut n);', desc: 'Modify via mutable reference.' },

    // ==== Error Handling ====
    { label: 'Result', code: 'fn do_it() -> Result<(), Box<dyn Error>> { Ok(()) }', desc: 'Error handling.' },
    { label: 'Option', code: 'let maybe: Option<i32> = Some(5);', desc: 'Optional value.' },
    { label: 'Option match', code: 'match maybe {\n  Some(x) => x,\n  None => 0\n}', desc: 'Pattern match optional.' },
    { label: 'unwrap / expect', code: 'let x = maybe.unwrap_or(0);\nlet y = maybe.expect("Must have value");', desc: 'Handle Option safely.' },

    // ==== Structs & Enums ====
    { label: 'Struct', code: 'struct User { id: i32, name: String }\nlet u = User { id:1, name:"Alice".to_string() };', desc: 'Define struct and instance.' },
    { label: 'Tuple struct', code: 'struct Color(i32,i32,i32);\nlet c = Color(255,0,0);', desc: 'Struct with unnamed fields.' },
    { label: 'Enum', code: 'enum Direction { Up, Down, Left, Right }\nlet dir = Direction::Up;', desc: 'Define enum.' },
    { label: 'Enum with data', code: 'enum Shape { Circle(f64), Rect(f64,f64) }', desc: 'Enum carrying data.' },

    // ==== Traits & Generics ====
    { label: 'Trait', code: 'trait Speak { fn speak(&self); }', desc: 'Define trait.' },
    { label: 'Implement trait', code: 'impl Speak for User {\n  fn speak(&self){ println!("{}", self.name) }\n}', desc: 'Implement trait for struct.' },
    { label: 'Generic function', code: 'fn wrap<T>(x:T)->T { x }', desc: 'Generic type parameter.' },
    { label: 'Generic struct', code: 'struct Box<T> { value: T }', desc: 'Generic struct.' },

    // ==== Concurrency ====
    { label: 'Thread', code: 'use std::thread;\nthread::spawn(|| println!("Hi"));', desc: 'Spawn thread.' },
    { label: 'Channel', code: 'use std::sync::mpsc;\nlet (tx, rx) = mpsc::channel();\ntx.send(42).unwrap();\nlet val = rx.recv().unwrap();', desc: 'Send/receive between threads.' },

    // ==== Modules & Packages ====
    { label: 'Module', code: 'mod utils { pub fn greet(){ println!("Hi") } }\nutils::greet();', desc: 'Define module and call.' },
    { label: 'Crate', code: 'use serde::Serialize;', desc: 'External package (add to Cargo.toml).' },

    // ==== File I/O ====
    { label: 'Read file', code: 'use std::fs;\nlet data = fs::read_to_string("file.txt")?;', desc: 'Read file as string.' },
    { label: 'Write file', code: 'fs::write("out.txt","hello")?;', desc: 'Write string to file.' }
  ]
},
    {
  title: 'SQL',
  items: [
    // ==== DDL (Data Definition Language) ====
    { label: 'Create table', code: 'CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  name TEXT,\n  active BOOLEAN DEFAULT true\n);', desc: 'Create a table with constraints.' },
    { label: 'Drop table', code: 'DROP TABLE IF EXISTS users;', desc: 'Remove table if exists.' },
    { label: 'Alter table', code: 'ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();', desc: 'Modify table schema.' },
    { label: 'Create index', code: 'CREATE INDEX idx_users_email ON users(email);', desc: 'Speed up queries on column.' },
    
    // ==== DML (Data Manipulation Language) ====
    { label: 'Insert', code: "INSERT INTO users (email, active, name) VALUES ('a@b.com', true, 'Alice');", desc: 'Add a row.' },
    { label: 'Update', code: "UPDATE users SET active = false WHERE email = 'a@b.com';", desc: 'Modify existing rows.' },
    { label: 'Delete', code: "DELETE FROM users WHERE active = false;", desc: 'Remove rows.' },
    
    // ==== Querying ====
    { label: 'Select', code: 'SELECT id, email, name FROM users WHERE active = true ORDER BY id DESC LIMIT 10;', desc: 'Retrieve filtered and sorted rows.' },
    { label: 'Select all', code: 'SELECT * FROM users;', desc: 'Get all columns.' },
    { label: 'Distinct', code: 'SELECT DISTINCT active FROM users;', desc: 'Get unique values.' },
    { label: 'Where clause', code: "SELECT * FROM users WHERE name LIKE 'A%';", desc: 'Filter rows using condition.' },
    { label: 'Join', code: 'SELECT u.id, u.name, o.amount FROM users u INNER JOIN orders o ON u.id = o.user_id;', desc: 'Combine tables using JOIN.' },
    { label: 'Left join', code: 'SELECT u.id, o.amount FROM users u LEFT JOIN orders o ON u.id = o.user_id;', desc: 'Include all left table rows.' },
    
    // ==== Aggregates ====
    { label: 'Count', code: 'SELECT COUNT(*) FROM users WHERE active = true;', desc: 'Count matching rows.' },
    { label: 'Sum', code: 'SELECT SUM(amount) FROM orders;', desc: 'Sum column values.' },
    { label: 'Avg', code: 'SELECT AVG(amount) FROM orders;', desc: 'Average value.' },
    { label: 'Group by', code: 'SELECT active, COUNT(*) FROM users GROUP BY active;', desc: 'Aggregate per group.' },
    { label: 'Having', code: 'SELECT active, COUNT(*) FROM users GROUP BY active HAVING COUNT(*) > 5;', desc: 'Filter aggregated results.' },
    
    // ==== Transactions & Control ====
    { label: 'Begin transaction', code: 'BEGIN;', desc: 'Start a transaction.' },
    { label: 'Commit', code: 'COMMIT;', desc: 'Save transaction changes.' },
    { label: 'Rollback', code: 'ROLLBACK;', desc: 'Undo transaction changes.' },
    
    // ==== Other useful commands ====
    { label: 'Create view', code: 'CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;', desc: 'Virtual table for query reuse.' },
    { label: 'Drop view', code: 'DROP VIEW IF EXISTS active_users;', desc: 'Remove view if exists.' },
    { label: 'Limit / Offset', code: 'SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;', desc: 'Pagination.' }
  ]
},
    {
  title: 'Web & Frontend',
  items: [
    // ==== TypeScript / JS ====
    { label: 'TypeScript basics', code: 'type User = { id: number; name: string }\ninterface Point { x: number; y: number }\nfunction id<T>(x: T): T { return x }', desc: 'Types, interfaces, generics.' },
    { label: 'Arrow functions', code: 'const add = (a: number, b: number) => a + b;', desc: 'Concise function syntax.' },
    { label: 'Optional chaining', code: 'const email = user?.profile?.email ?? "N/A";', desc: 'Safe property access.' },
    { label: 'Array map/filter/reduce', code: '[1,2,3].map(n => n*2).filter(n => n>2).reduce((a,b)=>a+b,0);', desc: 'Common array operations.' },

    // ==== HTML5 / Semantics ====
    { label: 'HTML5 semantics', code: '<header>...</header>\n<nav>...</nav>\n<main>\n  <section>...</section>\n  <article>...</article>\n</main>\n<footer>...</footer>', desc: 'Use semantic tags for structure & accessibility.' },
    { label: 'Forms', code: '<form>\n  <input type="text" name="name" required />\n  <button type="submit">Submit</button>\n</form>', desc: 'Form with validation.' },
    { label: 'Meta / SEO', code: '<meta name="description" content="Dev notes" />', desc: 'SEO metadata.' },
    
    // ==== CSS / Layout ====
    { label: 'CSS Grid', code: '.grid-container{display:grid;grid-template-columns:repeat(12,1fr);gap:1rem;}', desc: 'Create responsive grid layout.' },
    { label: 'CSS Flexbox', code: '.flex-row{display:flex;align-items:center;justify-content:space-between;}', desc: 'Align and distribute items.' },
    { label: 'Responsive media query', code: '@media (max-width: 768px) { .container { grid-template-columns: 1fr; } }', desc: 'Adapt layout for smaller screens.' },
    { label: 'Tailwind quickies', code: 'Flex center: flex items-center justify-center\nGrid: grid grid-cols-12 gap-4\nBtn: px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white', desc: 'Common utility patterns.' },

    // ==== React / Framework basics ====
    { label: 'React component', code: 'function Hello(){ return <h1>Hello</h1>; }', desc: 'Functional component.' },
    { label: 'React state', code: 'const [count,setCount] = useState(0);', desc: 'Use state in function component.' },
    { label: 'React effect', code: 'useEffect(() => { console.log("mounted") }, []);', desc: 'Run side effect on mount.' },
    { label: 'Next.js page', code: 'export default function Home(){ return <div>Home</div> }', desc: 'Basic Next.js page.' },
    { label: 'Next.js getStaticProps', code: 'export async function getStaticProps(){ return { props: { data: [] } } }', desc: 'Fetch data at build time.' },

    // ==== DOM / Events ====
    { label: 'Event listener', code: 'document.getElementById("btn")?.addEventListener("click", e => { console.log("clicked"); });', desc: 'Attach click event.' },
    { label: 'DOM query', code: 'const el = document.querySelector(".class");', desc: 'Select element.' },
    { label: 'Create element', code: 'const div = document.createElement("div"); div.textContent = "Hello"; document.body.appendChild(div);', desc: 'Dynamically create elements.' },

    // ==== Storage / Local ====
    { label: 'LocalStorage', code: 'localStorage.setItem("key","value"); const val = localStorage.getItem("key");', desc: 'Browser persistent storage.' },
    { label: 'SessionStorage', code: 'sessionStorage.setItem("key","value");', desc: 'Temporary browser storage.' },
    { label: 'Cookies', code: 'document.cookie = "name=John; path=/; max-age=3600";', desc: 'Set cookie.' }
  ]
},
    {
  title: 'Backend & APIs',
  items: [
    // ==== Go / net/http ====
    { label: 'Go HTTP', code: 'package main\nimport (\n  "fmt"\n  "net/http"\n)\nfunc main() {\n  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){\n    fmt.Fprintln(w, "ok")\n  })\n  http.ListenAndServe(":8080", nil)\n}', desc: 'Minimal net/http server.' },
    { label: 'Go JSON API', code: 'http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request){\n  w.Header().Set("Content-Type","application/json")\n  fmt.Fprintln(w, `{"status":"ok"}`)\n})', desc: 'Return JSON response.' },
    { label: 'Go query params', code: 'id := r.URL.Query().Get("id")', desc: 'Read GET parameters.' },

    // ==== Rust / axum / actix ====
    { label: 'Rust axum', code: 'use axum::{routing::get, Router};\n#[tokio::main]\nasync fn main(){\n  let app = Router::new().route("/", get(|| async { "ok" }));\n  axum::Server::bind(&"0.0.0.0:3000".parse().unwrap()).serve(app.into_make_service()).await.unwrap();\n}', desc: 'Tiny async web server.' },
    { label: 'Rust JSON response', code: 'use axum::Json;\nasync fn handler() -> Json<serde_json::Value> {\n  Json(serde_json::json!({"status":"ok"}))\n}', desc: 'Return JSON from handler.' },

    // ==== Node.js / Express ====
    { label: 'Express basic', code: 'const express = require("express");\nconst app = express();\napp.get("/", (req,res)=>res.send("ok"));\napp.listen(3000);', desc: 'Minimal Express server.' },
    { label: 'Express JSON', code: 'app.get("/api", (req,res)=>res.json({status:"ok"}));', desc: 'Return JSON from endpoint.' },

    // ==== PHP ====
    { label: 'PHP JSON', code: '<?php\nheader("Content-Type: application/json");\necho json_encode(["status" => "ok"]);', desc: 'Return JSON response.' },
    { label: 'PHP GET param', code: '<?php\n$id = $_GET["id"] ?? null;', desc: 'Read query parameter.' },

    // ==== Ruby / Sinatra ====
    { label: 'Ruby Sinatra', code: 'require "sinatra"\nget("/") { "ok" }', desc: 'Tiny web route.' },
    { label: 'Sinatra JSON', code: 'get("/api") { content_type :json; {status:"ok"}.to_json }', desc: 'Return JSON from route.' },

    // ==== Python / Flask / FastAPI ====
    { label: 'Flask basic', code: 'from flask import Flask\napp = Flask(__name__)\n@app.route("/")\ndef home(): return "ok"\napp.run(port=5000)', desc: 'Minimal Flask server.' },
    { label: 'Flask JSON', code: 'from flask import jsonify\n@app.route("/api")\ndef api(): return jsonify(status="ok")', desc: 'Return JSON response.' },
    { label: 'FastAPI basic', code: 'from fastapi import FastAPI\napp = FastAPI()\n@app.get("/")\ndef read_root(): return {"status":"ok"}', desc: 'FastAPI JSON response.' },

    // ==== Common Patterns ====
    { label: 'Read query param', code: 'value := r.URL.Query().Get("id") // Go\nreq.query.id // JS\nrequest.args.get("id") // Python', desc: 'Read GET parameters in different languages.' },
    { label: 'Read POST JSON', code: 'var data map[string]interface{}\njson.NewDecoder(r.Body).Decode(&data) // Go\nreq.body // JS\nrequest.json() // Python', desc: 'Read POST JSON body.' },
    { label: 'CORS header', code: 'w.Header().Set("Access-Control-Allow-Origin", "*") // Go\nres.setHeader("Access-Control-Allow-Origin","*") // JS', desc: 'Allow cross-origin requests.' }
  ]
},
    {
  title: 'Mobile',
  items: [
    // ==== Kotlin / Android ====
    { label: 'Kotlin function', code: 'fun greet(name: String): String = "Hello, $name"', desc: 'Kotlin expression function.' },
    { label: 'Kotlin main', code: 'fun main() {\n  println("Hello World")\n}', desc: 'Basic Kotlin entry point.' },
    { label: 'Kotlin class', code: 'class Person(val name: String, var age: Int)', desc: 'Define a class with properties.' },
    { label: 'Kotlin data class', code: 'data class User(val id: Int, val name: String)', desc: 'Immutable value object.' },
    { label: 'Kotlin list operations', code: 'val nums = listOf(1,2,3).map{ it*2 }.filter{ it>2 }', desc: 'Functional operations on collections.' },

    // ==== Swift / SwiftUI ====
    { label: 'Swift basic', code: 'import Foundation\nprint("Hello World")', desc: 'Simple Swift program.' },
    { label: 'SwiftUI View', code: 'import SwiftUI\nstruct ContentView: View {\n  var body: some View {\n    Text("Hello").padding()\n  }\n}', desc: 'Minimal SwiftUI component.' },
    { label: 'Swift struct', code: 'struct User { let id: Int; var name: String }', desc: 'Define struct with properties.' },
    { label: 'Swift optional', code: 'var name: String? = nil\nprint(name ?? "N/A")', desc: 'Handle optional values safely.' },
    { label: 'SwiftUI Button', code: 'Button("Click Me") {\n  print("Pressed")\n}', desc: 'Interactive UI element.' },

    // ==== Flutter / Dart ====
    { label: 'Flutter widget', code: 'class Hello extends StatelessWidget {\n  @override\n  Widget build(BuildContext ctx) => Text("Hello");\n}', desc: 'StatelessWidget example.' },
    { label: 'Flutter StatefulWidget', code: 'class Counter extends StatefulWidget {\n  @override\n  _CounterState createState() => _CounterState();\n}\nclass _CounterState extends State<Counter> {\n  int count = 0;\n  @override\n  Widget build(BuildContext ctx) => ElevatedButton(\n    onPressed: () => setState(() => count++),\n    child: Text("Count: $count"),\n  );\n}', desc: 'Interactive stateful widget.' },
    { label: 'Flutter Scaffold', code: 'Scaffold(appBar: AppBar(title: Text("App")), body: Center(child: Text("Hello")))','desc':'Basic page layout.' },
    { label: 'Flutter ListView', code: 'ListView.builder(itemCount: items.length, itemBuilder: (_,i)=>Text(items[i]))', desc: 'Dynamic scrollable list.' },
    { label: 'Flutter routing', code: 'Navigator.push(context, MaterialPageRoute(builder: (_) => NextPage()));', desc: 'Navigate between pages.' }
  ]
},
    {
  title: 'Data & Machine Learning',
  items: [
    // ==== R / dplyr / ggplot2 ====
    { label: 'R dplyr filter/group/summarise', code: 'library(dplyr)\nmtcars %>% filter(mpg > 20) %>% group_by(cyl) %>% summarise(avg = mean(mpg))', desc: 'Filter, group, summarise.' },
    { label: 'R mutate', code: 'mtcars %>% mutate(mpg2 = mpg*2)', desc: 'Add new column.' },
    { label: 'R ggplot', code: 'library(ggplot2)\nggplot(mtcars, aes(x=mpg, y=hp)) + geom_point()', desc: 'Scatter plot.' },

    // ==== Julia ====
    { label: 'Julia basics', code: 'f(x) = x^2\nxs = [1,2,3]\nys = f.(xs)', desc: 'Function and broadcasting.' },
    { label: 'Julia DataFrame', code: 'using DataFrames\ndf = DataFrame(A=1:3, B=4:6)', desc: 'Create a dataframe.' },
    { label: 'Julia plot', code: 'using Plots\nplot([1,2,3],[4,5,6], label="line")', desc: 'Basic plot.' },

    // ==== MATLAB / Octave ====
    { label: 'MATLAB plot', code: 'x = 0:0.1:10; y = sin(x);\nplot(x,y); grid on; title("Sine");', desc: 'Plot in MATLAB/Octave.' },
    { label: 'MATLAB matrix', code: 'A = [1 2; 3 4]; B = A*2;', desc: 'Matrix operations.' },
    { label: 'MATLAB for loop', code: 'for i=1:5\n disp(i)\nend', desc: 'Iterate with for loop.' },

    // ==== Python / NumPy / Pandas / Matplotlib ====
    { label: 'NumPy array', code: 'import numpy as np\narr = np.array([1,2,3])\narr2 = arr*2', desc: 'Vectorized operations.' },
    { label: 'Pandas DataFrame', code: 'import pandas as pd\ndf = pd.DataFrame({"A":[1,2,3],"B":[4,5,6]})', desc: 'Tabular data.' },
    { label: 'Pandas filter/groupby', code: 'df[df.A>1].groupby("B").sum()', desc: 'Filter and aggregate.' },
    { label: 'Matplotlib plot', code: 'import matplotlib.pyplot as plt\nplt.plot([1,2,3],[4,5,6]); plt.show()', desc: 'Basic Python plot.' },
    { label: 'Seaborn scatter', code: 'import seaborn as sns\nsns.scatterplot(data=df, x="A", y="B")', desc: 'Enhanced visualization.' },

    // ==== Machine Learning basics ====
    { label: 'Scikit-learn train/test split', code: 'from sklearn.model_selection import train_test_split\nX_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2)', desc: 'Split dataset.' },
    { label: 'Scikit-learn model fit', code: 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit(X_train,y_train)', desc: 'Train model.' },
    { label: 'Scikit-learn predict', code: 'y_pred = model.predict(X_test)', desc: 'Make predictions.' },
    { label: 'TensorFlow basic', code: 'import tensorflow as tf\nmodel = tf.keras.Sequential([tf.keras.layers.Dense(1)])\nmodel.compile(optimizer="adam", loss="mse")', desc: 'Build simple neural network.' },
    { label: 'PyTorch tensor', code: 'import torch\nt = torch.tensor([1.0,2.0,3.0])', desc: 'Basic tensor.' }
  ]
},
    {
  title: 'Systems & Scripting',
  items: [
    // ==== Bash / Shell ====
    { label: 'Bash find/grep', code: 'find . -type f -name "*.js" -print0 | xargs -0 grep -n "pattern"', desc: 'Search text in files.' },
    { label: 'List files', code: 'ls -la', desc: 'List files with details, including hidden.' },
    { label: 'Copy / Move / Remove', code: 'cp src dest\nmv old new\nrm -rf folder/', desc: 'File operations.' },
    { label: 'Pipe and redirect', code: 'cat file | grep "pattern" > output.txt', desc: 'Combine commands and redirect output.' },
    { label: 'Permissions', code: 'chmod +x script.sh\nchown user:group file', desc: 'Change file permissions/ownership.' },

    // ==== C ====
    { label: 'C Hello', code: '#include <stdio.h>\nint main(void){ printf("Hello\\n"); return 0; }', desc: 'Smallest C program.' },
    { label: 'C compile/run', code: 'gcc main.c -o main\n./main', desc: 'Compile and execute C program.' },
    { label: 'C pointers', code: 'int x = 10;\nint *p = &x;\nprintf("%d", *p);', desc: 'Pointer usage.' },

    // ==== C++ ====
    { label: 'C++ vector', code: '#include <vector>\n#include <algorithm>\nint main(){ std::vector<int> v{1,2,3}; std::for_each(v.begin(), v.end(), [](int &x){ x*=2; }); }', desc: 'STL and lambda.' },
    { label: 'C++ class', code: 'class Person { public: std::string name; int age; };', desc: 'Define class.' },
    { label: 'C++ smart pointer', code: 'std::unique_ptr<int> p = std::make_unique<int>(5);', desc: 'Manage memory automatically.' },

    // ==== Assembly (x86-64) ====
    { label: 'x86-64 asm exit', code: 'global _start\n_start:\n  mov rax, 60 ; exit\n  xor rdi, rdi\n  syscall', desc: 'Linux exit syscall.' },
    { label: 'x86-64 asm write', code: 'mov rax, 1 ; sys_write\nmov rdi, 1 ; stdout\nmov rsi, msg\nmov rdx, len\nsyscall', desc: 'Write string to stdout.' },

    // ==== Python / Scripting ====
    { label: 'Python script', code: 'print("Hello World")', desc: 'Basic Python script.' },
    { label: 'Python args', code: 'import sys\nprint(sys.argv)', desc: 'Command-line arguments.' },
    { label: 'Python file IO', code: 'with open("file.txt") as f:\n  data = f.read()', desc: 'Read file content.' },

    // ==== Utilities ====
    { label: 'Cron job', code: '0 0 * * * /path/to/script.sh', desc: 'Schedule script daily at midnight.' },
    { label: 'Environment variables', code: 'export PATH=$PATH:/my/bin', desc: 'Set env variable in shell.' },
    { label: 'SSH', code: 'ssh user@host', desc: 'Remote login.' },
    { label: 'Tar / Zip', code: 'tar -czf archive.tgz folder/\nzip -r archive.zip folder/', desc: 'Compress files.' }
  ]
},
    {
  title: 'DevOps / Infra',
  items: [
    // ==== Kubernetes ====
    { label: 'K8s Deployment (YAML)', code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: app\n  template:\n    metadata:\n      labels:\n        app: app\n    spec:\n      containers:\n        - name: app\n          image: nginx:alpine\n          ports:\n            - containerPort: 80', desc: 'Kubernetes basic deploy.' },
    { label: 'K8s Service', code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: app-service\nspec:\n  type: ClusterIP\n  selector:\n    app: app\n  ports:\n    - port: 80\n      targetPort: 80', desc: 'Expose pods internally.' },
    { label: 'K8s Ingress', code: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app-ingress\nspec:\n  rules:\n    - host: example.com\n      http:\n        paths:\n        - path: /\n          pathType: Prefix\n          backend:\n            service:\n              name: app-service\n              port:\n                number: 80', desc: 'External HTTP routing.' },

    // ==== Terraform ====
    { label: 'Terraform HCL', code: 'terraform { required_version = ">= 1.5.0" }\nprovider "aws" { region = "us-east-1" }\nresource "aws_s3_bucket" "b" { bucket = "example-bucket" }', desc: 'HCL example resource.' },
    { label: 'Terraform output', code: 'output "bucket_name" {\n  value = aws_s3_bucket.b.id\n}', desc: 'Define output values.' },
    { label: 'Terraform variables', code: 'variable "region" { type = string default = "us-east-1" }', desc: 'Parameterize deployments.' },

    // ==== Ansible ====
    { label: 'Ansible play', code: '- hosts: web\n  become: true\n  tasks:\n    - name: Install nginx\n      apt: { name: nginx, state: present, update_cache: yes }\n    - name: Start nginx\n      service: { name: nginx, state: started, enabled: yes }', desc: 'Playbook tasks.' },
    { label: 'Ansible inventory', code: '[web]\nserver1.example.com\nserver2.example.com', desc: 'Define hosts.' },
    { label: 'Ansible variable', code: 'vars:\n  app_port: 8080', desc: 'Use variables in playbooks.' },

    // ==== Docker / Containers ====
    { label: 'Docker build/run', code: 'docker build -t myapp:latest .\ndocker run --rm -p 3000:3000 myapp:latest', desc: 'Build and run container.' },
    { label: 'Docker compose', code: 'version: "3"\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - "80:80"', desc: 'Define multi-container setup.' },

    // ==== CI/CD ====
    { label: 'GitHub Actions basic', code: 'name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: echo "Build step"', desc: 'Simple CI pipeline.' },
    { label: 'GitLab CI', code: 'stages:\n  - build\nbuild_job:\n  stage: build\n  script:\n    - echo "Building"', desc: 'GitLab pipeline.' },

    // ==== Cloud / AWS basics ====
    { label: 'AWS CLI S3', code: 'aws s3 cp file.txt s3://my-bucket/', desc: 'Upload file to S3.' },
    { label: 'AWS EC2 start', code: 'aws ec2 start-instances --instance-ids i-1234567890abcdef0', desc: 'Start EC2 instance.' }
  ]
},
    {
  title: 'Security / Blockchain',
  items: [
    // ==== Solidity / Ethereum ====
    { label: 'Solidity storage', code: 'pragma solidity ^0.8.0;\ncontract Storage {\n  uint256 public value;\n  function set(uint256 v) public { value = v; }\n}', desc: 'Simple state variable.' },
    { label: 'Solidity constructor', code: 'pragma solidity ^0.8.0;\ncontract MyContract {\n  uint256 public value;\n  constructor(uint256 _val) { value = _val; }\n}', desc: 'Initialize state on deployment.' },
    { label: 'Solidity mapping', code: 'mapping(address => uint256) public balances;', desc: 'Key-value storage for addresses.' },
    { label: 'Solidity function modifiers', code: 'modifier onlyOwner() {\n  require(msg.sender == owner);\n  _;\n}', desc: 'Access control pattern.' },
    { label: 'Solidity events', code: 'event ValueChanged(uint256 newValue);\nfunction set(uint256 v) public {\n  value = v;\n  emit ValueChanged(v);\n}', desc: 'Log changes on-chain.' },

    // ==== Move / Aptos / Sui ====
    { label: 'Move module', code: 'module 0x1::hello {\n  public fun hi(): u64 { 42 }\n}', desc: 'Tiny Move example.' },
    { label: 'Move resource', code: 'struct Coin has store { value: u64 }', desc: 'Define resource type.' },
    { label: 'Move function with parameters', code: 'public fun deposit(account: &signer, amount: u64) { /* ... */ }', desc: 'Secure function with signer.' },

    // ==== Blockchain basics ====
    { label: 'Ethereum address', code: '0x1234567890abcdef1234567890abcdef12345678', desc: '20-byte hex address.' },
    { label: 'Ethereum transaction', code: 'eth.sendTransaction({from: addr, to: addr2, value: 1 ether})', desc: 'Send ETH on-chain.' },
    { label: 'Smart contract ABI', code: '[{"inputs":[],"name":"myFunc","outputs":[],"stateMutability":"nonpayable","type":"function"}]', desc: 'Contract interface for apps.' },

    // ==== Security patterns ====
    { label: 'Reentrancy guard (Solidity)', code: 'modifier nonReentrant() {\n  require(!locked, "Locked");\n  locked = true;\n  _;\n  locked = false;\n}', desc: 'Prevent reentrancy attacks.' },
    { label: 'Safe math', code: 'using SafeMath for uint256;\nuint256 c = a.add(b);', desc: 'Avoid overflow/underflow.' },
    { label: 'Access control', code: 'contract Ownable { address public owner; modifier onlyOwner { require(msg.sender == owner); _; } }', desc: 'Restrict functions to owner.' },

    // ==== Wallet / signing ====
    { label: 'Generate keypair', code: 'const wallet = ethers.Wallet.createRandom()', desc: 'Create Ethereum wallet.' },
    { label: 'Sign message', code: 'const sig = await wallet.signMessage("Hello")', desc: 'Sign off-chain data.' },
    { label: 'Verify signature', code: 'ethers.utils.verifyMessage("Hello", sig)', desc: 'Recover signer address.' }
  ]
}
  ]

  const iconFor = (title) => {
    const iconMap = {
      'Web & Frontend': '🌐',
      'Backend & APIs': '⚙️',
      'Mobile': '📱',
      'Data & Machine Learning': '📊',
      'Systems & Scripting': '🐧',
      'DevOps / Infra': '☁️',
      'Security / Blockchain': '🛡️',
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Python': '🐍',
      'Java': '☕',
      'C#': '#️',
      'Go': '🐹',
      'Rust': '🦀',
      'SQL': '🗄️',
      'Docker': '🐳',
      'MongoDB': '🍃',
      'Bash / Shell': '💻',
      'Regex Quickies': '#️⃣',
      'HTTP Status Codes': '📄',
      'Git Essentials': '🌿',
      'NPM / Yarn': '📦',
      'Next.js Data Fetching': '⚡',
      'React Patterns': '⚛️',
    }
    const i = iconMap[title] || '📘'
    return <span aria-hidden="true" className="text-xl">{i}</span>
  }

  const logoFor = (title) => {
    const map = {
      'Web & Frontend': 'html5',
      'Backend & APIs': 'nodedotjs',
      'Mobile': 'android',
      'Data & Machine Learning': 'tensorflow',
      'Systems & Scripting': 'linux',
      'DevOps / Infra': 'kubernetes',
      'Security / Blockchain': 'solidity',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'openjdk',
      'C#': 'csharp',
      'Go': 'go',
      'Rust': 'rust',
      'SQL': 'postgresql',
      'Docker': 'docker',
      'MongoDB': 'mongodb',
      'Bash / Shell': 'gnubash',
      'Regex Quickies': null,
      'HTTP Status Codes': 'httpie',
      'Git Essentials': 'git',
      'NPM / Yarn': 'npm',
      'Next.js Data Fetching': 'nextdotjs',
      'React Patterns': 'react',
    }
    const slug = map[title]
    return slug ? `https://cdn.simpleicons.org/${slug}` : null
  }

  const categoryDescriptions = {
    'Git Essentials': 'Core git commands for daily workflows.',
    'NPM / Yarn': 'Package management and scripts.',
    'Next.js Data Fetching': 'Build-time and server-side data fetching.',
    'React Patterns': 'Common hooks and patterns.',
    'Bash / Shell': 'CLI commands for productivity.',
    'Docker': 'Containers, images, and commands.',
    'MongoDB': 'Connection strings and queries.',
    'HTTP Status Codes': 'Common responses and meanings.',
    'Regex Quickies': 'Useful regular expressions.',
    'JavaScript': 'Language essentials and idioms.',
    'TypeScript': 'Types, interfaces, and generics.',
    'Python': 'Syntax and common utilities.',
    'Java': 'Core language constructs.',
    'C#': 'Modern C# features.',
    'Go': 'Goroutines and channels.',
    'Rust': 'Ownership, result/option basics.',
    'SQL': 'DDL and DML cheats.',
    'Web & Frontend': 'UI, HTML5, CSS, TS and tooling.',
    'Backend & APIs': 'Servers and API frameworks.',
    'Mobile': 'Kotlin, Swift, Flutter basics.',
    'Data & Machine Learning': 'R, Julia, MATLAB snippets.',
    'Systems & Scripting': 'C/C++, Bash, Assembly.',
    'DevOps / Infra': 'K8s, Terraform, Ansible.',
    'Security / Blockchain': 'Solidity and Move basics.',
  }

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    let base = sections
    if (selectedCategory) {
      base = sections.filter((s) => s.title === selectedCategory)
    }
    if (!q) return base
    return base
      .map((s) => ({
        ...s,
        items: s.items.filter((i) =>
          [s.title, i.label, i.code, i.desc].some((t) => t.toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.items.length > 0)
  }, [query, sections, selectedCategory])

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch (e) {
      // noop
    }
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
        {/* Top Bar */}
        <nav className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)]">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
            <div className="text-center">
              <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Notes & Cheat Sheet
              </span>
            </div>
            <div className="w-24" />
          </div>
        </nav>

        {/* Header */}
        <header className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-5 sm:pb-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Quick References for Daily Dev Work
          </motion.h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Searchable snippets, and a local library for your PDFs/EPUBs. Files are stored only in your browser (IndexedDB).
          </p>

          <div className="mt-6 max-w-2xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cheat sheet (e.g. git push, getStaticProps, docker run)"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"></path>
              </svg>
            </div>
          </div>
        </header>

        
        {/* Content */}
        <main className="container mx-auto px-4 sm:px-6 pb-16">
          {/* Category Cards */}
          {!selectedCategory && !query && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
              {sections.map((s) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="cursor-pointer group"
                    style={{ perspective: 1000 }}
                    onClick={() => {
                      setSelectedCategory(s.title)
                      router.push(`/notes?cat=${encodeURIComponent(s.title)}`)
                    }}
                  >
                    <motion.div
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="relative w-full aspect-square"
                    >
                      <div
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-purple-400/40 transition-colors"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {logoFor(s.title) ? (
                          <img src={logoFor(s.title)} alt={`${s.title} logo`} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow" />
                        ) : (
                          <div className="text-4xl">{iconFor(s.title)}</div>
                        )}
                        <div className="text-center">
                          <h3 className="font-semibold text-purple-200">{s.title}</h3>
                          <div className="text-xs text-gray-300 mt-1">{s.items.length} items</div>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-center text-center hover:border-purple-400/40 transition-colors"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <div className="text-sm text-gray-200 mb-2">{categoryDescriptions[s.title] || 'Open to view snippets.'}</div>
                          <div className="text-xs text-gray-400">Click to open</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {(selectedCategory || query) && (
            <>
              {selectedCategory && (
                <div className="mb-6">
                  <button onClick={() => setSelectedCategory(null)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">← All Categories</button>
                </div>
              )}
              {filteredSections.length === 0 && (
                <div className="text-center text-gray-400 py-16">No matches found.</div>
              )}
            </>

          )}

          {(selectedCategory || query) && (
          <div className="space-y-10">
            {filteredSections.map((section, sIdx) => (
              <section key={section.title}>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  <span className="inline-flex items-center gap-2">
                    {logoFor(section.title) ? (<img src={logoFor(section.title)} alt={`${section.title} logo`} className="w-6 h-6 sm:w-7 sm:h-7 object-contain inline-block align-middle" />) : iconFor(section.title)}
                    <span>{section.title}</span>
                  </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, iIdx) => {
                    const key = `${sIdx}-${iIdx}-${item.label}`
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:border-purple-400/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-purple-200">{item.label}</h3>
                            <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(item.code, key)}
                            className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
                            aria-label="Copy code"
                          >
                            {copiedKey === key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="mt-3 p-3 bg-black/40 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words sm:whitespace-pre">
{item.code}
                        </pre>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
          )}
        </main>

        {/* Footer */}
    <footer className="bg-black/50 py-8 border-t border-white/20">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div className="text-gray-300 font-medium">
          DevNotes • Developer Cheat Sheets <br className="md:hidden" />
          <span className="text-sm text-gray-400">by CodeWithRaheem</span>
        </div>

        {/* Right: Social & Info */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-gray-400 text-sm">
            Updated regularly • Copy & use safely
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="https://github.com/siddiquiraheem527" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" 
                alt="GitHub" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://twitter.com/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" 
                alt="Twitter" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://www.linkedin.com/in/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" 
                alt="LinkedIn" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
          </div>
        </div>

      </div>
    </footer>

      </div>
    </>
  )
}
