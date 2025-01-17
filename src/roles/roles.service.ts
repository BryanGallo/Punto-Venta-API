import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.rolRepository.create(createRoleDto);
    await this.rolRepository.save(role);

    return createRoleDto;
  }

  async findAll() {
    const roles = await this.rolRepository.find();
    return roles;
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOneBy({ id });

    if (!rol) {
      //* Usando HTTP exceptions ya otorgados por nest
      throw new NotFoundException(`El rol con el id ${id} no existe`);
    }

    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    await this.rolRepository.save(rol);

    return `El rol con el id ${id} fue actualizado correctamente`;
  }

  async remove(id: number) {
    const rol = await this.findOne(id);

    await this.rolRepository.remove(rol);

    return `La categoría ${id} fue eliminada correctamenta`;
  }
}
