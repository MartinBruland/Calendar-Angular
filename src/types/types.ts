
export type CalendarEvent = {
    id: string,
    title: string;
    description: string;
    tag: string;

    startDate?: Date;
    endDate?: Date;
    status: boolean;
}