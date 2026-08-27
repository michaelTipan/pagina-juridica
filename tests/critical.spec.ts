import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('should load the homepage and check title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Estudio Jurídico/);
    
    // Check WhatsApp float is present
    const whatsappBtn = page.locator('a[aria-label="Escríbenos por WhatsApp"]');
    await expect(whatsappBtn).toBeAttached();
  });

  test('should have a working contact form', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('h1')).toContainText('Conversemos sobre tu caso');
    
    // Check if form fields exist
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('input[name="correo"]')).toBeVisible();
    await expect(page.locator('textarea[name="mensaje"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Admin CMS', () => {
  test('should protect admin routes and redirect to login', async ({ page }) => {
    await page.goto('/admin');
    // Since it's protected, it should redirect to login
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });
  
  test('login page should render', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1')).toContainText('Acceso Administrativo');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
