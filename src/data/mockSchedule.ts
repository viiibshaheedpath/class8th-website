export interface StudySession {
  day: string;
  startTime: string;
  endTime: string;
  goal: string;
}

export interface SubjectSchedule {
  name: string;
  sessions: StudySession[];
}

export interface StudySchedule {
  id: string;
  userId: string;
  title: string;
  subjects: SubjectSchedule[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const mockSchedule: StudySchedule = {
  id: 'schedule-1',
  userId: 'user-student',
  title: 'Weekly Revision Plan',
  isActive: true,
  startDate: '2026-07-20',
  endDate: '2026-07-26',
  subjects: [
    {
      name: 'Mathematics',
      sessions: [
        {
          day: 'Monday',
          startTime: '17:00',
          endTime: '18:00',
          goal: 'Rational Numbers revision'
        }
      ]
    },
    {
      name: 'Physics',
      sessions: [
        {
          day: 'Wednesday',
          startTime: '16:00',
          endTime: '17:30',
          goal: 'Forces and Motion simulation practice'
        }
      ]
    }
  ]
};
