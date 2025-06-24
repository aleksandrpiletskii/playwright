class HomePage {
    async openHomePage(I) {
        await I.amOnPage('/', { waitUntil: 'load' }); // дождаться события load
    }

    async selectCountry(I, countryName) {
        await I.amOnPage('/'); // если не вызывается отдельно
        await I.waitForElement('input[name="destination"]', 10);
        await I.click('input[name="destination"]');

        if (await I.grabNumberOfVisibleElements('.close.icon-i16_close') > 0) {
            await I.click('.close.icon-i16_close');
        }

        await I.fillField('input[name="destination"]', countryName);
    }

    async selectDates(I, fromDate, toDate) {
        await I.click('.date-selector');
        await I.waitForVisible('.calendar-container', 5);

        if (fromDate) {
            await I.click(`//div[contains(@class, "calendar-day") and @data-date="${fromDate}"]`);
        }
        if (toDate) {
            await I.click(`//div[contains(@class, "calendar-day") and @data-date="${toDate}"]`);
        }
    }

    async selectNights(I, minNights, maxNights) {
        await I.click('#mainSearchForm > div.formControl.forNights > div');
        await I.waitForVisible('#mainSearchForm > div.formControl.forNights > div', 5);
        await I.fillField('.min-nights-input', minNights);
        await I.fillField('.max-nights-input', maxNights);
        await I.click('.apply-nights-btn');
    }

    async selectGuests(I, adults, children) {
        await I.click('.guests-selector');
        await I.waitForVisible('.guests-dropdown', 5);

        if (adults !== undefined) {
            let currentAdults = parseInt(await I.grabTextFrom('.adults-count'));
            while (currentAdults !== adults) {
                if (currentAdults < adults) {
                    await I.click('.adults-plus-btn');
                    currentAdults++;
                } else {
                    await I.click('.adults-minus-btn');
                    currentAdults--;
                }
            }
        }

        if (children !== undefined) {
            let currentChildren = parseInt(await I.grabTextFrom('.children-count'));
            while (currentChildren !== children) {
                if (currentChildren < children) {
                    await I.click('.children-plus-btn');
                    currentChildren++;
                } else {
                    await I.click('.children-minus-btn');
                    currentChildren--;
                }
            }
        }

        await I.click('.apply-guests-btn');
    }

    async search(I) {
        await I.click('.search-btn');
        await I.waitForVisible('#startSearch', 30);
    }

    async chooseHotel(I, hotelName) {
        await I.click(`//div[contains(@class, "hotel-item") and contains(., "${hotelName}")]`);
    }

    async chooseRoom(I, roomName) {
        await I.click(`//div[contains(@class, "room-item") and contains(., "${roomName}")]`);
    }

    async bookRoom(I) {
        await I.click('.book-btn');
    }
}

module.exports = new HomePage();
