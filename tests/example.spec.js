const { test, expect } = require('@playwright/test');

test('visit main page and choose random tour', async ({ page, context }) => {

    // ставим общий таймаут для теста на 180 секунд
    test.setTimeout(180000);

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

        // ищем кнопку поиска и кликаем по ней
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

        // проверяем, что найдена хотя бы одна кнопка
        if (tourButtons.length > 0) {

            // выбираем случайную кнопку
            const randomIndex = Math.floor(Math.random() * tourButtons.length);
            const randomTourButton = tourButtons[randomIndex];

            // проверим, что кнопка видима перед кликом
            if (await randomTourButton.isVisible()) {
                console.log('Выбираем рандомный тур на серпе');

                // ждем появления новой вкладки после клика
                const [newPage] = await Promise.all([
                    context.waitForEvent('page', { timeout: 120000 }).catch(() => null), // Увеличение времени ожидания до 120 секунд
                    randomTourButton.click()
                ]);

                if (newPage) {
                    console.log('Ждем загрузку отельной');

                    // ждем полной загрузки новой вкладки
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
                    console.log(`Hotel page URL: ${newPageURL}`);

                    // проверяем, что урл содержит нужную нам часть строки
                    const expectedURLs = ['https://travelata.ru/turkey/resorts/', 'https://travelata.ru/turkey/hotels/'];
                    const isValidURL = expectedURLs.some(url => newPageURL.includes(url));
                    expect(isValidURL).toBe(true);

                    // ждем после загрузки страницы, чтобы убедиться, что кнопки загрузились
                    await newPage.waitForSelector('.hotelTour__price-block__text-btn');

                    // получаем все кнопки с локатором ".hotelTour__price-block__text-btn"
                    const hotelButtons = await newPage.locator('.hotelTour__price-block__text-btn').all();

                    // проверим, что найдена хотя бы одна кнопка
                    if (hotelButtons.length > 0) {

                        // выбираем случайную кнопку
                        const randomHotelIndex = Math.floor(Math.random() * hotelButtons.length);
                        const randomHotelButton = hotelButtons[randomHotelIndex];

                        // проверим, что кнопка видима перед кликом
                        if (await randomHotelButton.isVisible()) {
                            console.log('Выбираем рандомный тур на отельной');

                            // ждем изменения урл после клика
                            await randomHotelButton.click();

                            console.log('Ждем загрузку турпейдж');
                            await newPage.waitForLoadState('domcontentloaded');

                            // ждем завершения процесса актуализации
                            await newPage.waitForSelector('.loader-component', { state: 'hidden' });

                            // проверяем успешность клика по урл
                            const finalPageURL = newPage.url();
                            console.log(`Tour page URL: ${finalPageURL}`);

                            // проверяем, что урл содержит нужную нам часть строки
                            const expectedURLs = ['https://travelata.ru/turkey/resorts/', 'https://travelata.ru/turkey/hotels/',
                                'https://travelata.ru/hotel/'];
                            const isValidURL = expectedURLs.some(url => finalPageURL.includes(url));
                            expect(isValidURL).toBe(true);

                            // Ждем появления кнопок с локатором .routeItem__buttons-content
                            await newPage.waitForSelector('.routeItem__buttons-content');

                            // Кликаем на любую доступную кнопку
                            const routeItemButtons = await newPage.locator('.routeItem__buttons-content').first();
                            await routeItemButtons.click();

                            // Добавим отладочный вывод после клика
                            console.log('Кнопка нажата.');

                            // Вводим email и номер телефона
                            const emailField = newPage.locator('input[placeholder="Введите ваш email"]');
                            await emailField.waitFor({ state: 'visible' }); // Добавлено ожидание для email поля
                            await emailField.fill('viv-1995@mail.ru');

                            const phoneField = newPage.locator('.basicCustomerInfoInputField__phone');
                            await phoneField.waitFor({ state: 'visible' }); // Добавлено ожидание для phone поля
                            await phoneField.fill('89157710230');

                            // Кликаем по кнопке "Перейти к бронированию"
                            const bookButton = newPage.locator('.btnText');
                            await bookButton.waitFor(); // Добавлено ожидание для кнопки бронирования

                            // Ждем перезагрузку страницы и проверяем URL
                            await Promise.all([
                                newPage.waitForNavigation({ waitUntil: 'load' }), // Ожидание перезагрузки страницы
                                bookButton.click()
                            ]);

                            console.log('Ждем загрузку чекаута');
                            await newPage.waitForLoadState('domcontentloaded');

                            // Проверка URL после перезагрузки страницы
                            const checkoutPageURL = newPage.url();
                            console.log(`Checkout page URL: ${checkoutPageURL}`);
                            expect(checkoutPageURL).toContain('https://payment.travelata.ru/quote/checkout');

                        } else {
                            console.error('Кнопку не видно');
                        }
                    } else {
                        console.error('Кнопок с таким локатором нет на странице ".hotelTour__price-block__text-btn"');
                    }

                } else {
                    console.error('Новую вкладку не удалось открыть');
                }

            } else {
                console.error('Кнопку не видно');
            }
        } else {
            console.error('Кнопок с таким локатором нет на странице ".button__text-main"');
        }

        // ставим ожидание 20 сек, чтобы браузер оставался открытым, чтобы глянуть на результат
        await page.waitForTimeout(20000);

    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
});
