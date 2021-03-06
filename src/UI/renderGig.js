import createGig from '../modules/createGig.js';
import createMonth from '../modules/createMonth.js';
import renderMainGigs from './renderMainGigs.js';
import sortData from '../modules/sortData.js';
import { isPast } from 'date-fns';

class RenderGig {
  form = document.querySelector('.edit-section__add');
  formElement = document.querySelector('.edit-window__form');
  inputs = document.querySelectorAll('.edit-window__input');
  dateInput = document.querySelector('.edit-window__input-date');

  handlerAddGigBtns() {
    window.addEventListener('click', this.renderForm.bind(this));
    this.formElement.addEventListener('submit', this.readFormData.bind(this));
    window.addEventListener('click', this.lockDateToSelectedMonth.bind(this));
  }

  renderForm(e) {
    if (!e.target.closest('.aside-menu__dates-content-item--btn')) return;

    document.querySelector('.header-main-title__text').textContent = '';

    this.form.classList.remove('u-no-display');

    createGig.selectMonthFromArray(e);
  }

  readFormData(e) {
    e.preventDefault();

    this.inputs.forEach(input => {
      createGig.values.push(input.value);
    });

    this.form.classList.add('u-no-display');

    createGig.addFormData();
  }

  formReset() {
    this.formElement.reset();
  }

  lockDateToSelectedMonth(e) {
    if (!e.target.closest('.aside-menu__dates-content-item--btn')) return;

    const daysInMonth = {
      January: 31,
      February: +`${createMonth.todaysDate.split('/')[2] % 4 === 0 ? 29 : 28}`,
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };
    const lastDayInMonth =
      daysInMonth[
        e.target.parentElement.previousElementSibling.textContent.trim()
      ];
    const selectedMonth =
      sortData.months[
        e.target.parentElement.previousElementSibling.textContent.trim()
      ];
    const currentYear = createMonth.todaysDate.split('/')[2];
    const currentDay = createMonth.todaysDate.split('/')[0];
    const minDate = `${currentYear}-${
      selectedMonth.toString().length === 1
        ? `0${selectedMonth}`
        : selectedMonth
    }-01`;
    const minDateToday = `${currentYear}-${
      selectedMonth.toString().length === 1
        ? `0${selectedMonth}`
        : selectedMonth
    }-${currentDay.toString().length === 1 ? `0${currentDay}` : currentDay}`;
    const maxDateThisYear = `${currentYear}-${
      selectedMonth.toString().length === 1
        ? `0${selectedMonth}`
        : selectedMonth
    }-${lastDayInMonth}`;
    const minDateNextYear = `${+currentYear + 1}-${
      selectedMonth.toString().length === 1
        ? `0${selectedMonth}`
        : selectedMonth
    }-01`;
    const maxDateNextYear = `${+currentYear + 1}-${
      selectedMonth.toString().length === 1
        ? `0${selectedMonth}`
        : selectedMonth
    }-${lastDayInMonth}`;

    // Set date setting to default to this year if the month hasn't passed yet
    if (!isPast(new Date(maxDateThisYear))) {
      this.dateInput.setAttribute(
        'min',
        +sortData.months[
          e.target.parentElement.previousElementSibling.textContent.trim()
        ] === +createMonth.todaysDate.split('/')[1]
          ? minDateToday
          : minDate
      );
      this.dateInput.setAttribute('max', maxDateThisYear);
    }

    // Set date setting to default to next year if the month has already passed
    if (isPast(new Date(maxDateThisYear))) {
      this.dateInput.setAttribute('min', minDateNextYear);
      this.dateInput.setAttribute('max', maxDateNextYear);
    }
  }
}

export default new RenderGig();
