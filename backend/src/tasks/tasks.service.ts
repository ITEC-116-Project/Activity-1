import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      text: createTaskDto.text,
      taskTime: new Date(createTaskDto.taskTime),
      isCompleted: false,
    });
    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      order: { addedOn: 'DESC' },
    });
  }

  async findActive(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { isCompleted: false },
      order: { addedOn: 'DESC' },
    });
  }

  async findCompleted(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { isCompleted: true },
      order: { addedOn: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    if (updateTaskDto.text) {
      task.text = updateTaskDto.text;
    }
    if (updateTaskDto.taskTime) {
      task.taskTime = new Date(updateTaskDto.taskTime);
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }

    return await this.tasksRepository.save(task);
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.findOne(id);
    task.isCompleted = true;
    return await this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}