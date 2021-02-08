import { Frame } from './../types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processData = (series: Frame[], barOrder: string[]) => {
  let isEqual = true,
    isZero = true;

  const len_0 = series[0].length;

  series.map((serie) => {
    if (serie.length != len_0) {
      isEqual = false;
      return;
    }
  });

  if (!isEqual) return { data: [], keys: [] };

  series.map((serie) => {
    if (Math.max(...serie.fields[0].values.buffer) > 0) {
      isZero = false;
      return;
    }
  });

  if (isZero) return { data: [], keys: [] };

  const result: Array<{ [key: string]: any }> = series[0].fields[1].values.buffer.map((time_num) => ({
    timestamp: time_num,
  }));

  const keys: string[] = barOrder || [];
  series.map((serie) => {
    const group = serie.name || 'dummy';
    barOrder || keys.push(group);
    serie.fields[0].values.buffer.map((value, idx) => {
      result[idx][group] = value;
    });
  });

  return { data: result, keys: keys };
};

export const formatTick = (epoch: React.Key, timezone: string, length: number) => {
  const datetime = dayjs(epoch).tz(timezone);
  if (length <= 30) return datetime.format('HH:mm');
  if (length <= 150) {
    if (datetime.minute() == 0) return datetime.format('HH:mm');
    else return '';
  }

  if (datetime.hour() == 0 && datetime.minute() == 0) return datetime.format('DD/MM 00:00');
  else return '';
};
export const formalFullEpoch = (epoch: React.Key, timezone: string) => {
  return dayjs(epoch).tz(timezone).format('DD/MM HH:mm');
};

const arrCompare = (arr1: string[], arr2: string[]) => {
  if (arr1.length != arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    // if (arr1[i] != arr2[i]) return false;
    if (!arr2.includes(arr1[i])) return false;
  }

  return true;
};

export const getOrder = (series: Frame[], previousOrder: string[] | null) => {
  const newOrder = series.map((serie) => serie.name || 'dummy');
  if (!previousOrder) return newOrder;
  if (!arrCompare(previousOrder, newOrder)) return newOrder;

  return previousOrder;
};
