import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, phoneNumber, birthDate, password } = createUserDto;

    // Check if email already exists
    const existingUser = await this.userRepo.existsBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      name,
      email,
      phoneNumber,
      birthDate,
      passwordHash,
    });

    return this.userRepo.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'birthDate',
        'role',
        'isActive',
      ],
    });
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }
}
