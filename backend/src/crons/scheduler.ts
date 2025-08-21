import cron from 'node-cron';
import { processRecurringTransactions } from './jobs/transaction.job';
import { processReportJob } from './jobs/report.job';

const scheduleJob=(name :string ,time:string,job:Function)=>{
    console.log(`Scheduling job: ${name} at ${time}`);

    return cron.schedule(time, async () => {
        try {
            console.log(`Executing job: ${name}`);
            await job();
            console.log(`Job ${name} completed successfully`);
        } catch (error) {
            console.error(`Error executing job ${name}:`, error);
        }
    },
    {
       scheduled: true,
       timezone: "UTC",
    }
    );
};

    


export const startJobs = () => {
  return [
    scheduleJob("Transactions", "5 0 * * *", processRecurringTransactions),

    //run 2:30am every first of the month
    scheduleJob("Reports", "*/1 * * * *", processReportJob),
  ];
};