const { test, expect } = require('@playwright/test');

test('open main page and select random tour', async ({ page }) => {
  try {
    // Устанавливаем общий таймаут для теста на 120 секунд
    test.setTimeout(120000);

    await page.goto('https://travelata.ru/');

    const inputDestination = page.locator("input[name='destination']");
    await inputDestination.waitFor();
    await inputDestination.fill('Турция');

    // Скрываем перекрывающее окно, если оно есть
    await page.evaluate(() => {
      const overlay = document.querySelector('.ui-widget-overlay.custom');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    const divStartSearch = page.locator("#startSearch");
    await divStartSearch.waitFor();
    await divStartSearch.click();

    // Ждем загрузки новой страницы с результатами поиска
    await page.waitForNavigation({ waitUntil: 'load' });

    // Скрываем перекрывающее окно, если оно есть
    await page.evaluate(() => {
      const overlay = document.querySelector('.ui-widget-overlay.custom');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    // Ожидание после загрузки страницы, чтобы убедиться, что кнопки загрузились
    await page.waitForSelector('.button__text-main');

    // Получаем все кнопки с локатором ".button__text-main"
    const tourButtons = await page.locator(".button__text-main").all();

    // Проверяем, что найдена хотя бы одна кнопка
    if (tourButtons.length > 0) {
      // Выбираем случайную кнопку
      const randomIndex = Math.floor(Math.random() * tourButtons.length);
      const randomTourButton = tourButtons[randomIndex];

      // Проверяем, что кнопка видима перед кликом
      if (await randomTourButton.isVisible()) {
        await randomTourButton.click();

        // Проверка успешности клика по URL
        const newPageURL = page.url();
        console.log(`New page URL: ${newPageURL}`);
        // Проверка, что URL содержит часть строки
        expect(newPageURL).toContain('https://travelata.ru/search#?from');
      } else {
        console.error('Button is not visible');
      }
    } else {
      console.error('No buttons found with the locator ".button__text-main"');
    }

    // Установка времени ожидания, чтобы браузер оставался открытым
    await page.waitForTimeout(30000); // Ожидание 30 секунд перед закрытием браузера

  } catch (error) {
    console.error('An error occurred:', error);
  }
});