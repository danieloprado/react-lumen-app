import moment from 'moment';

class DateFormatter {

  public parseObj<T extends { [key: string]: any }>(obj: T): T {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      return obj.map(i => this.parseObj(i)) as any;
    }

    if (typeof obj === 'string' && this.isValidDateString(obj)) {
      return moment(obj).toDate() as any;
    }

    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        obj[key] = this.parseObj(obj[key]);
      });
      return obj;
    }

    return obj;
  }

  public parse(value: any, format?: string): Date {
    if (!value) return value;
    if (value instanceof Date) return value;

    const date = moment(value, format);
    if (!date.isValid()) return value;

    return date.toDate();
  }

  public format(date: Date, format: string): string {
    return moment(date).format(format).replace('-feira', '');
  }

  public humanize(date: any): string {
    const now = moment();
    date = moment(date);

    return now.isSame(date, 'day') ?
      `${date.format('HH:mm')} - ${moment.duration(now.diff(date)).humanize()}` :
      now.isSame(date, 'year') ?
        date.format('DD/MMM [às] HH:mm') :
        date.format('DD/MMM/YYYY [às] HH:mm');
  }

  private isValidDateString(value: any): boolean {
    return /^(\d{4})-(\d{2})-(\d{2})([T\s](\d{2}):(\d{2}):(\d{2})(\.(\d+)Z)?)?$/.test(value);
  }
}

export const dateFormatter = new DateFormatter();