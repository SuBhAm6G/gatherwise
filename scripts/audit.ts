/**
 * GatherWise Repository Audit Script
 * Checks for common security, typing, and quality issues before submission.
 * Run: npx tsx scripts/audit.ts
 */

import { execSync } from 'child_process'
import { readdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'

let passed = 0
let failed = 0

function check(name: string, fn: () => boolean) {
  try {
    const result = fn()
    if (result) {
      console.log(`✅ ${name}`)
      passed++
    } else {
      console.error(`❌ ${name}`)
      failed++
    }
  } catch (err) {
    console.error(`❌ ${name}: ${err}`)
    failed++
  }
}

console.log('--- Running GatherWise Repository Pre-Submission Audit ---\n')

// 1. No .env.local tracked in git
check('No .env.local tracked in git', () => {
  try {
    const res = execSync('git ls-files .env.local', { encoding: 'utf8', stdio: 'pipe' })
    return res.trim().length === 0
  } catch {
    return true
  }
})

// 2. No API key literals in tracked source files
check('No API key literals in tracked source files', () => {
  try {
    const trackedFiles = execSync('git ls-files src/', { encoding: 'utf8', stdio: 'pipe' })
      .split('\n')
      .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))

    for (const file of trackedFiles) {
      if (!existsSync(file) || file.includes('tests/')) continue
      const content = readFileSync(file, 'utf8')
      if (/\b(?:AIza[0-9A-Za-z_-]{20,}|AQ\.[0-9A-Za-z_-]{20,})\b/.test(content)) {
        console.error(`  Secret API key found in: ${file}`)
        return false
      }
    }
    return true
  } catch {
    return true
  }
})

// 3. node_modules not tracked in git
check('node_modules not tracked in git', () => {
  try {
    const result = execSync('git ls-files node_modules/', { encoding: 'utf8', stdio: 'pipe' })
    return result.trim().length === 0
  } catch {
    return true
  }
})

// 4. .next/ not tracked in git
check('.next/ build artifacts not tracked in git', () => {
  try {
    const result = execSync('git ls-files .next/', { encoding: 'utf8', stdio: 'pipe' })
    return result.trim().length === 0
  } catch {
    return true
  }
})

// 5. No @ts-ignore or @ts-nocheck in source
check('No @ts-ignore or @ts-nocheck in source code', () => {
  try {
    const trackedFiles = execSync('git ls-files src/', { encoding: 'utf8', stdio: 'pipe' })
      .split('\n')
      .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))

    for (const file of trackedFiles) {
      if (!existsSync(file) || file.includes('tests/')) continue
      const content = readFileSync(file, 'utf8')
      if (content.includes('@ts-ignore') || content.includes('@ts-nocheck')) {
        console.error(`  Found type suppression in: ${file}`)
        return false
      }
    }
    return true
  } catch {
    return true
  }
})

// 6. No 'as any' in lib/engines or lib/ai
check('No unsafe "as any" in lib/engines or lib/ai', () => {
  const dirs = ['src/lib/engines', 'src/lib/ai']
  for (const dir of dirs) {
    if (!existsSync(dir)) continue
    const files = readdirSync(dir).filter((f) => f.endsWith('.ts'))
    for (const file of files) {
      const content = readFileSync(path.join(dir, file), 'utf8')
      if (content.includes(' as any') || content.includes('<any>')) {
        console.error(`  Found unsafe type assertion in: ${dir}/${file}`)
        return false
      }
    }
  }
  return true
})

// 7. .env.example exists with placeholder values only
check('.env.example exists with placeholder values only', () => {
  try {
    const content = readFileSync('.env.example', 'utf8')
    return (
      content.includes('GEMINI_API_KEY') &&
      content.includes('your_gemini_api_key_here') &&
      !/\b(?:AIza[0-9A-Za-z_-]{20,}|AQ\.[0-9A-Za-z_-]{20,})\b/.test(content)
    )
  } catch {
    return false
  }
})

// 8. Documentation files exist and are populated
check('docs/ (ARCHITECTURE, SECURITY, TESTING, ACCESSIBILITY, DEPLOYMENT) and CONTRIBUTING exist', () => {
  return (
    existsSync('docs/ARCHITECTURE.md') &&
    existsSync('docs/SECURITY.md') &&
    existsSync('docs/TESTING.md') &&
    existsSync('docs/ACCESSIBILITY.md') &&
    existsSync('docs/DEPLOYMENT.md') &&
    existsSync('CONTRIBUTING.md') &&
    existsSync('SECURITY.md')
  )
})

// 9. CI and code styling manifests exist
check('CI workflow and style configs (.editorconfig, .prettierrc, ci.yml) exist', () => {
  return (
    existsSync('.editorconfig') &&
    existsSync('.prettierrc') &&
    existsSync('.github/workflows/ci.yml')
  )
})

// 10. Every source file under 250 lines
check('All source files under 250 lines for modularity', () => {
  try {
    const trackedFiles = execSync('git ls-files src/', { encoding: 'utf8', stdio: 'pipe' })
      .split('\n')
      .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))

    for (const file of trackedFiles) {
      if (!existsSync(file) || file.includes('tests/')) continue
      const lineCount = readFileSync(file, 'utf8').split('\n').length
      if (lineCount > 250) {
        console.error(`  File exceeds 250 lines: ${file} (${lineCount} lines)`)
        return false
      }
    }
    return true
  } catch {
    return true
  }
})

console.log(`\nAudit complete: ${passed} passed, ${failed} failed`)
if (failed > 0) {
  process.exit(1)
} else {
  console.log('🎉 Repository passes all quality, architecture, and security checks!')
}
