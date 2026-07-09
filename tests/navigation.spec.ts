import { test, expect } from '@playwright/test'

const BASE_URL = 'https://recruitment-suite.vercel.app'

test.describe('Navigation Flow: Landing → Login → Dashboard', () => {
  test('should display landing page with header and sign in button', async ({ page }) => {
    await page.goto(BASE_URL)

    // Verify landing page is displayed
    await expect(page).toHaveTitle(/.*/)

    // Check for header with Recruitment Suite branding
    const headerLogo = page.locator('header h1, header div:has-text("Recruitment Suite")')
    await expect(headerLogo).toBeVisible()

    // Check for Sign In button
    const signInButton = page.locator('header button:has-text("Sign In"), button:has-text("Sign in")')
    await expect(signInButton).toBeVisible()

    // Verify hero section is visible
    const heroTitle = page.locator('h1:has-text("Hire Better, Faster, Smarter")')
    await expect(heroTitle).toBeVisible()

    console.log('✓ Landing page loaded successfully')
  })

  test('should navigate from landing to login when clicking sign in', async ({ page }) => {
    await page.goto(BASE_URL)

    // Click Sign In button
    const signInButton = page.locator('header button:has-text("Sign In"), button:has-text("Sign in")')
    await signInButton.click()

    // Wait for navigation and verify we're on login page
    await page.waitForURL('**/login')

    // Check for login page header
    const loginHeader = page.locator('header h1, header div:has-text("Recruitment Suite")')
    await expect(loginHeader).toBeVisible()

    // Check for back button
    const backButton = page.locator('button:has-text("Back")')
    await expect(backButton).toBeVisible()

    // Check for login form
    const emailInput = page.locator('input[type="email"], input[placeholder*="example.com"]')
    await expect(emailInput).toBeVisible()

    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    const loginButton = page.locator('button:has-text("Log In"), button:has-text("Logging in")')
    await expect(loginButton).toBeVisible()

    console.log('✓ Navigated to login page successfully')
  })

  test('should navigate back from login to landing', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Click Back button
    const backButton = page.locator('button:has-text("Back")')
    await expect(backButton).toBeVisible()
    await backButton.click()

    // Wait for navigation and verify we're back on landing
    await page.waitForURL(BASE_URL + '/')

    // Check for hero title to confirm we're on landing
    const heroTitle = page.locator('h1:has-text("Hire Better, Faster, Smarter")')
    await expect(heroTitle).toBeVisible()

    console.log('✓ Navigated back to landing page successfully')
  })

  test('should login and navigate to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Fill in login form
    const emailInput = page.locator('input[type="email"], input[placeholder*="example.com"]')
    await emailInput.fill('test@example.com')

    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('password123')

    // Click Log In button
    const loginButton = page.locator('button:has-text("Log In"), button:has-text("Logging in")')
    await loginButton.click()

    // Wait for navigation to dashboard
    await page.waitForURL(BASE_URL + '/', { timeout: 10000 })

    // Check for dashboard navbar
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()

    // Check for user info in navbar (should appear after login)
    const userInfo = page.locator('p:has-text("test")')
    await expect(userInfo.first()).toBeVisible({ timeout: 5000 })

    // Check for logout button
    const logoutButton = page.locator('button[title*="Sign out"], button[title*="Logout"]')
    await expect(logoutButton).toBeVisible()

    console.log('✓ Logged in and navigated to dashboard successfully')
  })

  test('should display navbar with home button on dashboard', async ({ page }) => {
    // First, login
    await page.goto(`${BASE_URL}/login`)
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button:has-text("Log In")').click()
    await page.waitForURL(BASE_URL + '/')

    // Check navbar elements
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()

    // Check for menu toggle button
    const menuButton = page.locator('button[title*="sidebar"]')
    await expect(menuButton).toBeVisible()

    // Check for home button
    const homeButton = page.locator('button[title*="dashboard"], button[title*="home"]')
    await expect(homeButton).toBeVisible()

    // Check for logout button
    const logoutButton = page.locator('button[title*="Sign out"], button[title*="Logout"]')
    await expect(logoutButton).toBeVisible()

    console.log('✓ Dashboard navbar displayed correctly')
  })

  test('should logout and return to landing page', async ({ page }) => {
    // First, login
    await page.goto(`${BASE_URL}/login`)
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button:has-text("Log In")').click()
    await page.waitForURL(BASE_URL + '/')

    // Click logout button
    const logoutButton = page.locator('button[title*="Sign out"], button[title*="Logout"]')
    await logoutButton.click()

    // Should be redirected to login or landing
    await page.waitForURL(BASE_URL + '/**', { timeout: 5000 })

    // Check if we're on login or landing
    const currentUrl = page.url()
    const isOnLoginOrLanding = currentUrl.includes('/login') || currentUrl === BASE_URL + '/'
    expect(isOnLoginOrLanding).toBeTruthy()

    console.log('✓ Logged out successfully')
  })

  test('should verify landing page sections are visible', async ({ page }) => {
    await page.goto(BASE_URL)

    // Check for main sections
    const sections = [
      'h1:has-text("Hire Better, Faster, Smarter")', // Hero
      'h2:has-text("How It Works")',                  // How it works
      'h2:has-text("Powerful Features")',             // Features
      'h2:has-text("Why Teams Love")',               // Benefits
    ]

    for (const selector of sections) {
      const element = page.locator(selector)
      await expect(element).toBeVisible({ timeout: 10000 })
    }

    console.log('✓ All landing page sections are visible')
  })

  test('should verify responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(BASE_URL)

    // Check header is still visible
    const headerLogo = page.locator('header h1, header div:has-text("Recruitment Suite")')
    await expect(headerLogo).toBeVisible()

    // Check Sign In button is still visible
    const signInButton = page.locator('header button:has-text("Sign In"), button:has-text("Sign in")')
    await expect(signInButton).toBeVisible()

    // Check hero content is visible
    const heroTitle = page.locator('h1:has-text("Hire Better, Faster, Smarter")')
    await expect(heroTitle).toBeVisible()

    console.log('✓ Mobile responsive design verified')
  })
})
