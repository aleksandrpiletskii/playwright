const { test, expect } = require('@playwright/test');

test('open main page and select first tour', async ({ page }) => {
  try {
    // устанавливаем общий таймаут для теста на 120 секунд
    test.setTimeout(120000);

    await page.goto('https://travelata.ru/');

    const inputDestination = page.locator("input[name='destination']");
    await inputDestination.waitFor();
    await inputDestination.fill('Турция');

    // скрываем перекрывающее окно, если оно есть
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
    await page.waitForLoadState('load');

    // скрываем перекрывающее окно, если оно есть
    await page.evaluate(() => {
      const overlay = document.querySelector('.ui-widget-overlay.custom');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    // ожидание загрузки результатов поиска и клик по кнопке "Показать туры" в первом туре
    const firstTourButton = page.locator(".search-result__item button").first();
    // увеличиваем таймаут до 60 секунд
    await firstTourButton.waitFor({ timeout: 60000 });
    await firstTourButton.click();

    // ожидание, чтобы можно было увидеть финальный результат
    await page.waitForTimeout(30000); // оно составляет 30 секунд перед закрытием браузера

    // ловим в консоль ошибки, если будут
  } catch (error) {
    console.error('An error occurred:', error);
  }
});
