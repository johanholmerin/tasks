import { h } from 'preact';
import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';
import styles from './DateSheet.css';
import Sheet from '../Sheet/Sheet.jsx';
import Button from '../Button/Button.jsx';
import {
  getDayInitials,
  getWeeksInMonth,
  getISODateString
} from '../../utils/date.js';
import { isSameDay, isToday, addMonths } from 'date-fns';

const TableHead = memo(() => (
  <thead>
    <tr>
      {getDayInitials().map(day => (
        <th
          key={day.name}
          title={day.name}
          className={[styles.heading]}
        >{day.initial}</th>
      ))}
    </tr>
  </thead>
));

export default function DateSheet({ onClose, onSave, date = new Date() }) {
  if (!(date instanceof Date)) date = new Date(date);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedMonth, setSelectedMonth] = useState(date);

  const monthStr = new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'long'
  }).format(selectedMonth);
  const weeks = getWeeksInMonth(selectedMonth);

  return (
    <Sheet onClose={onClose} label="Datepicker">
      <div>
        <div className={[styles.header]}>
          <div className={[styles.grow]} />
          <div aria-hidden="true">Date</div>
          <div className={[styles.grow]}>
            <Button
              className={[styles.done]}
              onClick={() => {
                onClose();
                onSave(getISODateString(selectedDate));
              }}
            >Done</Button>
          </div>
        </div>

        <div className={[styles.months]}>
          <button
            className={[styles.monthButton]}
            aria-label="Previous month"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}
          >
            <svg width="24" height="24">
              <path
                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            className={[styles.monthButton, styles.monthButtonRight]}
            aria-label="Next month"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
          >
            <svg width="24" height="24">
              <path
                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className={[styles.month]}>
            <div className={[styles.monthTitle]}>{monthStr}</div>
            <table className={[styles.table]}>
              <TableHead />
              <tbody>
                {weeks.map((week, index) => (
                  <tr key={index}>
                    {week.map(date => (
                      <td className={[styles.td]} key={date}>
                        {date && <button
                          style={{ '--size': `${150/weeks.length}px` }}
                          className={[
                            styles.date,
                            isToday(date) && styles.today,
                            isSameDay(date, selectedDate) && styles.selected
                          ]}
                          onClick={() => setSelectedDate(date)}
                        >{date.getDate()}</button>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Sheet>
  );
}
