import puppeteer from "puppeteer";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);
  page.setDefaultTimeout(30000);
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("error", (err) => console.error("PAGE ERROR:", err));
  page.on("pageerror", (pageErr) => console.error("PAGE ERROR:", pageErr));

  return { browser, page };
};

const login = async (page) => {
  try {
    console.log("Navigating to the login page...");
    await page.goto("https://www.micarrefour.com.ar/", {
      waitUntil: "networkidle0",
      timeout: 90000,
    });

    console.log("Clicking on the login button...");
    await page.waitForSelector(".ingresar_acceder_hogar", { visible: true });
    await page.click(".ingresar_acceder_hogar");

    await delay(5000);

    console.log("Taking screenshot before login button click...");
    await page.screenshot({ path: "before_login_button_click.png" });

    console.log("Waiting for email input to be visible...");
    await page.waitForSelector("#email", { visible: true });
    await page.type("#email", process.env.CARREFOUR_EMAIL);

    console.log("Waiting for password input to be visible...");
    await page.waitForSelector("#password", { visible: true });
    await page.type("#password", process.env.CARREFOUR_PASSWORD);

    console.log("Taking screenshot after filling email and password...");
    await page.screenshot({ path: "after_filling_email_and_password.png" });

    console.log("Submitting login form...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click('#login-form button[type="submit"]'),
    ]);

    console.log("Login completed.");
    await page.screenshot({ path: "after_login.png" });
  } catch (error) {
    console.error("Error during login:", error);
    const screenshotPath = "error_screenshot.png";
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot of the error saved at ${screenshotPath}`);
    throw error;
  }
};

(async () => {
  const { browser, page } = await startBrowser();
  try {
    await login(page);
    console.log("Logged in successfully.");
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
