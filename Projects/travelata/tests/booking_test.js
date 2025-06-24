const HomePage = require('../pages/HomePage');

Feature('Booking flow');

Scenario('Booking a tour', async ({ I }) => {
    await HomePage.openHomePage(I);
    await HomePage.selectCountry(I, 'Турция');
    await HomePage.selectNights(I, 5, 10);
    await HomePage.selectDates(I, '2025-07-01', '2025-07-10');
    await HomePage.selectGuests(I, 2, 1);
    await HomePage.search(I);

    I.see('Результаты поиска');
    await HomePage.chooseHotel(I, 'Hotel Example');
    await HomePage.chooseRoom(I, 'Стандартный номер');
    await HomePage.bookRoom(I);

    I.see('Подтверждение бронирования');
});