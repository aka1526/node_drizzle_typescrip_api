import { date } from 'drizzle-orm/mysql-core';
import { db } from '../db/db';
import { UserTable } from '../db/schema/users';
import { count, eq, sql } from 'drizzle-orm';
import { getBangkokTime, getThresholdTime } from '../lib/util';
 
const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes 
  
export const updateUserLastActive = async (userUuid: string) => {
  await db.update(UserTable)
    .set({ 
        lastActive :  getBangkokTime() 
    })
    .where(eq(UserTable.uuid, userUuid));
 
};

export const getOnlineUsers = async () => {
    let ThresholdTime =  getThresholdTime(ONLINE_THRESHOLD);
  // อัพเดท status เป็น N สำหรับ users ที่ inactive
  await db.update(UserTable)
    .set({ status_online: 'N' })
    .where(sql`${UserTable.lastActive} <= ${ThresholdTime}`);
     
    const userOnline = await db.select({count: count()})
    .from(UserTable)
    .where(eq(UserTable.status_online, 'Y'));
  return  userOnline[0].count;
};

export const getOfflineUsers = async () => {
    
     const userOffline = await db.select({count: count()})
      .from(UserTable)
      .where(eq(UserTable.status_online, 'N'));
      
      return userOffline??0;
  };