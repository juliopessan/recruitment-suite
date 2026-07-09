#!/usr/bin/env node

const { chromium } = require('playwright')

const BASE_URL = 'https://recruitment-suite.vercel.app'

async function runTests() {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
  })

  const context = await browser.newContext()
  const page = await context.newPage()

  console.log('\n🧪 Testing Navigation Flow: Landing → Login → Dashboard\n')

  try {
    // Test 1: Landing page with header and sign in button
    console.log('Test 1: Landing page with header and sign in button')
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })

    const headerLogo = await page.locator('header').isVisible()
    const signInButton = await page.locator('button:has-text("Sign In")').isVisible().catch(() => false)

    if (headerLogo && signInButton) {
      console.log('✓ PASS: Landing page header and sign in button visible\n')
    } else {
      console.log('✗ FAIL: Missing header or sign in button\n')
    }

    // Test 2: Navigate from landing to login
    console.log('Test 2: Navigate from landing to login')
    const beforeUrl = page.url()
    await page.click('header button:has-text("Sign In"), button:has-text("Sign in")', { timeout: 5000 }).catch(() => {})
    await page.waitForLoadState('networkidle').catch(() => {})
    const afterUrl = page.url()

    if (afterUrl.includes('/login')) {
      console.log('✓ PASS: Navigated to login page')
      console.log(`  URL: ${afterUrl}\n`)
    } else {
      console.log(`✗ FAIL: Did not navigate to login (URL: ${afterUrl})\n`)
    }

    // Test 3: Check login page elements
    console.log('Test 3: Login page elements')
    const loginHeader = await page.locator('header h1, header div').isVisible().catch(() => false)
    const emailInput = await page.locator('input[type="email"]').isVisible().catch(() => false)
    const passwordInput = await page.locator('input[type="password"]').isVisible().catch(() => false)
    const loginButton = await page.locator('button:has-text("Log In")').isVisible().catch(() => false)

    if (loginHeader && emailInput && passwordInput && loginButton) {
      console.log('✓ PASS: All login page elements visible\n')
    } else {
      console.log(`✗ FAIL: Missing elements (header: ${loginHeader}, email: ${emailInput}, password: ${passwordInput}, button: ${loginButton})\n`)
    }

    // Test 4: Navigate back from login to landing
    console.log('Test 4: Navigate back from login to landing')
    const backButton = await page.locator('button:has-text("Back")').isVisible().catch(() => false)
    if (backButton) {
      await page.click('button:has-text("Back")')
      await page.waitForLoadState('networkidle').catch(() => {})
      const backUrl = page.url()

      if (backUrl === BASE_URL + '/' || backUrl === BASE_URL) {
        console.log('✓ PASS: Navigated back to landing page')
        console.log(`  URL: ${backUrl}\n`)
      } else {
        console.log(`✗ FAIL: Did not navigate back to landing (URL: ${backUrl})\n`)
      }
    } else {
      console.log('✗ FAIL: Back button not found\n')
    }

    // Test 5: Login and navigate to dashboard
    console.log('Test 5: Login and navigate to dashboard')
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' })

    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Log In")')

    try {
      await page.waitForLoadState('networkidle')
      const dashboardUrl = page.url()

      if (dashboardUrl === BASE_URL + '/' || !dashboardUrl.includes('/login')) {
        console.log('✓ PASS: Logged in and navigated to dashboard')
        console.log(`  URL: ${dashboardUrl}\n`)
      } else {
        console.log(`✗ FAIL: Did not navigate to dashboard (URL: ${dashboardUrl})\n`)
      }
    } catch (e) {
      console.log('⚠ WARNING: Navigation timeout during login\n')
    }

    // Test 6: Check dashboard navbar
    console.log('Test 6: Dashboard navbar elements')
    const navbar = await page.locator('nav').isVisible().catch(() => false)
    const homeButton = await page.locator('button[title*="dashboard"], button[title*="home"]').isVisible().catch(() => false)
    const logoutButton = await page.locator('button[title*="Sign out"], button[title*="Logout"]').isVisible().catch(() => false)

    if (navbar && (homeButton || logoutButton)) {
      console.log('✓ PASS: Dashboard navbar elements visible')
      console.log(`  Navbar: ${navbar}, Home: ${homeButton}, Logout: ${logoutButton}\n`)
    } else {
      console.log(`✗ FAIL: Missing navbar elements (navbar: ${navbar}, home: ${homeButton}, logout: ${logoutButton})\n`)
    }

    console.log('✨ Navigation tests completed!')
  } catch (error) {
    console.error('❌ Test error:', error.message)
  } finally {
    await browser.close()
  }
}

runTests()
