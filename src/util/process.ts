import { Frame } from './../types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processData = (series: Frame[]) => {
  const finger_serie = series.filter((serie) => serie.name == 'finger')[0] || [];
  const device_serie = series.filter((serie) => serie.name == 'device')[0] || [];

  if (finger_serie.length != device_serie.length) return { data: [], keys: [] };

  const result: Array<{ [key: string]: any }> = device_serie.fields[1].values.buffer.map((time_num) => ({
    timestamp: dayjs(time_num).tz('Europe/Athens').format('HH:mm'),
  }));
  device_serie.fields[0].values.buffer.map((value, idx) => {
    result[idx]['From Devices'] = value;
    result[idx]['Manual Count'] = finger_serie.fields[0].values.buffer[idx];
  });

  return { data: result, keys: ['From Devices', 'Manual Count'] };
};
