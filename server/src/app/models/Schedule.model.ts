import { Course } from './Course.model'
import { User } from './User.model';

export interface Schedule {
    _id: string;
    name: string;
    user: User;
    desc: string;
    courses: Course[];
    isPublic: boolean;
    modified: Date;
}