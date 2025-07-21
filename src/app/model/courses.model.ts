export interface Courses {
  total: number;
  limit: number;
  page: number;
  records: Records[]
}

export interface Records {
  completed_on: string;
  country: string;
  course_code: string;
  course_title: string;
  previous_course_valid_until: string;
  status: string;
  training_provider: string;
  valid_from: string;
  valid_until: string;
}