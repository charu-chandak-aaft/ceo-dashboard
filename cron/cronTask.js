// cronTask.js
import cron from 'node-cron';
import axios from 'axios';

console.log('⏳ Cron service started...');

// Schedule a task to run at 5:00 AM daily
cron.schedule('0 5 * * *', async () => {
  console.log(`🚀 Running attendance sync at ${new Date().toLocaleString()}`);

  try {
    const response = await axios.get('/api/attendance-sync');

    console.log('✅ Sync success:', response.data);
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
});
