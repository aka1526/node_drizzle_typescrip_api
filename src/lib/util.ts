import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config();
process.env.TZ = 'Asia/Bangkok';

export const generateUUID = (): string => {
  return uuidv4().replace(/-/g, '');
}; 

export const getBangkokTime = () => {
  return moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
};

export const getThresholdTime = (ONLINE_THRESHOLD: number) => {
  // return moment().utcOffset('+07:00')
  //   .subtract(ONLINE_THRESHOLD, 'milliseconds')
  //   .toDate();

  return moment(Date.now() - ONLINE_THRESHOLD)
    .utcOffset('+07:00')
    .format('YYYY-MM-DD HH:mm:ss');
};
