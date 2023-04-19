import { program } from 'commander'
import { spawn } from 'child_process'

program.option('-p, --project <string>', 'Specifies project under run')

program.parse()
const PROJECT_TOKEN = '$project'

const options = program.opts()
const [first, ...rest] = program.args.join` `.replace(
  PROJECT_TOKEN,
  options.project
).split` `

const subprocess = spawn(first, rest, { stdio: 'inherit' })
subprocess.on('exit', (code) => process.exit(code))
subprocess.on('close', (code) => process.exit(0))
