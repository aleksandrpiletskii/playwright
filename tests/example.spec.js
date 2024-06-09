const { test, expect } = require('@playwright/test');

test('main functional smoke testing', async ({ page, context }) => {
  // устанавливаем общий таймаут для теста на 120 сек
  test.setTimeout(120000);

  try {
    await page.goto('https://travelata.ru/');

    const inputDestination = page.locator("input[name='destination']");
    await inputDestination.waitFor();
    await inputDestination.fill('Турция');

    // скрываем попап, если он есть
    await page.evaluate(() => {
      const overlay = document.querySelector('.ui-widget-overlay.custom');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    const divStartSearch = page.locator("#startSearch");
    await divStartSearch.waitFor();
    await divStartSearch.click();

    // ждем загрузки новой страницы с результатами поиска
    await page.waitForNavigation({ waitUntil: 'load' });

    // скрываем попап, если он есть
    await page.evaluate(() => {
      const overlay = document.querySelector('.ui-widget-overlay.custom');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    // ждем после загрузки страницы, чтобы убедиться, что кнопки загрузились
    await page.waitForSelector('.button__text-main');

    // получаем все кнопки с локатором ".button__text-main"
    const tourButtons = await page.locator(".button__text-main").all();

    // проверим, что найдена хотя бы одна кнопка
    if (tourButtons.length > 0) {
      // выбираем случайную кнопку
      const randomIndex = Math.floor(Math.random() * tourButtons.length);
      const randomTourButton = tourButtons[randomIndex];

      // проверим, что кнопка видима перед кликом
      if (await randomTourButton.isVisible()) {
        // ожидаем появления новой вкладки после клика
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          randomTourButton.click()
        ]);

        // ожидаем полной загрузки новой вкладки
        await newPage.waitForLoadState('load');

        // скрываем попап на новой вкладке, если он есть
        await newPage.evaluate(() => {
          const overlay = document.querySelector('.ui-widget-overlay.custom');
          if (overlay) {
            overlay.style.display = 'none';
          }
        });

        // проверяем успешность клика по урл
        const newPageURL = newPage.url();
        console.log(`New page URL: ${newPageURL}`);
        // проверяем, что урл содержит нужную нам часть строки
        const expectedURLs = ['https://travelata.ru/turkey/resorts/', 'https://travelata.ru/turkey/hotels/'];
        const isValidURL = expectedURLs.some(url => newPageURL.includes(url));
        expect(isValidURL).toBe(true);
      } else {
        console.error('Кнопку не видно');
      }
    } else {
      console.error('Кнопок с таким локатором нет на странице ".button__text-main"');
    }

    // ставим ожидание 20 сек, чтобы браузер оставался открытым
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('An error occurred:', error);
  }
});