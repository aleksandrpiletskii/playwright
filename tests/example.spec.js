const { test, expect } = require('@playwright/test');

test('booking process', async ({ page, context }) => {

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

        // ждем загрузку СЕРПа с результатами поиска
        await page.waitForNavigation({ waitUntil: 'load' });

        // скрываем попап, если он есть
        await page.evaluate(() => {
            const overlay = document.querySelector('.ui-widget-overlay.custom');
            if (overlay) {
                overlay.style.display = 'none';
            }
        });

        // ждем после загрузки СЕРПа, чтобы убедиться, что кнопки загрузились
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
                console.log('Выбираем рандомный тур на СЕРПе');

                // ждем появления вкладки отельной страницы после клика
                const [newPage] = await Promise.all([
                    context.waitForEvent('page', { timeout: 120000 }).catch(() => null),
                    randomTourButton.click()
                ]);

                if (newPage) {
                    console.log('Ждем загрузку отельной');

                    // ждем полной загрузки отельной страницы
                    await newPage.waitForLoadState('load');

                    // скрываем попап на отельной, если он есть
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

                            // проверяем и закрываем попап изменения стоимость тура, если он появился
                            const popups = await newPage.locator('.popupWithTemplate').all();
                            for (const popup of popups) {
                                if (await popup.isVisible()) {
                                    console.log('Стоимость тура изменилась');
                                    const closeButton = popup.locator('.priceOrRouteChanged__button');
                                    await closeButton.click();
                                }
                            }

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

                            // ждем появления кнопок с локатором .routeItem__buttons-content
                            await newPage.waitForSelector('.routeItem__buttons-content');

                            // кликаем на любую доступную кнопку
                            const routeItemButtons = await newPage.locator('.routeItem__buttons-content').first();
                            await routeItemButtons.click();

                            // добавим отладочный вывод после клика
                            console.log('Выбираем рандомный тур на турпейдж');

                            // вводим email и номер телефона
                            const emailField = newPage.locator('input[placeholder="Введите ваш email"]');
                            await emailField.waitFor({ state: 'visible' }); // ожидание для поля email
                            await emailField.fill('viv-1995@mail.ru');

                            const phoneField = newPage.locator('.basicCustomerInfoInputField__phone');
                            await phoneField.waitFor({ state: 'visible' }); // ожидание для поля phone
                            await phoneField.fill('89157710230');

                            // кликаем по кнопке "Перейти к бронированию"
                            const bookButton = newPage.locator('.btnText');
                            await bookButton.waitFor(); // ожидание для кнопки бронирования

                            console.log('Ждем загрузку чекаута');
                            await newPage.waitForLoadState('domcontentloaded');

                            // ждем загрузку страницы чекаута и проверяем урл
                            await Promise.all([
                                newPage.waitForNavigation({ waitUntil: 'load' }), // ожидание перезагрузки страницы
                                bookButton.click()
                            ]);

                            // проверка урл после перезагрузки страницы
                            const checkoutPageURL = newPage.url();
                            console.log(`Checkout page URL: ${checkoutPageURL}`);
                            expect(checkoutPageURL).toContain('https://payment.travelata.ru/quote/checkout');

                        } else {
                            console.error('Кнопку тура на отельной не видно');
                        }
                    } else {
                        console.error('Кнопок с локатором ".hotelTour__price-block__text-btn" нет на отельной странице');
                    }

                } else {
                    console.error('Отельную страницу не удалось открыть');
                }

            } else {
                console.error('Кнопку тура на СЕРПе не видно');
            }
        } else {
            console.error('Кнопок с локатором ".button__text-main" нет на странице СЕРП');
        }

        // жидание 20 сек, чтобы браузер оставался открытым, чтобы посмотреть на результат
        await page.waitForTimeout(20000);

    } catch (error) {
        console.error('Произошла какая-то ошибка:', error);
    }
});