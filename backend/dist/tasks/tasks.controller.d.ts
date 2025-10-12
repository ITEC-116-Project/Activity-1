import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    findAll(): Promise<import("./entities/task.entity").Task[]>;
    findActive(): Promise<import("./entities/task.entity").Task[]>;
    findCompleted(): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: number): Promise<import("./entities/task.entity").Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    completeTask(id: number): Promise<import("./entities/task.entity").Task>;
    remove(id: number): Promise<void>;
}
