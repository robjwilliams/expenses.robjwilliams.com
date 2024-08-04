const puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      // "ignoreHTTPSErrors",
      // "--single-process",
      // "--disable-setuid-sandbox",
      "--no-sandbox",
      // "--disable-dev-shm-usage",
    ],
    // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    // devtools: false,
    // dumpio: true,
  });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("error", (err) => console.error("PAGE ERROR:", err));
  page.on("pageerror", (pageErr) => console.error("PAGE ERROR:", pageErr));

  return { browser, page };
};

const login = async (page) => {
  try {
    console.log("Navigating to the login page...");
    await page.goto("https://www.micarrefour.com.ar/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("Clicking on the login button...");
    await page.locator(".ingresar_acceder_hogar").click();

    // await delay(20000);

    console.log("Taking screenshot before login button click...");
    await page.screenshot({ path: "before_login_button_click.png" });

    console.log("Waiting for email input to be visible...");
    await page.waitForSelector("#email", { visible: true, timeout: 60000 }); // Increase timeout to 20 seconds
    await page.locator("#email").fill(process.env.EMAIL);

    console.log("Waiting for password input to be visible...");
    await page.waitForSelector("#password", { visible: true, timeout: 60000 }); // Increase timeout to 20 seconds
    await page.locator("#password").fill(process.env.PASSWORD);

    console.log("Taking screenshot after filling email and password...");
    await page.screenshot({ path: "after_filling_email_and_password.png" });

    console.log("Submitting login form...");
    await page.waitForSelector('#login-form button[type="submit"]', {
      visible: true,
      timeout: 20000, // Increase timeout to 20 seconds
    });
    await page.locator('#login-form button[type="submit"]').click();

    console.log("Waiting for login to complete...");
  } catch (error) {
    console.error("Error during login:", error);
    const screenshotPath = "error_screenshot.png";
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot of the error saved at ${screenshotPath}`);
  }
};

// export const navigateToBilling = async (page) => {
//   console.log("Waiting for 'Mis Consumos' element to be visible...");

//   await page.locator('li[class*="consumos"]').click();

//   console.log("Waiting for navigation...");
//   await page.waitForNavigation({ waitUntil: "networkidle0" });
// };

(async () => {
  const { browser, page } = await startBrowser();
  await login(page);
  await page.screenshot({ path: "after_login.png" });
  console.log("Logged in successfully.");
  // setTimeout(() => {}, 2000);
  // await navigateToBilling(page);
  // setTimeout(() => {}, 2000);
  // await page.screenshot({ path: "after_navigate.png" });

  await browser.close();
})();
