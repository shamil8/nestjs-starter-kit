import { exec } from 'child_process';
import { ConfigService } from '@nestjs/config';
import { sleepTimeout, timeToMs } from '@app/crypto-utils/functions/time.util';

import { LoggerService } from '../../logger/services/logger.service';

export class BackupListener {
  private readonly dbName!: string;
  private readonly dbLink!: string;

  private readonly sleepDays = timeToMs(1, 'day');

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    // TODO:: improve this code!
    this.dbName = 'sham';
    this.dbLink = 'shamiksky';
  }

  async backupLoop(sleepTime = '22:00', saveLast = 5): Promise<void> {
    const path = `../dumps/dumps_${this.dbName}`;
    const isLoop = true;
    let isDiff = false;

    this.logger.verbose('Dump path from root app:', { path });

    while (isLoop) {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      const sleepDate = new Date(`${dateStr}T${sleepTime}`).getTime();
      const diff = sleepDate - today.getTime();

      this.logger.verbose('Start data', { dateStr, sleepDate, diff });

      try {
        isDiff &&
          exec(
            `mkdir -p "${path}" && pg_dump ${this.dbLink} > "${path}/${this.dbName}_${dateStr}.sql"`,
            (err, out) => {
              if (err) {
                this.logger.error('Error in pgDump', {
                  extra: err,
                  stack: this.backupLoop.name,
                });
              }

              this.logger.verbose('Try to remove old dumps!', { stdout: out });

              exec(`ls ${path}/*.sql -A1 | sort`, (err, stdout) => {
                if (err) {
                  this.logger.error('Error not found old dump files!', {
                    extra: err,
                    stack: this.backupLoop.name,
                  });
                }

                const files = stdout.split('\n').filter((f) => !!f);

                if (files.length <= saveLast) {
                  return;
                }

                files.splice(files.length - saveLast, saveLast);

                const fileNames = files.join(' ');

                exec(`rm -f ${fileNames}`, (err) => {
                  if (err) {
                    this.logger.error('Error when I try to remove old files', {
                      extra: err,
                      stack: this.backupLoop.name,
                    });
                  }

                  this.logger.verbose('Removed these files', { fileNames });
                });
              });
            },
          );
      } catch (e) {
        this.logger.error(`Error in ${this.backupLoop.name}`, {
          extra: e,
          stack: this.backupLoop.name,
        });
      }

      await sleepTimeout(isDiff && diff <= 0 ? this.sleepDays : diff);

      isDiff = true;
    }
  }
}
